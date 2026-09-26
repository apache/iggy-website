# Architecture

> Inside the Iggy server: how work is scheduled across cores, how requests are routed, and how a message reaches disk.

Rendered page: https://iggy.apache.org/docs/introduction/architecture/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/architecture.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

This page covers the internals of the Iggy server: how work is scheduled across CPU cores, how requests are routed, and how data ends up on disk. If you're looking for the domain model (streams, topics, partitions, consumer groups, message format), see [concepts](https://iggy.apache.org/docs/introduction/concepts) first.

## How a message flows through Iggy

Before diving into the architecture details, here's an overview of a message's journey from client to disk:

**Diagram: Message flow.** A message goes through these steps:

1. Client: sends messages over TCP, QUIC, WebSocket or HTTP.
2. Listener: shard 0 accepts the connection, and the connection's owning shard decodes requests.
3. Stream: the stream ID or name is resolved from local metadata.
4. Topic: the topic and target partition are resolved. Compression is not applied.
5. Router: the request is routed to the shard that owns the partition, using the IggyNamespace hash.
6. Partition: the partition primary admits the write and replicates it through VSR.
7. Segment: the data is flushed to the segment's `.log` file with vectored I/O (io_uring).

## Thread per core (shared nothing) + io_uring

Iggy uses a **thread-per-core shared nothing architecture** combined with `io_uring` for maximum performance. This design has been proven by systems like ScyllaDB and Redpanda, and is inspired by the Seastar framework.

**Diagram: Thread-per-core shard architecture.** Each shard runs its own compio runtime with an io_uring ring (default capacity 4096), pinned to its own CPU. CPU numbers and partition assignments in this example are illustrative.

- Shard 0 (coordinator) binds all listeners (TCP, QUIC, HTTP, WebSocket) and the replica plane listener. It holds the metadata write handle, terminates QUIC, TLS over TCP, secure WebSocket and HTTP, and hands plaintext TCP and WebSocket connections to other shards by file descriptor transfer. It owns partitions P0, P3 and P6.
- Shard 1 holds a metadata read handle, serves plaintext TCP and WebSocket connections passed to it, and owns P1, P4 and P7.
- Shard 2 does the same and owns P2, P5 and P8.

Shards communicate over bounded `crossfire` mpsc channels. Metadata changes go to shard 0, the only shard that commits metadata, while the others read it through left-right handles. Partition operations are routed to the owning shard through a lock-free `papaya::HashMap<IggyNamespace, PartitionLocation>`.

### How it works

Each configured **shard** (an instance of `IggyShard`) has its own single-threaded `compio` async runtime. With `pin_cores = true`, Linux shard threads are pinned to their selected CPUs via `sched_setaffinity`. NUMA allocation modes also bind memory via `hwlocality`. Setting `pin_cores = false` disables both bindings; shared metadata and inter-shard communication still require synchronization.

### Shard roles and connection distribution

Shard 0 has a special role: it binds **every listener** - the replica plane and all client transports (TCP, QUIC, WebSocket, HTTP). Connections are then spread across shards at accept time:

- **Plaintext TCP and WebSocket** connections are handed off round-robin to peer shards. Shard 0's coordinator duplicates the socket's file descriptor, ships a connection-setup frame to the target shard, and drops its own handle, so the owning shard serves the connection from then on - before a single byte is read.
- **QUIC, TLS-wrapped TCP and secure WebSocket (WSS)** connections terminate on shard 0, because their per-connection state cannot be moved between shards. HTTP is also served on shard 0.

All shards, **including shard 0**, own partitions and serve partition requests.

### Request routing

Requests are routed between shards using **message passing** (via `crossfire` bounded mpsc channels), so partition state remains on its owning shard. The routing logic splits operations into two planes:

- **Metadata operations** (create/delete stream/topic/user etc.) always execute on **shard 0** - it is the only shard that commits metadata
- **Partition operations** (send_messages, poll_messages, store_consumer_offset) are routed to the shard owning that partition via a lock-free concurrent map lookup. A request that lands on a non-owning shard rides the inter-shard message bus to the owner

Partition-to-shard assignment is **deterministic**: the packed `IggyNamespace` is hashed with `Murmur3`, and the upper 16 bits of the hash are taken modulo the shard count (the upper bits are used because Murmur3 has weak lower bits for small integer inputs).

### IggyNamespace

The `IggyNamespace` packs stream_id (20 bits), topic_id (12 bits), and partition_id (20 bits) into a single `u64` for efficient hashing and routing. This gives maximums of 1,048,576 streams, 4096 topics per stream, and 1,000,000 partitions per topic.

**Diagram: IggyNamespace bit packing (u64).** Stream, topic and partition IDs are packed into one u64 for fast hashing and shard routing. Bit 63 is reserved for the separate metadata consensus group.

| Bits | Contents |
|---|---|
| 63-52 | Zero for partitions (12 bits) |
| 51-32 | Stream ID (20 bits), up to 1,048,576 streams |
| 31-20 | Topic ID (12 bits), up to 4,096 topics |
| 19-0 | Partition ID (20 bits), up to 1,000,000 partitions |

### CPU allocation modes

The sharding system supports multiple allocation modes via the `cpu_allocation` config:

- `"all"` - one shard per available CPU core
- A numeric value (e.g. `4`) - exactly N shards, pinned to the first N CPUs in the process's allowed CPU set when pinning is enabled
- A range (e.g. `"5..8"`) - shards on CPUs 5, 6 and 7 when pinning is enabled; those CPUs must be allowed for the process
- `"numa:auto"` - automatically detect NUMA topology and select physical cores, avoiding sibling hyperthreads
- `"numa:nodes=0,1;cores=4;no_ht=true"` - fine-grained NUMA control per node with hyperthread avoidance

### io_uring and compio

Traditional async runtimes like tokio use `epoll` which is **readiness-based** - you ask the kernel "is this file descriptor ready?" and then perform the I/O yourself. [Regular files cannot be registered with epoll](https://man7.org/linux/man-pages/man2/epoll_ctl.2.html). Tokio runs file I/O on a blocking thread pool (512 threads by default, configurable). This does not scale well.

`io_uring` is **completion-based** - you submit I/O requests to a submission queue (SQ), and the kernel completes them and places results in a completion queue (CQ). Both queues are shared ring buffers between user space and kernel. Submissions and completions can be batched to reduce syscalls. This is fundamentally better for disk I/O.

**Diagram: epoll compared with io_uring.**

- epoll is readiness-based. The application asks whether a file descriptor is ready, the kernel says it is, and the application then does the I/O itself. Regular files can't be registered with epoll, so Tokio uses a blocking thread pool for file I/O (512 threads by default).
- io_uring is completion-based. The application submits I/O to the submission queue, the kernel completes it asynchronously, and the result is placed in the completion queue. Both queues are shared ring buffers, and batching spreads the syscall cost across many operations.

Iggy uses **compio** as its async runtime, which provides a driver-disaggregated architecture on top of io_uring (Linux) and IOCP (Windows). Each shard gets its own compio executor configured with:
- Capacity: 4096 concurrent I/O operations (by default)
- Event interval: poll the I/O driver after 128 scheduler ticks (roughly task polls) by default
- Cooperative task running enabled

`IGGY_SHARD_RUNTIME_CAPACITY` and `IGGY_SHARD_EVENT_INTERVAL` override the two numeric defaults. On macOS, compio uses its polling driver and a blocking pool for file I/O.

### Performance: Tokio vs Thread-per-Core

The [historical migration benchmarks](https://iggy.apache.org/blogs/2026/02/27/thread-per-core-io_uring/) compared v0.5.0 with v0.7.0 at approximately 1,000 MB/s per node. The chart shows selected latency reductions for 8, 16 and 32 producers, each using its own stream. The 8-producer case also reported higher P95 and P99 latency; these are not measurements of 0.9.0:

**Diagram: Latency improvements, Tokio vs thread-per-core.** Selected historical results comparing v0.5.0 (Tokio) with v0.7.0 (thread-per-core) at about 1,000 MB/s per node. Lower latency is better.

| Partitions | Percentile | Latency reduction |
|---|---|---|
| 8 | P99.99 | 81% |
| 16 | P95 | 28% |
| 16 | P99 | 32% |
| 16 | P99.99 | 92% |
| 32 | P95 | 57% |
| 32 | P99 | 60% |

### Left-right metadata

Shared metadata (streams, topics, consumer groups) uses a **left-right** concurrent data structure. Shard 0 holds the single write handle and is the only shard that commits metadata mutations, while every shard holds a read handle. This provides:
- Lock-free reads on all shards (no contention on the hot path)
- Strongly consistent writes serialized through shard 0

## Clustering

The server is built on the **Viewstamped Replication (VSR)** consensus protocol. Metadata operations are committed through the VSR write-ahead log **even on a single node**, which is the default deployment. Multi-node clustering is enabled via the `[cluster]` configuration (a node roster plus `--replica-id` to pick the local entry). See [clustering](https://iggy.apache.org/docs/clustering/vsr) for the details and maturity caveats.

## Storage structure

Having in mind that stream consists of topics, which might have one or more partitions assigned, and each partition consists of segments, we can visualize the structure of the Iggy data directory as follows:

```bash
local_data/
├── metadata/
│   └── journal.wal
├── runtime/
│   └── current_config.toml
├── logs/
│   └── iggy-server.log
├── state/
│   └── log/
└── streams/
    └── 0/
        └── topics/
            └── 0/
                └── partitions/
                    └── 0/
                        ├── 00000000000000000000.index
                        ├── 00000000000000000000.log
                        ├── superblock.a
                        ├── superblock.b
                        └── offsets/
                            ├── consumers/
                            └── groups/
```

This example shows a fresh partition with the default paths. The stream, topic and partition directories are named after their numeric IDs, **assigned from 0**. The `metadata/journal.wal` file is the VSR write-ahead log that persists all metadata operations (stream/topic/user creation, etc.). The `runtime/current_config.toml` file captures the configuration the server actually booted with. Segment files are named by their 20-digit start offset. Recovery can create an empty active segment at a reserved offset beyond the last stored message; partition superblocks record the recovery frontiers. The `.index` file is created automatically and speeds up searches by keeping track of the offsets and timestamps of the records. The `offsets/` directory holds the server-side consumer and consumer group offsets.

## Memory pool

Iggy uses a custom memory pool with 28 buckets holding buffer sizes from 4 KiB to 512 MiB. The default pool size is 4 GiB with up to 8192 buffers per bucket. Buffers are allocated on demand and reused; requests that exceed the pool budget can allocate outside it. Frozen buffers can be shared between components without copying their contents. The pool is page-aligned (4096-byte multiples) and requires a **minimum of 512 MiB**.

## Write pipeline

Messages flow through a multi-stage write pipeline:

1. Messages arrive on the owning shard and are buffered in the partition journal.
2. Partition VSR replicates prepares. With `durability=persisted`, a multi-replica group requires recoverable prepare-WAL copies at the replication quorum before commit.
3. Awaited writes apply committed operations before success is returned. A singleton with `durability=persisted` synchronizes local segment state before replying.
4. Ordinary segment writes use per-topic count and byte thresholds (defaults: 1024 messages, 1 MiB); required persistence, capacity pressure, and lifecycle work can flush earlier. The `MessagesWriter` uses **vectored I/O** in chunks of up to 1024 buffers. Partial writes can require more than one I/O submission.
5. When a segment reaches the topic's segment size (default 1 GiB), it is **sealed** and a new segment is created.

Message `durability` and `consumer_offset_durability` default independently to `replicated`. Both policies write data to disk; `persisted` adds a stable-storage requirement at completion. See [Durability](https://iggy.apache.org/docs/server/durability).
