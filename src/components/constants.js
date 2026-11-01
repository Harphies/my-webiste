export const portfolioDetails = {
  "AI infrastructure & LLM inference": {
    date: "Current focus",
    details: [
      ["Long-context serving", "/blogs/llm-serving-topologies-and-why-they-matter", "GLM-5.3 PD deployment: TP4 prefill, TP8 decode and validated inputs above 500k tokens.", ""],
      ["Performance & evaluation", "/blogs/llm-serving-topologies-and-why-they-matter", "Cold concurrency sweeps, aggregated versus disaggregated serving, WEKA replay and Terminal-Bench.", ""],
      ["GPU platforms", "", "Kubernetes GPU allocation, NUMA and PCIe affinity, InfiniBand/RDMA verification, GitOps and observability.", ""],
    ],
  },
  "Systems & platform engineering": {
    date: "Engineering background",
    details: [
      ["Linux & systems programming", "https://www.linkedin.com/posts/olalekan-taofeek_cloudengineering-cloudcomputing-cloudnative-activity-7171198308609052673-N-cp", "Investigating behaviour below orchestration: Linux internals, hardware architecture and networking, using Go and Rust.", ""],
      ["Platform extensions", "https://www.linkedin.com/posts/olalekan-taofeek_cloudengineering-devops-cloucomputing-activity-7288202170376577025-ydh6", "Experience extending Terraform providers and building custom Kubernetes operators for internal requirements.", ""],
    ],
  },
  "Open Source": {
    date: "",
    details: [
      [
        "DEEP LEARNING",
        "https://github.com/Harphies/deeplearning-models",
        "A curated list of practical guides for developing deep learning models",
        "Dec, 2019",
      ],
      [
        "IoT",
        "https://github.com/Harphies/IoT",
        "A curated list of several sensor networks and implementation for various application context.",
        "December, 2019",
      ],
      [
        "DATA SCIENCE",
        "https://github.com/Harphies/data_science",
        "A cheat sheet repository of different data cleaning techniques.",
        "Dec, 2019",
      ],
      [
        "PACKAGES",
        "https://github.com/Harphies/packages",
        "A curated list of data science, machine learning, deep learning and reinforcement learning packages",
        "Dec, 2019",
      ],
      [
        "DEPLOYMENT",
        "https://github.com/Harphies/deployments",
        "A list of awesome machine learning applications deployed to production.",
        "Dec, 2019",
      ],
    ],
  },
  TREPLABS: {
    date: "Earlier work; started February 2018",
    details: [
      [
        "Circuit design and architecture",
        "",
        " Design of the realdrip circuit and testing",
        "Apr - Jun, 2019",
      ],
      [
        "Database structure and Microservices",
        "",
        "Multi device parallel operation architecture design",
        "Jan - Feb, 2019",
      ],
      [
        "Web Dashboard",
        "",
        "Integrating the device with the webdasboard for M2M communication and Over the Air Updates(OTA)",
        "Sep - Oct, 2019",
      ],
      [
        "Edge Inferences",
        "",
        "Implementation of Automated Reasoning Algorithm",
        "Jul - Aug, 2019",
      ],
      [
        "Prediction Models",
        "",
        "Device accuracy optimization with a prediction model Integration on the edge for higher efficiency",
        "May - Jun, 2019",
      ],
    ],
  },
  Quintas: {
    date: "2016 Jan - 2017 Apr",
    details: [
      [
        "SCADA",
        "",
        "Design and Implementation of High and efficient SCADA  equipment for a Biomass plant",
        "Nov - Jan, 2018",
      ],
      [
        "Automated water level",
        "",
        "Biomass water level automation based on priority factors and form factor",
        "Sep - oct, 2017",
      ],
      [
        "Voltage device",
        "",
        "Multi level voltage measurement for Biomass Reactor.",
        "Jun - Aug, 2017",
      ],
      [
        "Temperature Guage",
        "",
        "Indutrial temperature range Temperature control and regulation",
        "Jan - Feb, 2017",
      ],
      [
        "Design",
        "",
        "Signle phase Automatic  Atmospheric pressure Guage",
        "Oct - Nov, 2016",
      ],
      [
        "Lidar",
        "",
        "over 40 Meters Lidar sensor detection for long range object detection",
        "Feb - Apr, 2016",
      ],
    ],
  },
}

export const technicalSkills1 = [
  ["LLM serving", "NVIDIA Dynamo, SGLang, aggregated and disaggregated inference"],
  ["Parallelism & memory", "Tensor/data parallelism, KV cache, request admission and long context"],
  ["GPU interconnects", "RDMA, InfiniBand, leaf–spine networks, collective communication, PCIe and NUMA placement"],
  ["Performance & evaluation", "Concurrency sweeps, TTFT, ITL, throughput and agent benchmarks"],
]

export const technicalSkills2 = [
  ["Kubernetes platforms", "GPU scheduling, Dynamic Resource Allocation and workload placement"],
  ["GitOps & delivery", "Argo CD, Helm, CI validation and reproducible deployment configuration"],
  ["Observability", "Prometheus, Grafana, engine metrics and operational verification"],
  ["Systems & tooling", "Go, Rust, Python, Bash and source-level investigation of platform and inference software"],
]
