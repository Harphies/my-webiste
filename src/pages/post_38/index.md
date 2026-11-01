---
path: "/blogs/llm-serving-topologies-and-why-they-matter"
date: "2026-11-01"
title: "LLM serving topologies and why they matter"
author: "Taofeek Olalekan"
timeToRead: "9"
smallTitle: "LLM serving: context, latency and GPU efficiency"
description: "What I measured serving GLM-5.3 with Dynamo and SGLang: TP4 long-context tuning, aggregated versus disaggregated performance, and the limits of tokens per GPU."
postNum: "38"
ogimage: "./glm53-pd-vs-glm52-envelope.png"
---

Eight B200 GPUs. One tensor-parallel instance across all eight, or two instances across four GPUs each? And when does it make sense to separate prompt processing from token generation?

Those decisions affect more than aggregate throughput. They change the memory available for a request's KV cache, the number of requests the engine can admit, and how quickly each user receives tokens.

I explored these tradeoffs while serving GLM-5.3 with NVIDIA Dynamo and SGLang. My work so far covers a production prefill–decode deployment and a four-GPU aggregated deployment in the lab. Here is what worked, what I measured, and what remains to test.

## Start with the workload and the target

Prefill processes the prompt and builds its attention state. Decode then generates tokens using that state, stored in the KV cache. An agentic workload can combine long prompts, repeated prefixes and many short continuations. A cold synthetic throughput test stresses a different shape.

Before choosing a topology, I wanted to answer four questions:

- Can an individual request with more than 500k input tokens complete?
- How long does the user wait for the first token, and how fast does generation proceed?
- How much output can the whole deployment produce under concurrency?
- How efficiently does it use the GPUs assigned to serving?

A topology can improve one answer while making another worse.

| Layout | What it can offer | What needs checking |
| --- | --- | --- |
| One TP8 aggregated instance | One model copy distributed across eight GPUs; potentially more KV headroom per request | Wider GPU communication, batching and actual KV capacity |
| Two TP4 aggregated replicas | Independent scheduling and potentially more aggregate throughput | Two model copies consume more total memory; each replica retains its own admission limit |
| Prefill–decode disaggregation (PD) | Independent tuning of prompt processing and generation | GPU split between stages, KV transfer, routing and uneven utilization |

Here, TP means tensor parallelism. These are design options, not three completed experiments. I have tested PD and one TP4 aggregated instance; the two eight-GPU layouts remain future comparisons.

## The first blocker: a context setting is not a KV allocation

I expected TP4 prefill to support inputs above 500k tokens. The starting configuration, based on NVIDIA's Dynamo recipe, produced a KV pool of about **328k tokens per rank** in my environment.

That was below my target even though the configured context limit was 524,288 tokens. The context setting controls allowed sequence length; it does not create the GPU memory needed to serve it. Model weights, runtime allocations and the cache's per-token storage all matter.

I worked on memory and admission settings while keeping prefill at **TP4/DP4 with data-parallel attention**:

- Reduced maximum running requests to four per prefill worker: **one per DP rank**.
- Bounded prefill batches and chunks.
- Disabled decode CUDA graphs on workers dedicated to prefill.
- Adjusted the static memory budget and verified the resulting live pool.

The working prefill configuration used `mem-fraction-static: 0.93`, `max-running-requests: 4`, `max-prefill-tokens: 8192` and `chunked-prefill-size: 4096`. These settings belong to the tested checkpoint, runtime and worker role; they are not a universal tuning recipe. Increasing the static fraction reduces spare memory for execution and lazily loaded kernels.

With DP attention, request admission and cache capacity must be checked per rank. Adding the rank pools together would overstate the context a single request can use. Lowering concurrency also does not itself manufacture KV memory: it bounds competing demand while the rest of the memory configuration determines pool capacity.

The tuned pool reached about **565k tokens per prefill rank**. The deployment used three TP4 prefill workers and one TP8 decoder: **20 B200 GPUs**, not an eight-GPU deployment. The decoder's live pool was about 1.236 million tokens per rank.

## Validate requests, not just startup

The stack used **Dynamo 1.6.0, SGLang 0.5.21 and a pinned GLM-5.3 NVFP4 checkpoint**, with FP8 KV cache. I checked the live cache pools and allocated devices before sending traffic. In PD, the GPU/NIC allocations were PCIe-paired and NUMA-aligned on active InfiniBand.

Then I validated a **510,012-token input**, allowing 8,192 output tokens within the 524,288-token total context cap. The bounded WEKA replay also completed requests with inputs above 500k; the largest measured input was 504,862 tokens.

The replay completed **4,000 requests with zero errors**. That was a selected workload, not an exhaustive run of the source corpus: 32 traces were selected after excluding traces containing zero-output records and applying a context-fit filter. The request-count stop left some continuations unfinished.

The same deployment completed Terminal-Bench with **72 of 89 tasks solved, or 80.9%**. That is a result for the model, agent harness and serving configuration together. It does not demonstrate that topology tuning improved model accuracy. Five agent task timeouts remained scored failures.

## The next question: how much throughput were we leaving unused?

The WEKA replay had substantial prompt-cache reuse and limited session concurrency. Its throughput was useful for that workload, but it did not establish the deployment's throughput ceiling.

I ran a separate cold baseline: **8,000 input tokens and a fixed 1,000 output tokens**, sweeping concurrency through 1, 2, 4, 8, 16, 32, 64 and 128. Seeds and cache salts changed between points. Each sweep had 1,088 measured requests plus 16 warmups at each point.

I then ran that shape against a **single TP4/DP4 aggregated instance on four B200 GPUs**. Those workers handled both prefill and decode. Both sweeps passed every point with zero errors and no reported prompt-cache reuse. The AGG checks included engine cache counters.

### Results at concurrency 128

| Measurement | AGG: 4 GPUs | PD: 20 GPUs |
| --- | --- | --- |
| Aggregate output tokens/s | 2,139 | 6,785 |
| Output tokens/s/GPU | 535 | 339 |
| TTFT p99 | 26.21 s | 16.65 s |
| ITL p99 | 79.59 ms | 12.08 ms |

The GPU denominator includes **all serving GPUs**, including PD's twelve prefill GPUs. TTFT is time to first token. ITL here summarizes each request's average decode interval; its p99 is not the p99 of every individual token gap.

At this operating point, AGG produced about **58% more output per GPU**. PD produced **3.17 times the aggregate output** and had much lower decode latency at high concurrency.

Within AGG, raising concurrency from 64 to 128 increased throughput from 1,914 to 2,139 tokens/s: only **12%**, while TTFT p99 rose 88% and ITL p99 rose 79%. More concurrent clients still increased output, but at a substantial latency cost. A useful operating limit needs an agreed latency target, not simply the largest concurrency that completes.

The AGG pool was about **396k tokens per rank**, despite the same configured 524,288-token context cap. Its successful 8k/1k sweep therefore does not establish the same greater-than-500k input capability as PD. Its higher request limit and different memory budget were part of the tested configuration.

These measurements compare two deployments with different GPU budgets and clusters. Per-GPU normalization helps describe efficiency; it does not isolate topology as the cause. Low-concurrency points also had only 32 measured requests, so their tail latencies are a snapshot rather than a contractual guarantee.

## Read the serving envelope, not one number

Throughput per GPU and speed per user answer different questions. The first describes hardware efficiency over the measurement window. The second describes how quickly a request decodes once generation starts. Aggregate throughput divided by client concurrency need not equal the measured per-request decode rate because queueing, prefill and measurement windows differ.

The plot below is an earlier **GLM-5.3 PD versus historical GLM-5.2** overlay. It is not the new AGG-versus-PD comparison.

[![Historical serving envelope: GLM-5.3 PD on twenty GPUs versus GLM-5.2 on eight GPUs, plotting per-user decode speed against output throughput per GPU.](./glm53-pd-vs-glm52-envelope.png)](./glm53-pd-vs-glm52-envelope.png)

*Each label marks request concurrency. GLM-5.3 used 8,000/1,000 input/output tokens and twenty serving GPUs; historical GLM-5.2 used 8,192/1,024 and eight declared GPUs. Client versions, sample budgets and cache controls differed. This is a historical deployment overlay, not a controlled model or topology comparison. Open the image to inspect the full-resolution plot.*

Moving toward greater efficiency can come with a reduction in per-user speed. A curve makes that tradeoff visible in a way a single peak-throughput figure cannot. It also prevents a historical comparison from quietly becoming a claim of model superiority.

## Why horizontal scaling feels different here

Scaling a typical web service often means adding another relatively small application process. Adding an LLM replica also loads another large model-weight allocation and creates a separate KV cache and scheduling domain.

On the same eight-GPU node, two TP4 replicas would load two weight copies. A single TP8 instance would distribute one copy across all eight GPUs. The replicas may offer useful scheduling independence, but their caches cannot simply be added together to admit one longer request. Prefix-cache locality and request routing also affect the value of another replica.

PD introduces another placement decision: how many GPUs to dedicate to prefill versus decode. Separating the stages can reduce interference during generation, but it also adds transfer and routing work and can strand capacity when the workload balance changes. The measured results do not yet identify the bottleneck responsible for the throughput difference.

My next experiment is a matched comparison of **two TP4 replicas versus one TP8 instance** on the same node, with the same checkpoint, runtime, workload and total host-cache budget. I will revalidate per-request context capacity as well as the performance curve.

For now, the practical lesson is that a topology should earn its place against the actual workload: context capacity, request concurrency, first-token delay, decode speed and the full GPU budget. More replicas and more tokens per second are useful only when they meet the service's requirements.

## Implementation references

- [NVIDIA Dynamo GLM-5.3 recipes](https://github.com/ai-dynamo/dynamo/tree/main/recipes/glm-5.3/sglang) — inspect the revision before borrowing a configuration; upstream recipes can change.
- [SGLang 0.5.21 KV pool configurator](https://github.com/sgl-project/sglang/blob/v0.5.21/python/sglang/srt/model_executor/pool_configurator.py) — the runtime version behind these measurements.
- [Dynamo 1.6.0](https://github.com/ai-dynamo/dynamo/releases/tag/v1.6.0) — pinning the runtime makes the experiment reproducible.
