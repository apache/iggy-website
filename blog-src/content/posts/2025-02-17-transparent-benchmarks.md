---
title: Transparent Benchmarking with Apache Iggy
authors: ["Piotr Gankiewicz"]
tags: []
hide_table_of_contents: false
date: 2025-02-17
---
## Benchmarks should be the first-class citizen

In the world of software development, **benchmarks are often treated as a second-class citizen**. They're more of an addition to the codebase, rather than a crucial part of it, which should be the other way around, especially when it comes to the performance-critical systems or infrastructure tools.

Sometimes, the benchmarking results are nothing more than just a **cherry-picking of the best-case scenarios**, which are not representative of real-world usage. In such a case, they simply serve a sole purpose of either making the project look better than it is or how well it does outperform the competition, under the extremely optimized conditions when comparing with its counterparts.

**Trying to reproduce the benchmarks is often a nightmare**, as the environment setup is not documented, the code is unavailable, or the instructions are not clear enough. This makes it close to impossible to verify the results, which are then taken for granted.

Or even worse, the **benchmarking tool might be so complex, that it's hard to understand how it works**, and what are the assumptions behind it. ALl of these, does result in hard to extend or modify the existing benchmarks, which are not covering the particular use case you're interested in. It's just here to tell everyone that we do have benchmarks, but how we do it, and what they measure, is a mystery.

**Which is why at [Iggy](https://github.com/iggy-rs/iggy/), we've decided to make the benchmarks a first-class citizen**.

Our `iggy-bench` tool, which is used to run the benchmarks and is part of the core open source repository (can be found under the `bench` directory), has come a long way and has been serving us well.

![image](/transparent-benchmarks/iggy_bench_cli.png)

We use it to do quick performance checks, regression testing, and to see how the changes we introduce affect the performance. **We run it on our localhost, as well as on the Virtual Machines in the cloud, to see how it behaves under a variety of environments.**

## Iggy benchmarking dashboard

**And today, we're proud to present [benchmarks.iggy.rs](https://benchmarks.iggy.rs/)** - a benchmarking dashboard, which is available to everyone. It's a website where you can see how Iggy performs under the different conditions, and how it scales with the number of clients, messages, and topics.

This is our community-driven effort, where everyone can contribute, and add their own benchmarks. For all the information on how to run the benchmarks, render them on the dashboard, upload your results or contribute to the project, please check the [iggy-bench-dashboard](https://github.com/iggy-rs/iggy-bench-dashboard) repository. In general, it's as simple as:

- Building the [Iggy](https://github.com/iggy-rs/iggy) in the release mode with `cargo build --release`
- Starting your Iggy server with `cargo r --bin iggy-server -r` (feel free to adjust the configuration in `server.toml` or via environment variables)
- Running the `iggy-bench` tool with the desired parameters, e.g. `cargo r --bin iggy-bench -r pinned-producer tcp`
- Extending your benchmark with the output (HTML charts, JSON sampling etc.) `cargo r --bin iggy-bench -r pinned-producer tcp output -o performance_results --identifier spetz`
- Navigating to the specific benchmark directory to browse the charts and/or uploading them to the dashboard.
- And there's always `help` command e.g. `pinned-producer --help` to make your life easier :)

![image](/transparent-benchmarks/iggy_bench_dashboard.png)

**And this is just the beginning**, as we plan to extend the dashboard, and add more benchmarks, which are covering the different use cases.

Our main goal is to make the benchmarking process (and its results) **transparent, reproducible, and easy to understand**. We want to make them a first-class citizen, and a crucial part of the Iggy project. We want to make them a tool, which will help us to improve the performance, and to make Iggy the best streaming server out there. We're looking forward to your feedback, and we hope you'll enjoy the benchmarks.

## Towards the microsecond latency

**And as a cherry on top, we've recently managed to achieve the sub-millisecond write latency**. This is a huge milestone for us, as it's a proof that Iggy can be used in low-latency applications, where speed is crucial. Lately, we've been experimenting a lot with [rkyv](https://github.com/rkyv/rkyv) - zero-copy deserialization framework, which has yielded some great results. Keep in mind that streaming the data within the range of microseconds latency depends on the several factors, such as message size, network conditions, or the hardware you're running on.

And the best part is that we're just getting started. We're looking forward to pushing the limits even further, and to see how far we can go. There's still tons of optimizations coming, including switching the runtime to the [monoio](https://github.com/bytedance/monoio) which does support **io_uring**, and we've experienced superb results with this one on our experimental branch. Then, there's the whole concept of shared-nothing & thread-per-core design, and many more. Stay tuned!
