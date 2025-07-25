---
id: server-benchmarking
slug: /server/benchmarking
title: Benchmarking
sidebar_position: 5
---

**Benchmarks should be the first-class citizens**. We believe that performance is crucial for any system, and we strive to provide the best possible performance for our users. Please check, why we believe that the **[transparent benchmarking](https://iggy.apache.org/blogs/2025/02/17/transparent-benchmarks)** is so important.

We've also built the **[benchmarking platform](https://benchmarks.iggy.apache.org)** where anyone can upload the benchmarks and compare the results with others. This is the another open-source project available [here](https://github.com/iggy-rs/iggy-bench-dashboard).

![Benchmarking Platform](/img/bench_platform.png)

Iggy comes with a built-in benchmarking tool `iggy-bench` that allows you to measure the performance of the server. It is written in Rust and uses the `tokio` runtime for asynchronous I/O operations mimicking the example client applications.  The tool is designed to be as close to real-world scenarios as possible, so you can use it to estimate the performance of the server in your environment. It is part of the [core repository](https://github.com/apache/iggy/tree/master/core/bench) and can be found in the `bench` directory.

![Bench CLI](/img/bench_cli.png)

To benchmark the project, first build the project in release mode:

```bash
cargo build --release
```

Then, run the benchmarking app with the desired options:

1. Sending (writing) benchmark

   ```bash
   cargo r --bin iggy-bench -r -- -v pinned-producer tcp
   ```

2. Polling (reading) benchmark

   ```bash
   cargo r --bin iggy-bench -r -- -v pinned-consumer tcp
   ```

3. Parallel sending and polling benchmark

   ```bash
   cargo r --bin iggy-bench -r -- -v pinned-producer-and-consumer tcp
   ```

4. Balanced sending to multiple partitions benchmark

   ```bash
   cargo r --bin iggy-bench -r -- -v balanced-producer tcp
   ```

5. Consumer group polling benchmark:

   ```bash
   cargo r --bin iggy-bench -r -- -v balanced-consumer-group tcp
   ```

6. Parallel balanced sending and polling from consumer group benchmark:

   ```bash
   cargo r --bin iggy-bench -r -- -v balanced-producer-and-consumer-group tcp
   ```

7. End to end producing and consuming benchmark (single task produces and consumes messages in sequence):

   ```bash
   cargo r --bin iggy-bench -r -- -v end-to-end-producing-consumer tcp
   ```

These benchmarks would start the server with the default configuration, create a stream, topic and partition, and then send or poll the messages. The default configuration is optimized for the best performance, so you might want to tweak it for your needs. If you need more options, please refer to `iggy-bench` subcommands `help` and `examples`.

For example, to run the benchmark for the already started server, provide the additional argument `--server-address 0.0.0.0:8090`.

Depending on the hardware, transport protocol (`quic`, `tcp` or `http`) and payload size (`messages-per-batch * message-size`) you might expect **over 5000 MB/s (e.g. 5M of 1 KB msg/sec) throughput for writes and reads**.

**Iggy is already capable of processing millions of messages per second at the microseconds range for p99+ latency**, and with the upcoming optimizations related to the io_uring support along with the shared-nothing design, it will only get better.
