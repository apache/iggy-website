# Apache Iggy's migration journey to clustering powered by Viewstamped Replication (part 1)

Published: 2026-09-28

Rendered page: https://iggy.apache.org/blogs/2026/09/28/vsr-clustering-part-1/

Source: https://github.com/apache/iggy-website/blob/main/content/blog/vsr-clustering-part-1.mdx

## Introduction

Apache Iggy can now run as a cluster. This has been on the roadmap for longer than we would like to admit, our README carried the sentence *"clustering based on Viewstamped Replication will be implemented in the near future"* through more than a few releases, and we closed the [thread-per-core post](https://iggy.apache.org/blogs/2026/02/27/thread-per-core-io_uring/) by promising a proper write-up once it landed. It has landed, and the write-up turned out to be too much for one post, so this is the first of a three-part series. This part is the introduction: what an Iggy cluster is, which consensus protocol it runs and why we picked that one, how we got from the old single-node binary to the new one, and what the change costs, with benchmarks.

A short recap for those who skipped that post. After the thread-per-core rewrite, Iggy was a single binary in which partitions are sharded across cores and each core owns its partitions outright, while streams, topics and users are shared, strongly consistent resources with a single writer (shard0) and `left-right` read handles on every other shard. We called that split control plane / data plane, and it is the reason the cluster looks the way it does.

## Why Viewstamped Replication

We picked VSR ([Viewstamped Replication Revisited](https://github.com/apache/iggy/blob/master/assets/vsr.pdf) by Liskov and Cowling, to be precise) over Raft for two properties of the protocol itself, rather than for anything on the usual comparison charts.

The first is determinism. In Raft a leader emerges from an election: followers time out at randomized intervals, ask for votes, and if two of them ask at the same time the election splits and everybody retries with a fresh random timeout. In VSR nobody votes on who leads, the primary of a view is a pure function of the view number, replica `v % n`, and a view change is a deterministic exchange of `StartViewChange` and `DoViewChange` messages (a quorum of them, but with nothing to elect) that converges on that replica:

```rust
pub const fn primary_index(&self, view: u32) -> u8 {
    (view % self.replica_count as u32) as u8
}
```

Given the same messages in the same order, every replica makes the same decision, which is exactly the property you want when you intend to run the whole cluster inside a simulator and replay any failure from a seed. That was the plan from day one, and a protocol with randomness in its liveness path would have fought us the whole way.

The second is that the protocol does not need stable storage to run. Raft requires a replica to persist its current term, its vote and its log before it answers anyone, its safety argument rests on that. VSR Revisited is designed without any persistent state on the replicas: a crashed replica comes back through a recovery protocol that asks the others what it missed, and durability is something you add on top rather than something the protocol leans on. The paper argues this informally rather than proving it, and later work (*Recovering Shared Objects Without Stable Storage*, DISC 2017) found a hole around view changes, which is why our replicas do sync the view they act in to disk before acting in it. Still, the architecture of our cluster has a few spots where we take direct advantage of the fact that VSR does not require persistent storage, and those are worth a proper explanation, so we are saving them for the later parts of this series. It also helps that the protocol is pretty well understood in this space (TigerBeetle runs on the same family), and that the paper is fairly short, you can read it in one sitting, which for a consensus paper is a feature.

The protocol itself, in one paragraph: the primary assigns every client request an operation number and sends a `Prepare` to the backups, each backup writes it to its journal and answers `PrepareOk`, and once a quorum has answered the operation is committed and the client gets its reply. When the primary goes quiet for longer than the liveness window, the backups run a view change and the primary of the next view takes over. Three nodes survive one failure and five survive two (past that the replication quorum is capped at three, the clustering docs spell out the rest), which is why we consider three the useful minimum, a two-node cluster is legal, but it tolerates exactly nothing. Everything runs on a fixed 10 ms tick, so every timeout is a count of ticks rather than a wall-clock duration and that is by design, but that is a story for a later part.

## Anatomy of an Iggy cluster

Remember the two groups of resources from the previous post? They became two *planes* of replication.

Our **metadata plane** is a single VSR group living on shard0 of every node. It replicates streams, topics, users, permissions, consumer groups and personal access tokens, in other words everything that used to be behind the `left-right` single writer. The `left-right` structure is still there by the way, the difference is that the writer's mutations are now agreed upon by a quorum before they are applied.

Our **partition plane** is one VSR group *per partition*, hosted on whichever shard owns that partition by hash, and it replicates messages and consumer offsets. A three-node cluster with 24 partitions therefore runs 25 independent consensus groups, each with its own operation numbers, its own view and its own commit point, and a `Prepare` for partition 7 never waits behind one for partition 8, nor behind a `CreateStream`, in log order or commit (they do share the wire and the shard threads). This is the part we refused to compromise on. A single cluster-wide log would've been pretty simple to implement, but it would've put one serialization point in front of every partition.

From the client's point of view the cluster is presented via `get_cluster_metadata` which returns the roster with the current primary of the metadata plane marked as `Leader`, the TCP SDKs follow a redirect to it on connect and remember the rest of the roster for the day the leader dies (HTTP never redirects, QUIC and WebSocket redial the address they were given). Every frame carries a client id and a request number (HTTP gets both assigned by the server), which the server uses to deduplicate retries within a session, a reply table on the metadata plane and request watermarks on the partition plane. A reconnect is a new session, so a produce that timed out mid-flight comes back to the caller as ambiguous rather than replayed, and retrying it yourself can append it twice. A produce reply carries the partition and the offset that were actually committed.

Membership is deliberately simple as well. There is no discovery protocol and no runtime reconfiguration (yet), a cluster is defined by a static bootstrap roster: the same list of nodes is handed to every process at startup, each process is told which entry it is, and that roster is what a node uses to find its peers during bring-up and to know how many acknowledgements a quorum takes. It stays fixed for the lifetime of the cluster, and a hash of the cluster's name is stamped into every node's on-disk state on first boot, so a node can't accidentally join the wrong one (the [clustering docs](https://iggy.apache.org/docs/clustering/configuration/) cover the details). Without a roster the very same code runs as a replication group of one, there's no separate single-node mode left to maintain.

## Two servers, one repository

Now for the actual migration, which is where this post earns the word "journey" in its title.

We did not `cargo add clustering` to the server, instead we built the pieces next to it first: `consensus`, `metadata`, `journal` and `message_bus` started life as standalone crates with no listener attached to them, followed by `partitions` and `shard`, and for about three months the only thing that could drive them was our simulator, which deserves and will get a post of its own. Only once the protocol was doing something sensible under that simulator did we assemble the crates into a second binary, `iggy-server-ng`, which lived in the repository right next to the old one.

For a good while the new server even depended on the legacy `server` crate, because reusing the segment and index loaders looked like a free lunch, but eventually we had to deconstruct the old `server` crate as the data layout started to diverge. The new server writes a 24-byte segment index entry, the legacy loader hard-codes the old 16-byte one, and the first restart greeted us with `Index data must be exactly 16 bytes`. We moved the genuinely shared parts into a `server_common` crate, duplicated the parts that were going to diverge anyway, and removed the dependency entirely, so that when the legacy server was finally deleted, nothing was left holding onto it.

From there the work was parity, running every test suite we own against both servers until they agreed: the integration suite, the cross-language BDD scenarios, the CLI suite and the end-to-end tests of every SDK. The new wire format alone forced us to migrate the Rust, Go, Java, C#, Node.js, Python, C++ and PHP clients. Meanwhile the old server kept shipping releases as if nothing was happening, but that was the whole point.

When the last suite went green, the swap was a fairly simple single commit titled *promote server-ng to the Apache Iggy server*: 511 files changed, 12,893 lines added, 50,948 lines removed, and `0.9.0-edge.2` became the first build shipped from the new server.

## Benchmarks

Now the part that all of you are probably most interested in. Every run uses the same [`iggy-bench`](https://iggy.apache.org/docs/server/benchmarking/) workload, 1000 byte messages and 250 messages per batch over TCP, on AWS `i4i.4xlarge` instances: 16 vCPUs (8 physical cores) of Intel Xeon Platinum 8375C at 2.90 GHz, 128 GiB of RAM and a 3.75 TB local NVMe SSD, all in one availability zone on a network whose documented baseline is 9.375 Gbit/s (1172 MB/s). The server, the producers and the consumers each get their own VM, and the cluster arm has three server VMs plus one running the bench. The two `0.9.0` rows in every table link to their reports on [benchmarks.iggy.apache.org](https://benchmarks.iggy.apache.org), and every latency in the tables is the number in the report. Derived, not copied: the unthrottled throughputs (user data over the slowest actor's wall time, lower than the per-actor sum the reports print) and the ratio rows (computed from unrounded values, so their last digit can differ from a ratio of the printed cells). The `0.8.2` runs are not on the dashboard, they ran on the same instance type two days earlier.

There are three rows per table because there are two migrations to price. The first is from the legacy server (`0.8.2-edge.1`) to the new one (`0.9.0`) on a single node: with clustering disabled the new server still pushes every write through a one-replica consensus group, so this pair is the cost of the protocol machinery itself. The second is from one node to three, which adds a network round trip to every produce (and a remote fsync only under `persisted` durability) and nothing to a poll that stores no offset, since reads are served from the leader's local state. Most workloads are rate-capped at the same throughput on all three arms, so the comparison is on latency, and the two ratio rows under each latency table are exactly those two migrations. Each workload ran once per arm, and on this hardware a repeat of the same binary moves the percentiles by up to 1.7×, so treat anything below that as noise.

### 20 Producers × 20 Streams — 200 GB, unthrottled

| Version | Throughput |
|---|---:|
| 0.8.2-edge.1, single node | 2,274 MB/s |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/d7ef0e8c-d152-4c83-8036-4531c17c63ab) | 2,062 MB/s |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/014a1fb7-c218-424f-aa14-e0906de1e167) | 1,134 MB/s |

Throughput here is the user data divided by the wall time of the slowest producer, not the sum of per-producer averages the bench prints. The single node stays within 10% of the legacy number, inside the run-to-run noise. The cluster tops out at half, and we have not pinned down why yet. Replication is a chain, the leader sends each `Prepare` to the next replica and that one forwards it, so the leader's network card moves twice the user data, not three times, and the single node pushed almost double the documented baseline through the same NIC, so the flat 1,134 MB/s points to a limit we have not identified rather than to the protocol's commit path: the capped runs below hold 800 MB/s on the cluster with latency to spare.

### 20 Producers × 20 Streams — 62 GB at 800 MB/s

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 800 MB/s (cap) | 0.34 ms | 0.89 ms | 0.96 ms | 1.12 ms | 3.15 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/999f0e08-def6-425a-9d76-d38b9f357160) | 800 MB/s (cap) | 0.65 ms | 1.14 ms | 1.31 ms | 11.09 ms | 16.87 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/b11643e3-1c2f-409b-bab8-068b69c835d6) | 800 MB/s (cap) | 1.78 ms | 2.87 ms | 3.19 ms | 3.68 ms | 4.89 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.88× | 1.29× | 1.36× | 9.91× | 5.36× |
| 3-node cluster ÷ 0.9.0 single node | — | 2.74× | 2.51× | 2.43× | 0.33× | 0.29× |

Same throughput on all three rows, so read the latency. The rewrite costs 0.31 ms at the median (0.34 to 0.65 ms), the price of running every batch through the prepare, journal and commit pipeline with nobody to talk to, and 1.36× at P99, inside the noise band, so call that unchanged. The quorum adds another 1.1 ms at the median, one round trip inside the availability zone (under `replicated` durability the backup acks from its in-memory journal, the disk only enters the ack path in the next table), and P99 goes from 1.3 to 3.2 ms. The number we don't like is the new single node's P999, 11.1 ms against 1.1 ms, with a P9999 of 17 ms. It does not show up on the cluster (3.7 and 4.9 ms) and it repeats in the balanced workload below, so it is in the single-node path rather than in replication, and we are still chasing it.

### Persisted durability

Under `persisted` durability every batch is fsynced before the reply, on the single node to one disk, on the cluster to two. This is the fairest row pair in the post.

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 800 MB/s (cap) | 1.20 ms | 1.39 ms | 1.51 ms | 1.82 ms | 2.76 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/d74bc016-ecf5-417c-aaa3-931e1302a2df) | 800 MB/s (cap) | 1.23 ms | 1.47 ms | 1.60 ms | 2.25 ms | 5.47 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/3824b53c-2221-433e-af73-bfecaeae67ec) | 800 MB/s (cap) | 2.90 ms | 5.13 ms | 7.07 ms | 12.40 ms | 15.65 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.03× | 1.06× | 1.06× | 1.24× | 1.98× |
| 3-node cluster ÷ 0.9.0 single node | — | 2.36× | 3.49× | 4.42× | 5.51× | 2.86× |

The fsync is the difference between this table and the previous one: the single-node median moves from 0.34 to 1.2 ms on the legacy server and from 0.65 to 1.23 ms on the new one. The cluster waits for two fsyncs on two machines, so its median is the slower of the two plus the round trip, 2.9 ms, and the tail compounds the same way, P99 from 1.6 to 7.1 ms and P999 from 2.2 to 12.4 ms. If you need every batch durable on two disks before the ack, this is what it costs, and no protocol trick makes two disks fsync faster than the slower one.

### Balanced Producer — 5 Producers × 20 Partitions, 62 GB at 833 MB/s

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 833 MB/s (cap) | 0.33 ms | 0.72 ms | 0.98 ms | 1.05 ms | 1.65 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/d92119f3-6aeb-4963-905a-2a5bd9089961) | 833 MB/s (cap) | 0.56 ms | 0.97 ms | 1.21 ms | 3.99 ms | 15.63 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/6cb0f49e-cde8-4b68-a3b9-f58e76d8e491) | 833 MB/s (cap) | 0.86 ms | 1.28 ms | 1.48 ms | 1.97 ms | 2.85 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.71× | 1.36× | 1.23× | 3.80× | 9.48× |
| 3-node cluster ÷ 0.9.0 single node | — | 1.55× | 1.31× | 1.23× | 0.49× | 0.18× |

The cap asked for 800 MB/s here, the limiter's rounding lands it at 833 on all three arms. The cluster's penalty over the single node shrinks to 0.3 ms at the median and at P99 (the P99 gap is inside the noise band), against 1.1 and 1.9 ms on the pinned workload above. The pinned workload also runs 20 groups (20 streams of one partition), so the group count is not the reason; what differs is 5 producers instead of 20 and one stream instead of 20, and these runs do not say which matters. The single node's P999 outlier (4.0 ms) is the same tail as above.

### And what about reading the data?

A poll that stores no offset, as in these runs, never leaves the node it lands on (auto-commit polls do, the offset write is replicated), so the cluster rows should look like the single-node ones, and if they didn't, we would have a bug rather than a trade-off.

#### 20 Consumers × 20 Streams — 62 GB at 800 MB/s, warm page cache

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 800 MB/s (cap) | 0.37 ms | 0.47 ms | 0.52 ms | 0.58 ms | 1.15 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/75743636-b0d0-499d-b855-3d57fc75749d) | 800 MB/s (cap) | 0.52 ms | 0.91 ms | 1.02 ms | 1.57 ms | 5.92 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/7c8faf89-ae5d-4d63-9346-03569749186e) | 800 MB/s (cap) | 0.48 ms | 0.87 ms | 0.93 ms | 1.23 ms | 1.88 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.40× | 1.95× | 1.97× | 2.69× | 5.17× |
| 3-node cluster ÷ 0.9.0 single node | — | 0.93× | 0.95× | 0.91× | 0.78× | 0.32× |

#### 20 Consumers × 20 Streams — 62 GB at 800 MB/s, cold page cache

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 800 MB/s (cap) | 0.47 ms | 0.59 ms | 0.85 ms | 1.10 ms | 2.29 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/ff503e0b-b71b-4d2f-a234-31f37216959f) | 800 MB/s (cap) | 0.50 ms | 4.28 ms | 4.70 ms | 5.16 ms | 6.64 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/4121c421-d286-4031-aa67-10b6cc6cd9ba) | 800 MB/s (cap) | 0.48 ms | 3.46 ms | 3.83 ms | 4.24 ms | 4.60 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.06× | 7.19× | 5.52× | 4.70× | 2.90× |
| 3-node cluster ÷ 0.9.0 single node | — | 0.96× | 0.81× | 0.82× | 0.82× | 0.69× |

Warm reads on the cluster are the single node's numbers, 0.93 against 1.02 ms at P99, and so is the unthrottled cold read (derived the same way as the first table): 2,661 MB/s on the legacy server, [2,713 MB/s](https://benchmarks.iggy.apache.org/benchmarks/f42e7394-fd86-432d-ac34-63037857e268) on the new single node and [2,710 MB/s](https://benchmarks.iggy.apache.org/benchmarks/139c3451-f817-46ff-96cb-0539e0e2b99a) on the cluster. Replication costs reads nothing, which is the point of serving them from local state. The cold rows do show a regression that has nothing to do with clustering: the new server's cold-read P95 is 4.3 ms against 0.6 ms on the legacy one, and the cluster is no worse at 3.5 ms, so this is the new server's disk read path and it is on the list.

### A single producer — 15 GB at 500 MB/s

| Version | Throughput | P50 | P95 | P99 | P999 | P9999 |
|---|---:|---:|---:|---:|---:|---:|
| 0.8.2-edge.1, single node | 500 MB/s (cap) | 0.25 ms | 0.52 ms | 0.55 ms | 0.58 ms | 0.60 ms |
| [0.9.0, single node](https://benchmarks.iggy.apache.org/benchmarks/4829cd99-ef96-4ec7-ae2d-c617ec9e3b39) | 500 MB/s (cap) | 0.35 ms | 0.65 ms | 0.68 ms | 1.36 ms | 11.16 ms |
| [0.9.0, 3-node cluster](https://benchmarks.iggy.apache.org/benchmarks/01ae75b4-034e-494e-b50e-355d51554be8) | 337 MB/s (missed the cap) | 0.72 ms | 0.93 ms | 0.97 ms | 1.06 ms | 1.88 ms |
| 0.9.0 single node ÷ 0.8.2 | — | 1.37× | 1.24× | 1.23× | 2.35× | 18.48× |
| 3-node cluster ÷ 0.9.0 single node | — | 2.06× | 1.43× | 1.43× | 0.78× | 0.17× |

One producer sends its batches one after the other, so its throughput is bounded by the round trip of a single batch: 250 KB every 0.72 ms is about 350 MB/s, which is roughly where the cluster landed (337 MB/s) while both single-node arms held the 500 MB/s cap. From a single connection the quorum shows up as throughput, not only as latency, and the cure is more producers or bigger batches, with 20 producers the limit above was the network card, not the round trip.

## Closing words

We kept this one deliberately at the level of an introduction. The numbers are also a snapshot: the tails we pointed at along the way are being worked on, and performance improvements are coming in the 0.9.1 release, and its rows will land next to these. If you want to read ahead, the [VSR Revisited paper](https://github.com/apache/iggy/blob/master/assets/vsr.pdf) is fairly short and worth the evening. Stay tuned, we're just getting started 🚀
