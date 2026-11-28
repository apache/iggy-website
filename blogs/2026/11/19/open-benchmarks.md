# Benchmarks you can rerun: the new Apache Iggy benchmark dashboard

> The rebuilt benchmark dashboard records how every run was made, compares only runs of the same workload, and now shows OpenMessaging Benchmark runs of Iggy made with an open driver.

Published: 2026-11-19

Rendered page: https://iggy.apache.org/blogs/2026/11/19/open-benchmarks/

Source: https://github.com/apache/iggy-website/blob/main/content/blog/open-benchmarks.mdx

**Contents**

- [What was wrong with our own dashboard](#what-was-wrong-with-our-own-dashboard)
- [The rebuilt dashboard](#the-rebuilt-dashboard)
- [OpenMessaging Benchmark on the dashboard](#openmessaging-benchmark-on-the-dashboard)
- [How the runs are made](#how-the-runs-are-made)
- [What the 0.10.0 runs show](#what-the-0100-runs-show)
- [What's next for performance](#whats-next-for-performance)
- [Run it yourself](#run-it-yourself)

## A number and its recipe

In February 2025 we launched [benchmarks.iggy.apache.org](https://benchmarks.iggy.apache.org/) and wrote that benchmarks should be [a first-class citizen](https://iggy.apache.org/blogs/2025/02/17/transparent-benchmarks/) of the project. Since then, our posts on [thread-per-core](https://iggy.apache.org/blogs/2026/02/27/thread-per-core-io_uring/), [clustering](https://iggy.apache.org/blogs/2026/09/28/vsr-clustering-part-1/) and the [0.9.0 release](https://iggy.apache.org/blogs/2026/09/21/release-0.9.0/) have linked their numbers to it.

A benchmark number is useful only when three facts come with it: **what produced it, how much it moves between two identical runs, and how to produce it again**. Our dashboard had the numbers but not all three facts, so we rebuilt it.

The 0.9.0 post also promised a driver for the OpenMessaging Benchmark (OMB) and its results. The dashboard now shows OMB runs of Iggy, made with an open driver. Every 0.10.0 run in this post is on the dashboard, and you can open the run behind every number in the results section.

---

## What was wrong with our own dashboard

The old dashboard inflated throughput. It added up the rate of each actor (each producer or consumer), and an actor's rate is its own data divided by its own run time. When the actors finish at different times, that sum is higher than what the group moved. For one 0.9.0 run, the dashboard showed 2731 MB/s. The run moved 2062 MB/s, so **the page overstated it by 32%**.

It also couldn't tell which runs measured the same workload. A report kept the durability of the topics and the warm-up only in its command text, which the dashboard didn't compare. A run that waited for every write to reach the disk and a run that didn't could sit side by side as if they were the same test.

And it colored every difference as better or worse, even the differences that two runs of the same build show anyway. A p99 of 1.2 ms against 1.0 ms looked like a regression, though **rerunning one build moves p99 by more than that**.

[apache/iggy#4885](https://github.com/apache/iggy/pull/4885) rebuilt the dashboard to fix all three.

---

## The rebuilt dashboard

### A run records its recipe

[`iggy-bench`](https://github.com/apache/iggy/tree/master/core/bench), our benchmark tool, now **writes every flag that changes a result into its report**: the durability of the topics, the consumer and warm-up options, the TCP options and the data volume. It also records its own command line, with any password removed, and two labels that you pass to its `output` subcommand. `--suite` names a set of runs that belong together, for example `i4i-single`. `--workload` names one workload inside it, for example `producer-20p@800MB`. These reporting changes came after the 0.10.0 release and ship with the next one.

Each run page shows the command that reproduces the run, the hardware (CPU model, cores, memory, kernel), the git reference of the build and a zip of the run's files. Here is the command behind the [single-node run with 20 producers](https://benchmarks.iggy.apache.org/runs/fb6369bd-24a4-41b2-a148-76e90d854304) of the 0.10.0 suite, with the server address replaced:

```bash
iggy-bench --durability replicated --consumer-offset-durability replicated \
  --messages-per-batch 250 --message-batches 12400 --rate-limit '800.00 MB' \
  pinned-producer --producers 20 --streams 20 \
  tcp --server-address <server>:8090 --nodelay \
  output -o performance_results --remark '0.10.0-s1-P1'
```

### Only like with like

From those fields the dashboard derives a workload key: the kind of benchmark, the transport, the message and batch size, the number of producers, consumers, streams, partitions and consumer groups, the rate limit, the durability and the client options. **Two runs measure the same workload only if their keys match.** The history of a workload and the comparison against the previous version both stay inside one key.

The Compare page (`/compare`) puts up to three runs side by side and judges differences only between runs of the same workload. `/compare/releases` compares two versions across an official suite, and a suite is official when `dashboard.toml` in the repository lists it. Two suites have runs today: `i4i-single`, one AWS i4i.4xlarge node, and `i4i-cluster3`, three such nodes. Between them they hold the 48 runs of the 0.10.0 suite.

Reports from before the rebuild have none of the new fields, so the dashboard keys them with the bench defaults of that time, durability `replicated` included. Some 0.9.0 runs with `persisted` topics therefore share a key with `replicated` runs, and only the command on their run pages shows the difference. The 0.9.0 runs also came before the suite and workload labels, so the release comparison starts to fill with the next release.

### A noise rule before "better" or "worse"

Run one build twice on the same machine type and the numbers move. To learn how much, we reran one 0.9.0 build on the official setups from September 18 to November 4, 2026. Leaving out runs with a badge (more on those below), throughput moved by 1.4% at most. Latency, measured in runs with a rate limit, moved a lot more: up to 5.4 times at p99.9. The dashboard sets the threshold for each metric above the largest spread we measured:

<div className="min-w-0 overflow-x-auto pb-4 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">

| Metric | Largest spread between runs of one build | Threshold |
| --- | ---: | ---: |
| Throughput | 1.4% | 3% |
| p50 | 1.9x | 100% |
| p90, p95, p99 | 1.6x | 70% |
| p99.9 | 5.4x | 450% |

</div>

**A change gets a color only if it's larger than its threshold and the ranges of the two versions' runs don't overlap.** Everything else shows as a plain number. So a 30% change in p99 between two single runs isn't news, and the dashboard no longer presents it as news.

Two badges mark rate-limited runs that didn't get the load they asked for. *Below target rate* means the run fell short of its rate limit. For example, on three nodes the single persisted producer [reached 222.7 MB/s](https://benchmarks.iggy.apache.org/runs/8a9b51ba-5743-440d-be19-c8f8e9d7544c) of its 500 MB/s, because one producer waits for each reply before it sends the next batch. The badge says so instead of hiding the run. *Uneven load* means the run times of the actors spread by more than 10%, so some actors ran alone for part of the run.

### Overview, Explore and Methodology

The Overview shows four headline workloads of the latest release, each with its trend across releases: the write throughput of 20 producers on one node, the p99 of durable writes at 800 MB/s, the p99 of end-to-end latency at 1600 MB/s on one node, and the p99 of writes at 800 MB/s on three nodes.

Explore lists every run, with filters for machine, version, kind, topology, durability and message size. Methodology explains every number, threshold, badge and option on the site.

You can embed a run's charts in another page, as an iframe (`/embed/{uuid}`) or a PNG (`/embed/{uuid}/chart.png`), in a dark or light theme. The two charts in this post are embeds, drawn live from the run data on the dashboard.

---

## OpenMessaging Benchmark on the dashboard

### Why a second framework

`iggy-bench` is our own tool. It's written in Rust, uses the Rust SDK and measures the latency of each batch. It's fair to ask **whether a benchmark written by the people who wrote the server favors the server**.

The [OpenMessaging Benchmark](https://github.com/openmessaging/benchmark) is a common yardstick: many messaging systems publish their numbers with it. It runs a Java client, measures every message and defines its workloads in its own files. [apache/iggy#4911](https://github.com/apache/iggy/pull/4911) gave its results a place on the dashboard.

### The Iggy driver

The driver is the `driver-iggy` module of [laserdata/openmessaging-benchmark](https://github.com/laserdata/openmessaging-benchmark). LaserData currently maintains it. It talks TCP through the Java SDK `org.apache.iggy:iggy` 0.10.0 from Maven Central and needs `iggy-server` 0.10.0.

The driver comes with two files that differ only in durability. On the three-node cluster in this post, each partition has a copy on every node, and two nodes form the replication quorum.

`iggy-cluster.yaml` keeps the server default, `replicated`, and its results are named `Iggy`. The server acknowledges a publish **after the quorum commits the batch**, without waiting for stable storage. A failure that hits the nodes at once, such as a shared power loss, can lose acknowledged messages. `iggy-cluster-persisted.yaml` sets `persisted`, and its results are named `Iggy-persisted`. Here the acknowledgement **also waits until the batch is on stable storage** on that quorum. Both files keep the other topic defaults of the server, such as the flush threshold (`messages_required_to_save`) of 1024 messages. [Cluster durability](https://iggy.apache.org/docs/clustering/durability) explains both policies.

The producers use the usual settings of a throughput-oriented client. A batch closes at 10,000 messages, at 1 MiB, or 1 ms after its first message, whichever comes first. Each producer keeps up to 5 batches in flight, and a send blocks after 6 MiB of pending data. The consumers use deferred polls, new in 0.10.0: the server holds a read until messages arrive. Each consumer stores its offset at most once per second. An unknown key in a driver file stops the run at start-up, so a typo can't run quietly with a default.

To build OMB and run one Iggy workload with both driver files against an `iggy-server` 0.10.0 on the same host:

```bash
mvn -DskipTests -Dspotless.check.skip=true -Dspotbugs.skip=true clean install
tar xzf package/target/openmessaging-benchmark-0.0.1-SNAPSHOT-bin.tar.gz
cd openmessaging-benchmark-0.0.1-SNAPSHOT
bin/benchmark --drivers driver-iggy/iggy-cluster.yaml,driver-iggy/iggy-cluster-persisted.yaml \
    workloads/iggy/omb-pp-12-300.yaml
```

`bin/benchmark` **exits with 0 even when a run fails**, so check that the latency series in the result file aren't zero. The [driver README](https://github.com/laserdata/openmessaging-benchmark/blob/master/driver-iggy/README.md) covers clusters, remote workers and TLS.

### The Iggy suite

The [`workloads/iggy`](https://github.com/laserdata/openmessaging-benchmark/blob/master/workloads/iggy/README.md) directory holds 25 workloads. Every workload sends random payloads without keys, and a rate is the total of all producers, in decimal MB/s. A cell is one workload run with one driver file. Of the 25 workloads, 15 run with both files, so the suite has 40 cells.

<div className="min-w-0 overflow-x-auto pb-4 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">

| Group | Cells | What it tests |
| --- | --- | --- |
| Rate ladder | S-50 to S-800, S-MAX | 12 topics with one partition each, one producer and one consumer per topic, 1000 B messages, from 50 MB/s up to the highest sustained rate |
| One topic, 48 partitions | B-300, B-MAX | 12 producers and one consumer group of 12 consumers |
| Partition count | P-48, P-144, P-288 | One topic with 48 to 288 partitions, 4 producers and 4 consumers, 300 MB/s |
| Message size | M-100-MAX, M-4K-MAX, M-64K-MAX, M-100-FIX, M-4K-FIX | The 12-topic shape with 100 B, 4 KiB and 64 KiB messages at the highest rate, and with 100 B and 4 KiB messages at a fixed rate |
| Many topics | T-100 | 100 topics at 300 MB/s |
| Fan-out | F-3 | Three consumer groups read every message, 200 MB/s in |
| Backlog drain | C-DRAIN | The consumers wait until 200 GiB pile up, then read the backlog while the producers keep writing 300 MB/s |
| 1 KiB messages | R-200K to R-1000K, R-MAX, R-288 | 1 KiB messages on 100 partitions at 0.2 to 1 million messages per second, and on 288 partitions at 1 million |

</div>

A max-rate cell lets the OMB rate controller look for the highest rate that the system sustains. **Read only its throughput**: its latency is that of an overloaded system.

### What OMB doesn't record

An OMB result file holds the workload, the driver and the measurements. It doesn't say which machines ran it, which server version it measured or when it started. Without those a number is hard to use, so the dashboard defines `setup.toml`, a small sidecar file next to each result. Here is the one from the first [S-300 run](https://benchmarks.iggy.apache.org/omb/runs/bc59d38e2d4c6dc3):

```toml
timestamp = "2026-11-16T15:32:35Z"
suite = "i4i-cluster3"

[environment]
label = "AWS i4i.4xlarge, 3 nodes"
server_instance = "i4i.4xlarge"
server_nodes = 3
client_instance = "i4i.4xlarge"
client_hosts = 2

[server]
version = "0.10.0"
gitref = "server-0.10.0"
gitref_date = "2026-11-04T08:24:46+01:00"

[omb]
gitref = "5588b761223e3d5cb9a00b977cd320e04aa4bb93"
gitref_date = "2026-11-16T15:36:50+01:00"

[properties.kernel]
"vm.dirty_background_bytes" = 268435456
"vm.dirty_bytes" = 2147483648
"vm.dirty_expire_centisecs" = 500

[properties.server]
data_file_system = "ext4"
huge_pages = 2048
placement_strategy = "cluster"
server_environment = "IGGY_SHARDING_CPU_ALLOCATION=all"
```

Any tool that runs OMB can write this file, and each OMB run page offers both files for download. If a key in a sidecar looks like a secret, the dashboard doesn't serve that sidecar.

### How the OMB pages differ

OMB runs have their own part of the site, under `/omb`, with their own accent color. No page puts an OMB number next to an `iggy-bench` number, because the two tools don't measure the same thing.

OMB counts in MiB/s (1,048,576 bytes per MiB) and takes one sample every 10 seconds. The workload names use decimal MB, so **the 800 MB/s cell shows as about 764 MiB/s** on its page.

A run page shows throughput, latency, publish delay (how late messages left against the producers' schedule) and backlog for each 10-second window, the percentile ladder of the whole run, the setup and the history of the workload. OMB runs have no noise rule yet, so a change between two runs shows as a plain percent, with no color.

---

## How the runs are made

Every official run followed the recipe below, and you can follow it with any tooling, on other clouds and machines too. The dashboard already records each run's options and hardware, and an OMB run also carries its `setup.toml`. An `iggy-bench` report doesn't hold the host preparation below, though, so keep a note of it with your results.

### Machines and builds

All official runs used AWS i4i.4xlarge machines (16 vCPUs, 128 GiB of memory, a local NVMe disk) in a cluster placement group in eu-central-1. They ran Ubuntu 26.04 with kernel 7.0.0-1016-aws.

- `i4i-single` is one server node with its own producer machine and consumer machine.
- `i4i-cluster3` is three server nodes and one client machine for `iggy-bench`. The OMB runs used the same three-node setup, with two i4i.4xlarge OMB workers.
- The server and `iggy-bench` came from the tag `server-0.10.0`, built with `cargo zigbuild` for generic x86-64 and a glibc 2.43 target. **Two separate builds of that commit gave byte-identical binaries.**
- The `iggy-bench` binary also carried the reporting changes from #4885, which merged after the release, so its reports have the new fields. The patch changes what `iggy-bench` writes, not the load it sends.
- OMB was built from the public commit [`5588b76`](https://github.com/laserdata/openmessaging-benchmark/commit/5588b761223e3d5cb9a00b977cd320e04aa4bb93), with the released Java SDK from Maven Central.

### Host preparation

<div className="min-w-0 overflow-x-auto pb-4 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">

| Area | Configuration |
| --- | --- |
| Network | `net.core.somaxconn = 65535`, `net.core.rmem_max` and `net.core.wmem_max = 16777216`, `tcp_rmem` and `tcp_wmem` up to 16 MiB, `net.ipv4.tcp_slow_start_after_idle = 0`, `net.core.busy_read` and `net.core.busy_poll = 50` |
| Page cache | `vm.dirty_background_bytes = 268435456`, `vm.dirty_bytes = 2147483648`, `vm.dirty_expire_centisecs = 500`, `vm.swappiness = 10` |
| Memory | 2048 huge pages of 2 MiB, used by the allocator through `MIMALLOC_ALLOW_LARGE_OS_PAGES=1` |
| Limits | `nofile` 1,048,576, and 8,388,608 on cluster nodes. `memlock` unlimited on cluster nodes. io_uring enabled |
| Data disk | The local NVMe disk, ext4 with default options, mounted at `/opt/iggy/data`. `fstrim` after every wipe |
| Server, `iggy-bench` suites | `IGGY_SHARDING_CPU_ALLOCATION=8` |
| Server, OMB suite | `IGGY_SHARDING_CPU_ALLOCATION=all` |

</div>

The [Linux tuning guide](https://iggy.apache.org/docs/server/linux-tuning) explains most of these settings.

### The run protocol

- In the `iggy-bench` suite, each producer workload starts a fresh server. A consumer workload reads what the producer workload before it wrote. The cold reads and the reads without a rate limit drop the page cache first.
- The `iggy-bench` suite ran twice on each topology, on November 13, 2026.
- Each OMB cell starts on wiped disks. The OMB suite ran all 40 cells once, then five anchor cells twice more, on November 16, 2026. That makes 50 runs.
- Max-rate cells run 10 minutes apart.

### What the cloud taught us

Trim the disk. In an earlier campaign, one max-rate cell fell from 1.88 to 1.65 to 1.46 million messages per second over three passes on the same machines. **After `fstrim` it was back at 1.85 million.** A local NVMe disk slows down when it has no free blocks it knows about, so every wipe now ends with `fstrim`.

Know the network baseline. An i4i.4xlarge sustains about 1,172 MB/s (9.375 Gbit/s) and can burst above that for a while. A run above the baseline spends burst credits, so **its result depends on what ran before it**. We put 10 minutes between max-rate cells so the credits refill.

Read maximum latencies with care. Rare publish maxima of about 200 ms on some hosts turned out to be TCP waiting to resend a lost packet, not the server. None of the OMB runs with a fixed rate in this post has one.

Check the CPU idle states. On one instance type, deep idle states made the median latency of a lightly loaded server many times higher, and we had to turn them off.

---

## What the 0.10.0 runs show

### iggy-bench, one node and three nodes

The runs of the official 0.10.0 suite are on the dashboard: 12 workloads on [one node](https://benchmarks.iggy.apache.org/explore?version=0.10.0&nodes=1) and on [three nodes](https://benchmarks.iggy.apache.org/explore?version=0.10.0&nodes=3), two passes each, every run with its command, hardware and files. The [0.10.0 release post](https://iggy.apache.org/blogs/2026/11/09/release-0.10.0/#benchmarks-090--0100) already compared 0.9.0 with 0.10.0 on most of these workloads. These runs were made later, and in another region, so their numbers differ a little from the ones in the release post.

**With 20 producers at 800 MB/s, a durable write costs about the same on three nodes as on one, up to p99.9.** With `persisted` topics and `--messages-required-to-save 1`, a write on one node waits for the local disk. On three nodes, the same write waits until the batch is on stable storage on two of the three nodes. `iggy-bench` times each batch of 250 messages, and its p99 is each producer's 99th percentile, averaged over the producers.

In the two passes, the p99 was [1.99](https://benchmarks.iggy.apache.org/runs/2d47d398-04d9-4a4f-8e1b-a7cbbb43b6e3) and [1.69 ms](https://benchmarks.iggy.apache.org/runs/4126ed60-acba-4b61-b8b8-1f56941d87a6) on one node, and [1.90](https://benchmarks.iggy.apache.org/runs/38500985-dbea-45d3-a8bd-3b0c2da62a79) and [2.02 ms](https://benchmarks.iggy.apache.org/runs/390f4174-96c6-4ab9-9885-dc1c8e85803e) on three. The p99.9 was 3.17 and 3.00 ms on one node, and 2.90 and 3.24 ms on three. Past p99.9, the two part ways: the slowest batch took 66 and 59 ms on one node, but 1.26 and 1.22 s on three.

The chart shows how the batch latencies of the first cluster run spread: nearly all of them fall between 1.2 and 2.1 ms.

<DashboardChart run="38500985-dbea-45d3-a8bd-3b0c2da62a79" type="distribution" title="Latency distribution of 20 persisted producers at 800 MB/s on a 3-node Apache Iggy 0.10.0 cluster" />

[20 persisted producers at 800 MB/s on three nodes, pass 1](https://benchmarks.iggy.apache.org/runs/38500985-dbea-45d3-a8bd-3b0c2da62a79)

A single persisted producer pays more for the cluster. Its p99 was [1.20](https://benchmarks.iggy.apache.org/runs/8a9b51ba-5743-440d-be19-c8f8e9d7544c) and [1.22 ms](https://benchmarks.iggy.apache.org/runs/9575aa8b-b1fb-4960-b044-a31fb4175913) on three nodes, against [0.90](https://benchmarks.iggy.apache.org/runs/81c503a3-73f3-4518-99c5-8e281637d693) and [0.89 ms](https://benchmarks.iggy.apache.org/runs/6133a4ea-5329-45e0-a9f8-9a3c3c73b233) on one. A lone producer waits for each reply before it sends the next batch, so it reached 222 MB/s instead of about 308 MB/s.

### OpenMessaging Benchmark, three nodes

The OMB suite ran on the same kind of three-node cluster, with two worker machines: one ran all the producers, the other all the consumers. Latency here is the publish latency of each message, from the send call to the acknowledgement, in milliseconds. **It includes up to 1 ms that the producer waits for a batch to fill.**

The table below covers the cells with a fixed rate. It gives p50 / p99 / p99.9 for each durability, and each set of numbers links to its run. A dash means the cell ran only with `replicated`. The max-rate cells are on the [OMB pages](https://benchmarks.iggy.apache.org/omb) of the dashboard, with all the other runs.

<div className="min-w-0 overflow-x-auto pb-4 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">

#### Publish latency with a fixed rate

| Cell | Shape | Rate | replicated, p50 / p99 / p99.9 (ms) | persisted, p50 / p99 / p99.9 (ms) |
| --- | --- | ---: | ---: | ---: |
| S-50 | 12 topics × 1 partition | 50 MB/s | [0.896 / 1.457 / 8.076](https://benchmarks.iggy.apache.org/omb/runs/cfd3fd5da6e2c734) | [1.368 / 2.281 / 15.972](https://benchmarks.iggy.apache.org/omb/runs/ab69ccfacac469ca) |
| S-150 | 12 topics × 1 partition | 150 MB/s | [0.938 / 1.518 / 5.833](https://benchmarks.iggy.apache.org/omb/runs/8c16f849c0432d08) | [1.523 / 4.087 / 15.098](https://benchmarks.iggy.apache.org/omb/runs/816d584f16301746) |
| S-300 | 12 topics × 1 partition | 300 MB/s | [1.013 / 1.628 / 3.810](https://benchmarks.iggy.apache.org/omb/runs/bc59d38e2d4c6dc3) | [1.729 / 6.178 / 10.266](https://benchmarks.iggy.apache.org/omb/runs/229f4893131c81f7) |
| S-450 | 12 topics × 1 partition | 450 MB/s | [1.121 / 1.822 / 3.208](https://benchmarks.iggy.apache.org/omb/runs/ad15fbf3bbe0a3a5) | [2.518 / 8.623 / 11.902](https://benchmarks.iggy.apache.org/omb/runs/98e58b56bfdc0014) |
| S-600 | 12 topics × 1 partition | 600 MB/s | [1.219 / 1.997 / 4.672](https://benchmarks.iggy.apache.org/omb/runs/7d6824fb98d36ba0) | [6.263 / 9.055 / 12.208](https://benchmarks.iggy.apache.org/omb/runs/3552ae5e603baa01) |
| S-800 | 12 topics × 1 partition | 800 MB/s | [1.319 / 2.500 / 6.179](https://benchmarks.iggy.apache.org/omb/runs/acec04aa2e7f47ec) | [7.637 / 11.896 / 15.653](https://benchmarks.iggy.apache.org/omb/runs/12492fdc34684cd5) |
| B-300 | 1 topic × 48 partitions, 12 producers, 12 consumers | 300 MB/s | [1.054 / 1.693 / 3.764](https://benchmarks.iggy.apache.org/omb/runs/2ac21bc4649acc37) | [1.758 / 3.239 / 7.221](https://benchmarks.iggy.apache.org/omb/runs/d270acc432beb1bf) |
| P-48 | 1 topic × 48 partitions, 4 producers, 4 consumers | 300 MB/s | [1.359 / 2.097 / 2.938](https://benchmarks.iggy.apache.org/omb/runs/f81ae153608a4995) | - |
| P-144 | 1 topic × 144 partitions, 4 producers, 4 consumers | 300 MB/s | [1.375 / 2.121 / 3.086](https://benchmarks.iggy.apache.org/omb/runs/8b9027bbffcfd3ac) | - |
| P-288 | 1 topic × 288 partitions, 4 producers, 4 consumers | 300 MB/s | [1.366 / 2.111 / 3.030](https://benchmarks.iggy.apache.org/omb/runs/f7c46d9c1338e84e) | [1.817 / 2.730 / 3.908](https://benchmarks.iggy.apache.org/omb/runs/6ec081402952dc26) |
| F-3 | 12 topics, 3 consumer groups | 200 MB/s in | [0.987 / 1.612 / 4.432](https://benchmarks.iggy.apache.org/omb/runs/451c051038f05dff) | - |
| T-100 | 100 topics × 1 partition | 300 MB/s | [1.355 / 12.247 / 31.153](https://benchmarks.iggy.apache.org/omb/runs/77eed3f876e4797d) | - |
| M-100-FIX | 12 topics, 100 B messages | 1.95 M msg/s | [1.287 / 2.127 / 3.783](https://benchmarks.iggy.apache.org/omb/runs/a3c1f49ae004c3a2) | - |
| M-4K-FIX | 12 topics, 4 KiB messages | 1007.6 MB/s | [1.261 / 3.111 / 8.238](https://benchmarks.iggy.apache.org/omb/runs/cad51b62be688e85) | - |
| R-200K | 1 topic × 100 partitions, 1 KiB | 0.2 M msg/s | [1.211 / 1.869 / 2.826](https://benchmarks.iggy.apache.org/omb/runs/efc4ef25a52905c5) | [1.665 / 2.446 / 3.798](https://benchmarks.iggy.apache.org/omb/runs/694a6c61e30c90b1) |
| R-500K | 1 topic × 100 partitions, 1 KiB | 0.5 M msg/s | [1.497 / 2.274 / 4.232](https://benchmarks.iggy.apache.org/omb/runs/4bbf50adcc75cbb2) | [2.059 / 3.099 / 5.211](https://benchmarks.iggy.apache.org/omb/runs/8c9b6d65353715b7) |
| R-1000K | 1 topic × 100 partitions, 1 KiB | 1 M msg/s | [1.959 / 3.122 / 7.062](https://benchmarks.iggy.apache.org/omb/runs/f1d57dde0ff4002b) | [2.803 / 4.907 / 12.412](https://benchmarks.iggy.apache.org/omb/runs/0781fda5d55314fd) |
| R-288 | 1 topic × 288 partitions, 1 KiB | 1 M msg/s | [1.961 / 5.632 / 33.891](https://benchmarks.iggy.apache.org/omb/runs/5b2f22ff036f8bf9) | [2.833 / 27.346 / 62.295](https://benchmarks.iggy.apache.org/omb/runs/15272e725caa5d51) |
| C-DRAIN | 1 topic × 48 partitions, 200 GiB backlog | 300 MB/s | [1.333 / 2.131 / 4.144](https://benchmarks.iggy.apache.org/omb/runs/33a671d9e00ad2cc) | - |

</div>

With 12 topics, **the replicated p99 stays between 1.46 and 2.50 ms all the way from 50 to 800 MB/s**. With one topic at 300 MB/s, p99 is 2.10, 2.12 and 2.11 ms for 48, 144 and 288 partitions, so the partition count barely moves it. Three consumer groups read 601 MB/s out of the 200 MB/s written, with a publish p99 of 1.61 ms.

Message size doesn't change the picture much either. The two fixed-rate message-size cells run at about half of the highest rate the suite measured for their size. At 1.95 million 100-byte messages per second, the p99 is 2.13 ms. With 4 KiB messages at about 1 GB/s, it's 3.11 ms. The 1 KiB cells on 100 partitions fit the same picture: at 1 million messages per second, the p99 is 3.12 ms.

#### The backlog drain

The drain cell shows what happens when consumers fall far behind. The producers write 300 MB/s to one topic with 48 partitions while the consumers wait. After 716 seconds, 214.8 million messages (about 200 GiB) are waiting. Then the consumers start and **read the whole backlog in 89 seconds**, at up to 2.95 million messages per second (about 2,815 MiB/s on the chart), while the producers keep writing 300 MB/s. Through the drain, the publish p99 of each 10-second window stayed between 2.2 and 4.2 ms, against about 2.05 ms in a typical window before it.

All four consumers ran on one worker machine, and the network of that one machine set the read rate. At the peak it received about 24 Gbit/s. That's close to the 25 Gbit/s that an i4i.4xlarge reaches in a burst and far above its baseline, so the drain runs on burst credits. With more consumer machines the drain could finish sooner, so 89 seconds is an upper bound.

<DashboardChart run="33a671d9e00ad2cc" omb type="throughput" title="Publish and consume rate of a 200 GiB backlog drain on a 3-node Apache Iggy 0.10.0 cluster" />

[The backlog drain run on the dashboard](https://benchmarks.iggy.apache.org/omb/runs/33a671d9e00ad2cc)

#### What `persisted` costs

With 12 topics of one partition each, **the cost of `persisted` grows with the rate**. The p99 goes from 2.28 ms at 50 MB/s to 11.90 ms at 800 MB/s, while `replicated` stays at 1.46 to 2.50 ms.

<div className="min-w-0 overflow-x-auto pb-4 [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">

| Rate (MB/s), 12 topics | 50 | 150 | 300 | 450 | 600 | 800 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| replicated p99 ms | 1.46 | 1.52 | 1.63 | 1.82 | 2.00 | 2.50 |
| persisted p99 ms | 2.28 | 4.09 | 6.18 | 8.62 | 9.06 | 11.90 |

</div>

Spread over more partitions, the cost is smaller: 2.73 against 2.11 ms with 288 partitions at 300 MB/s, and 4.91 against 3.12 ms with 100 partitions at 1 million 1 KiB messages per second. The exception is R-288, the same rate on 288 partitions, where `persisted` saturates (see the caveats).

### Caveats

- Most OMB cells ran once, and only the five anchor cells ran three times. Between those passes, the S-300 p99 moved from 1.63 to 1.66 ms with `replicated` and from 6.18 to 6.87 ms with `persisted`. The B-300 p99 moved from 1.67 to 1.69 ms. The S-MAX throughput moved more: from 1,463 to 1,693 MiB/s with `replicated`, a 16% spread, and from 1,712 to 1,758 MiB/s with `persisted`.
- With `persisted`, R-288 (1 million 1 KiB messages per second on 288 partitions) is saturated. The producers fell behind their schedule: one message in a hundred left at least [166 ms late](https://benchmarks.iggy.apache.org/omb/runs/15272e725caa5d51), and the publish p99 reached 27 ms. With `replicated`, the producers [kept their schedule](https://benchmarks.iggy.apache.org/omb/runs/5b2f22ff036f8bf9), and the p99 was 5.63 ms.
- 100 topics at 300 MB/s have a p99 of 12.25 ms, against 1.63 ms for 12 topics at the same rate.
- In the rate-limited `iggy-bench` workloads, p99 moved by up to 1.8 times between the two passes, for example the cold reads on one node ([1.81](https://benchmarks.iggy.apache.org/runs/a29e5207-32e9-4f5c-8c51-9980f92b15e7) against [1.03 ms](https://benchmarks.iggy.apache.org/runs/0fa49dd2-58d2-494c-a739-beb656084918)). That's more than the 70% threshold for p99, so the overlap condition of the noise rule matters: one noisy pass widens the range of its version, and the dashboard doesn't color a change whose ranges overlap.
- The dashboard doesn't judge the latency of a run without a rate limit, only its throughput. That throughput moved more than in the 0.9.0 reruns: 20 producers on one node wrote [2,029](https://benchmarks.iggy.apache.org/runs/6a60c996-7c5b-43b5-909e-404fc0d70e15) and [2,097 MB/s](https://benchmarks.iggy.apache.org/runs/b6983e86-9330-4fd0-b409-00c85b00ec43), 3.4% apart, which is above the 3% threshold.
- **Never compare an `iggy-bench` number with an OMB number.** `iggy-bench` latency is per batch of 250 messages, OMB latency is per message, and the clients differ.

---

## What's next for performance

**Two of the weakest results above come from many topics or many partitions**: 100 topics at 300 MB/s (T-100), and 1 million messages per second on 288 partitions (R-288). Much of the server work merged since 0.10.0 goes there, and it ships with the next release.

The goal is a node that spends its work on the partitions with something to do, not on every partition it holds. The server will tick only the partitions with due work, keep running totals of its statistics instead of walking every stream, and cap the memory of partition journals. In a cluster, nodes will batch their heartbeats to each peer, move partition primaries in bulk and settle elections faster after a restart.

When these changes ship, their runs go onto the same dashboard, next to the runs in this post, so anyone can check the gains.

---

## Run it yourself

Everything in this post comes from three places:

- [benchmarks.iggy.apache.org](https://benchmarks.iggy.apache.org/), with every run, its command or its setup, and its files.
- The [Methodology page](https://benchmarks.iggy.apache.org/methodology), which explains every number, threshold and badge.
- The [OMB driver and the Iggy suite](https://github.com/laserdata/openmessaging-benchmark/tree/master/driver-iggy).

To measure durable writes the way the Overview does, start `iggy-server` 0.10.0 with `--with-default-root-credentials` and run `iggy-bench` from the same release:

```bash
iggy-bench --durability persisted --messages-required-to-save 1 \
  --messages-per-batch 250 --message-batches 12400 --rate-limit '800.00 MB' \
  pinned-producer --producers 20 --streams 20 \
  tcp --server-address 127.0.0.1:8090 --nodelay \
  output -o performance_results
```

The 0.10.0 `iggy-bench` sends the same load as the binary behind the official runs, but its report lacks the new recipe fields. A dashboard therefore keys the run with the old defaults, as `replicated`, even though its topics are `persisted`. The `iggy-bench` of the next release records them.

For OMB, the build and run commands are in [The Iggy driver](#the-iggy-driver) above.

The dashboard itself is part of the repository, under [`core/bench/dashboard`](https://github.com/apache/iggy/tree/master/core/bench/dashboard). Its README shows how to **run your own copy against your own results**, with the same pages, comparisons and noise rule.

We'd like to see the same OMB suite run against other systems, on the same machines and with the same host configuration. If you do it, publish what you find, with your `setup.toml`.

Next on our list are a noise rule for OMB runs and more official suites beyond the i4i machines: ARM CPUs, other machine sizes, and other disk and network specs. Further out, we have a benchmark orchestrator in mind. You'd give it the addresses of your machines and an SSH key, and it would prepare the hosts, set up telemetry, run the suites and collect the results. Anyone could then start, in any cloud or on their own hardware, without building that setup first.

Until then, the [benchmarking guide](https://iggy.apache.org/docs/server/benchmarking) walks through running `iggy-bench` by hand, and the [Linux tuning guide](https://iggy.apache.org/docs/server/linux-tuning) covers preparing the hosts.
