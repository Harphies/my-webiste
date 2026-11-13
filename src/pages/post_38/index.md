---
path: "/blogs/llm-serving-topologies-and-why-they-matter"
date: "2026-11-01"
title: "LLM serving topologies and why they matter"
author: "Taofeek Olalekan"
timeToRead: "23"
smallTitle: "LLM serving: topology, parallelism and GPU efficiency"
description: "AGG versus prefill–decode disaggregation, then TP, DP, DPA, EP and context parallelism: choosing layouts for latency, throughput and concurrency, with measured GLM-5.3 results."
postNum: "38"
ogimage: "./glm53-topology-envelope.png"
---

*Updated 13 November 2026 with a topology and parallelism framework. The measurements remain the completed 2 November experiment.*

Eight B200 GPUs: one TP8 instance or two TP4 replicas? And when should prefill and decode use separate workers?

These questions involve **two connected decisions**. The serving topology determines where prefill and decode execute: aggregated (AGG) or prefill–decode disaggregated (PD). The parallelism strategy determines how requests, weights, activations and KV state are distributed inside each worker group. Both decisions affect context capacity, concurrency, per-user speed and GPU efficiency.

I’ve been testing GLM-5.3 with NVIDIA Dynamo and SGLang. Before the measurements, it helps to separate those decisions and explain why the right combination changes with the model, traffic and latency requirement.

## Part 1: choose the serving topology

In **aggregated serving**, the same engine handles prompt processing and token generation. Continuous batching and chunked prefill can schedule these together, but they still compete for compute, memory and scheduler time. Adding independent AGG replicas increases fleet capacity; each replica owns its model instance and KV state.

In **PD disaggregation**, prefill workers process the prompt and hand KV state to decode workers, which continue generation. Each pool can have its own replica count, parallelism layout and scheduling limits. This isolates the phases and allows different hardware allocations, at the cost of KV transfer, routing and coordination. [DistServe](https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin) frames the objective as goodput under both first-token and per-token latency constraints.

PD does not guarantee lower TTFT. First-token delay includes queueing, prefill and the handoff needed to start decode. Faster steady-state generation can coexist with a slower first token, as the measurements below show.

| Decision | What it controls | Example in this post |
| --- | --- | --- |
| Serving topology | Whether prefill and decode share an engine or use separate pools | AGG versus PD 3P1D |
| Replication | How many independent engines or coordinated groups serve traffic | One versus two AGG engines |
| Parallelism within each phase | Which GPUs own each request, tensor shard, expert or context segment | TP4/DPA4 prefill versus TP8/DPA8 decode |
| Physical placement | Which links carry collectives and KV transfers | NVLink/NVSwitch within a node; InfiniBand between nodes |

A PD label therefore leaves much unspecified. Three prefill workers and one decoder describe the worker counts; their GPU group sizes determine the hardware budget. My 3P1D deployment uses three TP4 prefills and one TP8 decoder: **3 × 4 + 8 = 20 serving GPUs**.

## Part 2: choose parallelism for each phase and layer

Parallelism has several axes, and an engine can use different axes for attention, dense feed-forward layers and routed experts. A label such as “3D: TP/EP/DP” identifies useful dimensions, but their sizes are not automatically independent factors whose product gives the GPU count. Groups can reuse the same ranks for different layer types; pipeline stages add another placement dimension.

| Strategy | What is distributed | Main use and cost |
| --- | --- | --- |
| Tensor parallelism (TP) | Weight matrices and their computation within layers | Fits large layers and reduces per-rank work; adds frequent collectives |
| Ordinary data parallelism (DP) | Independent requests across complete logical model replicas | Scales capacity; duplicates model allocations and keeps separate KV pools |
| Data-parallel attention (DPA) | Requests across attention groups, each owning its requests’ KV state | Reduces attention/KV duplication in suitable layouts; other layers can remain coordinated |
| Expert parallelism (EP) | Routed experts across ranks | Exploits MoE sparsity; adds token dispatch/combine and sensitivity to routing imbalance |
| Pipeline parallelism (PP) | Consecutive model layers across stages | Fits models across more devices; adds stage transfers and pipeline bubbles |
| Context parallelism (CP) | A request’s sequence work and/or KV state | Supports long contexts and distributes attention work; adds attention communication |
| Sequence parallelism (SP) | Sequence positions of intermediate activations | Often complements TP to reduce replicated activation work/storage; terminology varies by engine |

### TP: matrix sharding and collective latency

TP partitions matrices, including matrices inside experts when configured. In a common transformer implementation, column-parallel projections produce output shards and row-parallel projections combine partial sums with an all-reduce. Some paths use all-gather or reduce-scatter instead. There is no universal rule that every column-parallel operation needs an all-gather or that exactly one all-reduce occurs per layer.

At low batch size, spreading weight reads across more GPUs can shorten decode steps. The gain must exceed collective latency and any kernel-efficiency loss. NVLink helps, but “TP8 fits within a node” does not establish that TP8 is optimal. At higher demand, smaller TP groups plus more replicas may produce better fleet throughput.

### DPA, MLA and the actual KV layout

MLA means **Multi-head Latent Attention**. Its compressed latent KV representation is shared across query heads, so it cannot be split by KV head in the same way as conventional multi-head attention. With ordinary TP, implementations can duplicate that latent cache across ranks even while sharding projections or query-head computation.

DPA instead assigns different requests to different attention groups. Replicated attention weights do **not** mean every group stores every request’s KV cache. In a hybrid layout, attention can still use TP within each group. [Ray’s DPA guide](https://docs.ray.io/en/latest/serve/llm/architecture/serving-patterns/data-parallel.html) explains why this is particularly useful for MLA and why GQA KV-head counts constrain head-wise sharding too.

For MHA with sufficient KV heads, TP can partition the heads and approximately divide the corresponding per-token KV storage. For GQA/MQA, replication may appear once TP exceeds the available KV heads. Context parallelism introduces another way to partition KV state. “Every rank holds identical KV” and “KV memory always divides by TP size” are therefore both too broad without the model and cache layout.

### EP, WideEP and communication backends

EP places different routed experts on different ranks. Tokens are dispatched to their selected experts and their outputs combined. DeepSeek-V3, for example, has 256 routed experts and selects eight per token; shared experts are a separate component. Experts can also be tensor-sharded in hybrid TP/EP layouts, so EP does not inherently require every GPU to hold complete experts or every non-expert layer to be fully replicated.

A common design combines DP attention with EP across the participating ranks: requests stay local for attention and exchange tokens for the MoE layers. The [SGLang large-scale EP design](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/) shows how layer-specific layouts and PD fit together. [vLLM’s EP documentation](https://docs.vllm.ai/en/stable/serving/expert_parallel_deployment/) describes its own group construction; flag meanings and group sizes must be read for the chosen engine.

**WideEP** extends expert distribution over a larger group. An NVL72 system provides a 72-GPU NVLink domain, making wider groups practical; WideEP is not defined as exactly 72 GPUs. It can also span nodes, where the scale-out fabric matters. NVIDIA’s [NVL72 study](https://developer.nvidia.com/blog/scaling-large-moe-models-with-wide-expert-parallelism-on-nvl72-rack-scale-systems/) explores this design.

A larger expert pool does not automatically fix hot experts. Rank balance depends on token routing, expert placement, redundant expert copies where supported, and load balancing. At low concurrency, small dispatch messages and synchronization can dominate. At larger batches, communication can be better amortized, but the slowest expert rank still matters.

**DeepEP** is an [expert-parallel communication library](https://github.com/deepseek-ai/DeepEP), not another parallelism axis. It implements specialized dispatch/combine paths, including throughput-oriented and low-latency variants. NCCL supplies general collective operations; the useful comparison is the measured communication path for a particular phase and message shape.

**Elastic EP** changes the coordinated worker group at runtime and redistributes experts. [vLLM’s implementation](https://vllm.ai/blog/2026-05-14-elastic-expert-parallelism) resizes through DP workers sharing an EP group. That requires coordinated reconfiguration; it differs from adding an independent full replica. A scheduler must place the ranks needed for a runnable group together, often through gang scheduling. Elastic resizing and failure recovery are related operational concerns, but one does not by itself establish the other.

### Prefill parallelism and decode parallelism

Prefill processes many prompt tokens together and is often compute intensive. Long-context attention, uneven prompt lengths and uncached token counts can change its bottleneck. Decode generates successive tokens, and at small batches weight bandwidth and collective latency often dominate. As concurrency and context grow, KV reads, attention compute and expert routing can become limiting.

**Prefill context parallelism (PCP)** distributes a long prompt’s query-token work. Ranks exchange the KV information or partial attention results needed for correct attention. **Decode context parallelism (DCP)** distributes existing context/KV state and combines partial attention results for new queries. This can reduce duplicated KV storage and per-rank reads while adding communication. The [vLLM CP guide](https://docs.vllm.ai/en/stable/serving/context_parallel_deployment/) distinguishes these phase-specific designs. Its DCP terminology and group construction should not be assumed to apply identically to every engine.

SP also uses the sequence dimension, but often refers to activation sharding around TP operations. Long-context attention distribution is more precisely described by the implemented CP algorithm. Neither SP nor CP starts at a universal 32k-token threshold; model limits, memory and communication determine when it helps.

PD permits independent choices for these phases. Different prefill and decode layouts also require a KV transfer path that supports the resulting ownership and cache formats. Separate pools alone do not make arbitrary layouts interoperable.

### DWDP: move expert weights to the request

[Distributed Weight Data Parallelism (DWDP)](https://arxiv.org/abs/2604.01621) explores a different MoE trade-off: each GPU preserves data-parallel execution, while expert weights are distributed across peers and missing weights are fetched on demand. Instead of dispatching tokens through synchronized EP collectives, it fetches weights and uses asynchronous prefetch to manage that cost. The paper evaluates DeepSeek-R1 on GB200 NVL72. It is a research design to assess against remote-weight traffic and local memory needs, not a setting measured in my deployments.

## Choose an objective before choosing a layout

“Low latency”, “high throughput” and “high concurrency” impose different constraints. Concurrency counts active requests; throughput counts completed work per unit time. A larger queue can raise concurrency while making the service worse.

| Requirement | Candidate changes to evaluate | Evidence needed |
| --- | --- | --- |
| Short first-token delay | More prefill capacity, prompt-aware scheduling, PCP for long prompts | Tail TTFT including queueing and PD handoff |
| Fast interactive decoding | Wider TP where weight traffic dominates; low-latency collectives | Per-user token rate and tail ITL at target load |
| High throughput within latency targets | Batching, more replicas, DPA/EP for suitable MoE models | Successful output tokens/s/GPU while meeting both latency targets |
| High concurrency or long sessions | More KV capacity, DPA/CP, cache-aware routing | Resident KV usage, eviction behaviour and tail latency |
| Sparse MoE or sparse attention | Measured routing, expert placement, attention/indexer tuning | Real expert skew, indexer cost, stored KV versus bytes actually read |

Sparse attention can read selected KV entries while still storing a much larger context and scanning index metadata. Reduced attention FLOPs therefore do not imply the same reduction in KV capacity or end-to-end latency.

This is the useful connection to [Together Compiler (TKCC)](https://www.together.ai/blog/together-compiler-continual-compilation-for-ai-inference). The paper’s Section 4.3 and Appendix D search layer-specific layouts using memory feasibility, latency targets, hardware measurements and traffic distributions. Its results favour wider EP in some throughput regimes and higher TP in some tighter interactivity regimes. Those are workload-dependent crossover points, not a universal ranking.

A useful first approximation is:

```text
phase step time ≈ sum over layers of
                  [max(compute time, HBM read time) + exposed communication time]

usable concurrency = min(memory-limited concurrency, latency-limited concurrency)
```

This approximation needs measured collective latency and bandwidth, kernel efficiency, KV layout and expert skew. Overlap, uneven requests and scheduling can change the result. A hardware-spec roofline is a starting bound; a production replay tests whether the implementation reaches it. TKCC’s persistent measurement engines make repeated optimization cheaper, while real traffic exposes effects that random kernel inputs can miss.

For my next comparisons, I would prune layouts that cannot fit weights plus working memory and KV state, measure the promising candidates under explicit TTFT/ITL targets, then repeat as prompt lengths, output lengths, prefix-cache reuse or routing distributions change. The measurements below establish the current baseline.

## The measured deployments

| Deployment | Layout | Serving GPUs | Cold 8k/1k sweep |
| --- | --- | --- | --- |
| AGG 1×TP4 | One engine handling prefill and decode | 4 B200s, lab | C1–128 |
| AGG 2×TP4 | Two independent engines behind the same frontend | 8 B200s, same lab node | C1–256 |
| PD 3P1D | Three TP4 prefill workers feeding one TP8 decoder | 20 B200s, production | C1–128 |

The single TP8 aggregated layout is still a future experiment. Its potential advantages are not measured results in this post.

All three used Dynamo 1.6.0, SGLang 0.5.21, the same pinned GLM-5.3 NVFP4 checkpoint and FP8 KV cache. The checkpoint was `RadixArk/GLM-5.3-NVFP4`, revision `6e389189d564d9d3e4ea7fa284fe91f136d8ae2a`. Their memory budgets, scheduler limits and some kernel/backend settings differed. PD also ran on another cluster. This is a comparison of tested deployments, not an experiment that isolates topology as the only variable.

### How TP, DP and DPA map to these experiments

**Tensor parallelism (TP)** distributes model computation across a GPU group. **Ordinary data parallelism (DP)** serves independent requests using separate complete model replicas.

**Data-parallel attention (DPA)** applies data parallelism to attention: each attention group handles its assigned batches and maintains its own KV state. Other layers retain their configured model parallelism. MoE expert parallelism (EP) is a separate choice; enabling DPA does not automatically enable EP. These distinctions follow the [SGLang 0.5.21 DP/DPA guide](https://github.com/sgl-project/sglang/blob/v0.5.21/docs/docs/advanced_features/dp_dpa_smg_guide.mdx).

Each lab engine used this configuration fragment:

```yaml
tensor-parallel-size: 4
data-parallel-size: 4
enable-dp-attention: true
```

That is **one TP4 engine with four attention groups**, not four complete model copies. The two-replica deployment has **two such engines**. It combines ordinary replication between engines with DPA inside each engine. The outer request router here was **Dynamo**, not SGLang Model Gateway.

The PD prefill workers used TP4/DPA4 and explicitly configured EP4; the decoder used TP8/DPA8. The AGG configuration did not enable that same prefill EP/backend combination. This is another reason not to credit every performance difference to topology alone.

### First, make long context work

My initial target was inputs above 500k tokens while keeping PD prefill at TP4. The recipe-based starting configuration produced a KV pool of only about **328k tokens per rank** in my environment.

A context setting does not allocate the memory needed to serve it. I bounded prefill batches and chunks, disabled decode CUDA graphs on prefill-only workers, adjusted the static memory budget and set prefill maximum running requests (MRR) to four: **one per DPA rank**.

The working prefill settings included `mem-fraction-static: 0.93`, `max-prefill-tokens: 8192` and `chunked-prefill-size: 4096`. The live prefill pool grew above **565k tokens per rank**. These are role- and workload-specific settings, not a universal recipe: a higher static fraction leaves less execution headroom, including for lazily loaded kernels.

I validated a **510,012-token input** and a selected **4,000-request WEKA replay with zero errors**, including inputs above 500k. The total input-plus-output cap was 524,288 tokens. The replay was a bounded subset, not the entire source corpus.

The same PD deployment completed Terminal-Bench with **72/89 tasks solved (80.9%)**. That score belongs to the model, agent harness and serving configuration together. Five agent timeouts remained scored failures. It does not prove that topology tuning improved model accuracy, and it is not an AGG quality score.

### Context capacity also needs a correctness check

[Cloudflare’s GLM-5.3 incident report](https://blog.cloudflare.com/kv-cache-exposure-remediation/) shows why this matters beyond capacity. A prefill pool smaller than the advertised context exposed an SGLang rejection-path bug: decode consumed stale KV pages and returned another request’s data. Successful HTTP responses did not establish correctness.

Our PD pools exceeded the configured cap, but that alone does not prove isolation. The measurements above used SGLang 0.5.21; Cloudflare recommends 0.5.22 or later for the incident fix and related hardening. A runtime review must check the exact image and patches, including transfer failure and deferred-release handling. Dynamo’s cancellation path needs its own verification; an SGLang router fix does not automatically cover it.

My follow-up checks are boundary rejection, cancellation during transfer, and controlled cross-request markers alongside output validation. Those tests remain separate from the successful replay and throughput results reported here.

### Use a cold baseline to compare performance

The WEKA replay had substantial prefix-cache reuse and limited session concurrency. I used a separate cold test to measure the serving curve:

- **8,000-token input target, fixed 1,000 output tokens**, with streaming responses. Server-counted input averaged about 8,012 tokens after templating.
- Concurrency 1, 2, 4, 8, 16, 32, 64 and 128 for every deployment; an additional C256 for 2×TP4.
- `max(32, 4 × concurrency)` measured requests and 16 warmups per point.
- Different seeds and cache salts between points; server-reported token counts.

The 1×TP4 and PD sweeps each completed **1,088 measured requests**. The 2×TP4 sweep completed **2,112**. Every point passed with zero errors and no reported prompt-cache reuse. Both AGG campaigns also captured engine cache counters; the older PD summaries retained client cache evidence. No serving pod replacements or new restarts were observed across the runs.

For 2×TP4, I verified eight distinct GPUs: four on NUMA0 and four on NUMA1. Both workers handled requests at every point; their prompt-token shares were approximately 50/50 at C64, C128 and C256. Those counter windows include warmups.

### Compare at the same total concurrency first

At **C128**, the measured results were:

| Measurement | AGG 1×TP4 | AGG 2×TP4 | PD 3P1D |
| --- | --- | --- | --- |
| Serving GPUs | 4 | 8 | 20 |
| Output tokens/s | 2,139 | 3,652 | 6,785 |
| Output tokens/s/GPU | 535 | 456 | 339 |
| Mean decode tokens/s/user | 21.57 | 34.11 | 94.07 |
| TTFT p50, seconds | 2.244 | 0.939 | 5.619 |
| TTFT p95, seconds | 22.335 | 11.389 | 13.770 |
| Request-average ITL p50, ms | 55.49 | 33.17 | 10.71 |
| Request-average ITL p95, ms | 72.92 | 42.90 | 11.64 |

All serving GPUs count in the denominator, including PD’s twelve prefill GPUs. **TTFT** is time to first token. **ITL percentiles here describe per-request average decode intervals**, not the distribution of every individual token gap. The per-user decode rate excludes the first-token wait; dividing aggregate throughput by concurrency need not reproduce it.

[![Three GLM-5.3 serving configurations: total throughput, throughput per GPU and per-user decode rate across request concurrency.](./glm53-topology-scaling.png)](./glm53-topology-scaling.png)

*Same workload shape; different GPU budgets. Lines stop at their last measured concurrency. [Scalable figure](/plots/glm53-topology-scaling.svg).*

Adding the second TP4 replica increased C128 throughput by **71%**, reduced TTFT p95 by **49%** and reduced ITL p95 by **41%**. Output per GPU fell **15%** at that fixed total concurrency: the demand was now spread across twice the GPUs. The extra capacity improved latency without being fully reflected in per-GPU throughput.

PD still delivered **1.86× the aggregate output** of 2×TP4 and much faster decoding: **94 versus 34 tokens/s/user**. But it used twenty GPUs instead of eight, and its TTFT was not better at this operating point.

### Median TTFT and tail TTFT tell different stories

With one TP4 replica, median TTFT was lower than PD at every tested concurrency, but p95 became higher from C8 onward. Adding the second replica changed that comparison: at C128, **2×TP4 had lower TTFT at both p50 and p95 than PD**, while PD retained much lower decode intervals.

[![GLM-5.3 TTFT and request-average ITL at p50 and p95 for one TP4 replica, two TP4 replicas and PD, across concurrency.](./glm53-topology-latency.png)](./glm53-topology-latency.png)

*TTFT uses seconds; ITL uses milliseconds. Read each percentile separately. [Scalable figure](/plots/glm53-topology-latency.svg).*

So “PD has better latency” is too broad. The answer depends on which latency, percentile and concurrency matters. PD’s generation stage was faster here; 2×TP4 reached the first token sooner at C128. The stage-specific scheduling and memory settings are part of that result, not just the deployment labels.

Low-concurrency points have only 32 measured requests. Their tails are a snapshot, not a contractual guarantee.

### Then compare approximately equal load per replica

C128 across two replicas is not the same demand per engine as C128 on one. A second useful comparison is **1×TP4 at C128 versus 2×TP4 at C256**, where approximate per-replica concurrency matches.

| Measurement | 1×TP4 at C128 | 2×TP4 at C256 |
| --- | --- | --- |
| Output tokens/s | 2,139 | 4,264 |
| Output tokens/s/GPU | 535 | 533 |
| Mean decode tokens/s/user | 21.57 | 21.50 |
| TTFT p95 | 22.335 s | 22.648 s |
| Request-average ITL p95 | 72.92 ms | 74.07 ms |

That is **1.99× aggregate throughput**, nearly unchanged efficiency and similar tail latency. The second replica scaled capacity well when demand increased with it. The total concurrency, sample count and final-point seed differ; this is not a same-concurrency comparison.

There is still a cost to pushing demand. Within 2×TP4, going from C128 to C256 added only **17% throughput**, while TTFT p95 nearly doubled and ITL p95 rose **73%**. C256 reaches configured total MRR, not a latency-qualified operating limit. No latency SLA has been agreed.

### Read the serving envelope

[![GLM-5.3 serving envelope for three tested deployments, comparing mean per-user decode speed with output throughput per serving GPU. Labels show request concurrency.](./glm53-topology-envelope.png)](./glm53-topology-envelope.png)

*The two AGG curves nearly overlap at comparable per-replica load, but their concurrency labels differ. PD occupies a different part of the speed/efficiency envelope. [Scalable figure](/plots/glm53-topology-envelope.svg).*

The envelope makes the distinction visible: extra replicas can extend total service capacity without improving the per-GPU curve. At another operating point, more concurrency can raise GPU efficiency while reducing each user’s speed.

For a workload that needs fast interactive decoding, PD’s measured decode rate matters. For one prioritising throughput per GPU, the AGG points matter. Neither consideration removes the need to meet first-token and context requirements.

### More replicas do not extend one request’s context

Both AGG configurations retained about **396k GPU KV tokens per rank**, despite a configured 524,288-token context cap. The second replica added independent capacity; it did not combine two rank-local pools for a longer request. Greater-than-500k inputs remain validated for PD only.

MRR is also a scheduler limit, not guaranteed usable capacity:

- AGG 1×TP4: MRR 128 per engine, or 32 per DPA rank.
- AGG 2×TP4: two such engines, giving 256 configured slots in total.
- PD: three prefills with MRR 4 each and a decoder with MRR 256. Those stage limits are not added together to define end-to-end concurrency.

KV capacity can bind before the configured request limit as prompts grow. A successful 8k/1k sweep is not evidence that the same concurrency can run near the context cap.

### Why this differs from scaling a typical web service

A new LLM replica loads another complete **logical model**, with its own scheduling and KV state. Some tensors are sharded; others are replicated according to the parallelism settings. Two TP4 engines do not mean exactly twice every allocation, but they do require two logical model instances.

The eight GPUs share an NVLink/NVSwitch fabric. That connectivity does not automatically deduplicate two engines’ weight allocations. Host NUMA placement is a separate consideration; assigning four GPUs to each NUMA group does not create two disconnected NVLink islands.

Host RAM is separate from GPU HBM too. The first lab worker had a 1 TiB host limit and 75 decimal GB of HiCache per rank. For two replicas, I used 800 GiB and 37 GB per rank: **296 GB total main host cache versus 300 GB** before. This helped fit two workers and the client on the node. The cold-cache checks matter when interpreting that host-cache difference.

These measured deployments therefore differ in more than replica count. PD also uses different stage-specific memory, MRR and backend settings. Per-GPU normalization describes an efficiency metric; it does not make those configurations experimentally identical.

### Placement is only the beginning of the PD path

[llm-d’s GKE study](https://llm-d.ai/blog/topology-as-an-end-to-end-contract) connects device allocation, transport verification and router pairing. A matched GPU/NIC allocation does not prove which path a live KV transfer uses. Their UCX/NIXL stack can silently fall back to TCP.

Our checks established GPU/NIC PCIe pairing, NUMA alignment and active InfiniBand links. They did not establish request-level transfer behaviour. Next: correlate requests with per-NIC traffic and transfer timing.

<details>
<summary>Follow-up experiments for this Dynamo PD deployment</summary>

1. Pin Mooncake/verbs versions and map prefill-to-decode paths by device identity.
2. Measure transfer bytes, duration and fabric errors under load; check for unintended paths.
3. Check pinned Dynamo support before evaluating locality-aware pairing. Our single decoder leaves only prefill selection to balance locality, cache reuse and load.

The study uses GKE RoCE and NIXL/UCX; ours uses InfiniBand and Mooncake. Its environment variables and gains are not portable defaults. Test one change at a time against the saved baseline.

</details>

## What remains to test

Next is **one aggregated TP8 instance on the same eight-GPU node**, with a comparable total host-cache budget. I will measure both its serving curve and actual per-rank context capacity before claiming either advantage.

Wider expert parallelism with DPA is another coordinated design, not simply two independent replicas sharing weights. It needs validation for the model, quantization, kernels and pinned runtime. AGG quality evaluation is also separate from the performance results above.

The next experiment should therefore vary both decisions explicitly: AGG or PD placement, then the parallelism layout within each phase. I will compare context capacity, latency-qualified concurrency, first-token delay, decode speed and the entire GPU budget together.

<details>
<summary>Earlier historical GLM-5.2 comparison</summary>

[![Historical GLM-5.3 PD versus GLM-5.2 serving envelope.](./glm53-pd-vs-glm52-envelope.png)](./glm53-pd-vs-glm52-envelope.png)

This older plot compares different models and deployments: GLM-5.3 PD used twenty GPUs and 8,000/1,000 input/output tokens; GLM-5.2 used eight declared GPUs and 8,192/1,024. Client versions, cache controls and sample budgets differed. It is a historical overlay, not the three-configuration experiment above or a controlled model comparison.

</details>

## Data and references

[Download the 25 measured points as CSV](/data/glm53-topology-8k1k-20261102.csv). The data retains exact metrics, request counts, cache evidence and run IDs for PD (27 October), AGG 1×TP4 (1 November) and AGG 2×TP4 (2 November). It includes p99 as well as the p50/p95 shown here; PD has no C256 measurement.

The figures are reproducible from that saved CSV with the website’s `scripts/plot-llm-topologies.py`; generating them sends no inference requests.

- [SGLang 0.5.21 DP, DPA and routing guide](https://github.com/sgl-project/sglang/blob/v0.5.21/docs/docs/advanced_features/dp_dpa_smg_guide.mdx).
- [SGLang 0.5.21 KV pool configurator](https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/model_executor/pool_configurator.py).
- [NVIDIA Dynamo GLM-5.3 recipes](https://github.com/ai-dynamo/dynamo/tree/main/recipes/glm-5.3/sglang) — upstream changes; compare a specific revision before borrowing flags.
- [NVIDIA’s DGX B200 fabric description](https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html) and [CUDA memory model](https://docs.nvidia.com/cuda/cuda-programming-guide/02-basics/understanding-memory.html).
