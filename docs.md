# Welcome

> Apache Iggy documentation: how Iggy organizes data into streams, topics, partitions and segments, and where to start.

Rendered page: https://iggy.apache.org/docs/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/index.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

**Apache Iggy: hyper-efficient message streaming.** A persistent message streaming platform written in Rust, built for millions of messages per second with low latency: sub-millisecond P99 tail latency, multi-GB/s throughput on a single node, and batched disk I/O with io_uring and vectored writes on Linux. The name comes from the Italian Greyhound.

Start here:

- [Getting started](https://iggy.apache.org/docs/introduction/quickstart): run the server and send your first message.
- [Architecture](https://iggy.apache.org/docs/introduction/architecture): thread-per-core, io_uring and partition ownership.
- [Connectors](https://iggy.apache.org/docs/connectors/introduction): source and sink plugins for data integration, such as PostgreSQL, MongoDB, Elasticsearch, Iceberg and Quickwit.
- [SDKs](https://iggy.apache.org/docs/sdk/introduction): Rust, Python, Java, Go, Node.js, C#, C++ and PHP.
- [Server configuration](https://iggy.apache.org/docs/server/configuration): performance, storage and security settings.
- [CLI](https://iggy.apache.org/docs/cli/start), [Web UI](https://iggy.apache.org/docs/web_ui/start) and [MCP server](https://iggy.apache.org/docs/ai/mcp).

**Diagram: How Iggy compares with traditional message streaming platforms.**

| Area | Traditional | Iggy |
|---|---|---|
| Runtime | JVM or Go runtime with GC pauses | Native Rust, no GC, predictable latency |
| I/O model | epoll plus a blocking thread pool for disk | io_uring completion-based I/O on Linux |
| Threading | Work-stealing across shared threads | Thread-per-core, configurable CPU and NUMA affinity |
| Serialization | Full deserialization on every read | Zero-copy views into raw buffers |
| Memory | Heap allocations on the hot path | 4 GiB pool budget, buffers allocated on demand, 28 sizes from 4 KiB to 512 MiB |
| Binary | JVM plus ZooKeeper or KRaft and dependencies | Single binary of about 20 MB, using native OS libraries |

## How Iggy organizes data

Iggy uses a hierarchical model: **streams** contain **topics**, topics contain **partitions**, and partitions store messages in **segments** on disk. This gives you flexible multi-tenancy, parallel processing, and efficient storage all in one.

**Diagram: Stream hierarchy.** An example of how data is organised:

- Stream `orders` (ID 0)
  - Topic `user-events`, 3 partitions (about 2.4 million messages a second)
    - Partitions 0, 1 and 2, each an append-only log made of segments: seg-0 and seg-1 are sealed, seg-2 is active.
  - Topic `order-events`, 3 partitions (about 1.8 million messages a second)
    - Partitions 0, 1 and 2, with the same segment layout.

A stream contains topics, a topic contains partitions, and a partition is stored as segments.

## The append-only log

Every partition is an append-only log. Messages are **immutable** once written, consumers can start from a chosen offset, and retained messages can be replayed. Retention removes old data, and offsets can contain gaps.

**Diagram: Append-only log.** Messages are appended in order, each with the next offset (0, 1, 2 and so on). New messages are always written at the end. A consumer tracks its own position in the log with an offset, independently of other consumers.

## Key capabilities

| Capability | Details |
|-----------|---------|
| **Transport** | TCP, QUIC, WebSocket (custom binary protocol), HTTP (REST) |
| **Performance** | Thread-per-core + io_uring on Linux, binary message views, configurable memory pool with a default 4 GiB budget |
| **Security** | TLS on all transports, Argon2id hashing, AES-256-GCM message encryption, [granular permissions](https://iggy.apache.org/docs/server/security) with per-stream/per-topic permissions |
| **Connectors** | [16 sink and 4 source plugins](https://iggy.apache.org/docs/connectors/introduction) including PostgreSQL, MongoDB, Elasticsearch, ClickHouse, Apache Iceberg, S3, with data transforms |
| **AI Integration** | [MCP server](https://iggy.apache.org/docs/ai/mcp) with 40+ tools for LLM-driven message streaming management |
| **Management** | [Web UI](https://iggy.apache.org/docs/web_ui/start) dashboard (embedded or standalone), [CLI](https://iggy.apache.org/docs/cli/start) with shell completions, Prometheus metrics; connector OpenTelemetry export ([broker export limits](https://iggy.apache.org/docs/server/configuration#telemetry)) |
| **Clustering** | Built on [Viewstamped Replication (VSR)](https://iggy.apache.org/docs/clustering/vsr) consensus; single node by default, multi-node via `[cluster]` configuration |
| **Deployment** | Single server process, [Docker & Helm](https://iggy.apache.org/docs/server/docker), configurable CPU/NUMA affinity on Linux |

## Ecosystem

Iggy is more than just a server. The project includes a full ecosystem of tools:

- **[Connectors Runtime](https://iggy.apache.org/docs/connectors/introduction)** - dynamically loaded Rust plugins for data integration: 16 sinks and 4 sources. Ingest from PostgreSQL, Elasticsearch or InfluxDB into Iggy, or forward to MongoDB, Elasticsearch, ClickHouse, Apache Iceberg, Quickwit, S3 and more. Built-in data transforms and Prometheus metrics.
- **[MCP Server](https://iggy.apache.org/docs/ai/mcp)** - Model Context Protocol server exposing 40+ tools for LLM integration. Works with Claude Desktop via stdio and HTTP transports.
- **[Web UI](https://iggy.apache.org/docs/web_ui/start)** - SvelteKit dashboard for stream/topic management, message browsing with JSON/string/XML decoders, and user management.
- **[CLI](https://iggy.apache.org/docs/cli/start)** - full-featured command-line interface with named connection contexts, session-based login, and shell completions.
- **[SDKs](https://iggy.apache.org/docs/sdk/introduction)** - client libraries for 8 languages (Rust, Python, Java, Go, Node.js, C#, C++, PHP), most with runnable examples.
- **[Benchmarking](https://iggy.apache.org/docs/server/benchmarking)** - built-in `iggy-bench` tool with a Yew/WebAssembly dashboard for performance testing.
