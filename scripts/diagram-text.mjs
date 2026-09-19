/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Text versions of the interactive diagram components, for the Markdown copies
 * written by generate-docs-markdown.mjs. A Markdown reader can't run the
 * components, so each self-closing tag is replaced with the text below.
 *
 * Keep each entry in step with its component in
 * src/components/architecture-diagrams.tsx. The generator fails if a page uses
 * a component that has no entry here.
 */

const SITE = "https://iggy.apache.org";

export const DIAGRAM_TEXT = {
  Bench090LatencyChart: `**Chart: latency, 0.9.0 to the next version, per iggy-bench workload.** Three headline tiles (3-node cluster, persisted, 20 producers at p999 and p99, and single node, 20 producers at p999), then an interactive chart with one row per workload and two dots per row on a log scale, one for the 0.9.0 release and one for the development branch that follows it. It switches between single node and 3-node cluster, between p50, p99 and p999, and between table order and biggest change. The tables below carry the same numbers.`,

  AppendOnlyLogViz: `**Diagram: Append-only log.** Messages are appended in order, each with the next offset (0, 1, 2 and so on). New messages are always written at the end. A consumer tracks its own position in the log with an offset, independently of other consumers.`,

  BenchmarkChart: `**Diagram: Latency improvements, Tokio vs thread-per-core.** Selected historical results comparing v0.5.0 (Tokio) with v0.7.0 (thread-per-core) at about 1,000 MB/s per node. Lower latency is better.

| Partitions | Percentile | Latency reduction |
|---|---|---|
| 8 | P99.99 | 81% |
| 16 | P95 | 28% |
| 16 | P99 | 32% |
| 16 | P99.99 | 92% |
| 32 | P95 | 57% |
| 32 | P99 | 60% |`,

  ConnectorPipeline: `**Diagram: Connector pipelines.**

- Source flow (ingest): a data source (for example PostgreSQL, Elasticsearch or the random generator) is read by the connector runtime through the source plugin's \`poll()\`. The runtime applies any transforms (\`add_fields\`, \`delete_fields\`, \`filter_fields\`, \`update_fields\`), encodes the data and sends it to an Iggy stream and topic.
- Sink flow (egress): the connector runtime polls messages from Iggy as a consumer group, decodes them, applies any transforms, and passes them to the sink plugin's \`consume()\`, which writes to an external system (for example PostgreSQL, MongoDB, Elasticsearch, Iceberg, Quickwit or stdout).`,

  ConsumerGroupViz: `**Diagram: Consumer group.** Three consumers in one group share six partitions: consumer A polls P0 and P3, consumer B polls P1 and P4, and consumer C polls P2 and P5. Within a group, each partition has at most one member allowed to poll it. Members joining or leaving trigger a rebalance, and pending handoffs can pause polling briefly.`,

  DocsHero: `**Apache Iggy: hyper-efficient message streaming.** A persistent message streaming platform written in Rust, built for millions of messages per second with low latency: sub-millisecond P99 tail latency, multi-GB/s throughput on a single node, and batched disk I/O with io_uring and vectored writes on Linux. The name comes from the Italian Greyhound.

Start here:

- [Getting started](${SITE}/docs/introduction/quickstart): run the server and send your first message.
- [Architecture](${SITE}/docs/introduction/architecture): thread-per-core, io_uring and partition ownership.
- [Connectors](${SITE}/docs/connectors/introduction): source and sink plugins for data integration, such as PostgreSQL, MongoDB, Elasticsearch, Iceberg and Quickwit.
- [SDKs](${SITE}/docs/sdk/introduction): Rust, Python, Java, Go, Node.js, C#, C++ and PHP.
- [Server configuration](${SITE}/docs/server/configuration): performance, storage and security settings.
- [CLI](${SITE}/docs/cli/start), [Web UI](${SITE}/docs/web_ui/start) and [MCP server](${SITE}/docs/ai/mcp).`,

  IoUringComparison: `**Diagram: epoll compared with io_uring.**

- epoll is readiness-based. The application asks whether a file descriptor is ready, the kernel says it is, and the application then does the I/O itself. Regular files can't be registered with epoll, so Tokio uses a blocking thread pool for file I/O (512 threads by default).
- io_uring is completion-based. The application submits I/O to the submission queue, the kernel completes it asynchronously, and the result is placed in the completion queue. Both queues are shared ring buffers, and batching spreads the syscall cost across many operations.`,

  MessageFlowDiagram: `**Diagram: Message flow.** A message goes through these steps:

1. Client: sends messages over TCP, QUIC, WebSocket or HTTP.
2. Listener: shard 0 accepts the connection, and the connection's owning shard decodes requests.
3. Stream: the stream ID or name is resolved from local metadata.
4. Topic: the topic and target partition are resolved. Compression is not applied.
5. Router: the request is routed to the shard that owns the partition, using the IggyNamespace hash.
6. Partition: the partition primary admits the write and replicates it through VSR.
7. Segment: the data is flushed to the segment's \`.log\` file with vectored I/O (io_uring).`,

  MessageHeaderDiagram: `**Diagram: Rust SDK message header (64 bytes, little-endian).** This is the SDK's byte layout. Wire and disk batches use a 48-byte frame header per message instead.

| Bytes | Field | Type | Meaning |
|---|---|---|---|
| 0-8 | checksum | u64 | xxHash3 integrity checksum |
| 8-24 | id | u128 | Client-supplied 128-bit ID; the Rust SDK generates a UUIDv4 if omitted |
| 24-32 | offset | u64 | Increasing offset within the partition |
| 32-40 | timestamp | u64 | Server-assigned timestamp |
| 40-48 | origin_timestamp | u64 | Client-provided timestamp |
| 48-52 | user_headers_length | u32 | Length of the user headers |
| 52-56 | payload_length | u32 | Length of the payload |
| 56-64 | reserved | u64 | Reserved, must be 0 |`,

  NamespacePacking: `**Diagram: IggyNamespace bit packing (u64).** Stream, topic and partition IDs are packed into one u64 for fast hashing and shard routing. Bit 63 is reserved for the separate metadata consensus group.

| Bits | Contents |
|---|---|
| 63-52 | Zero for partitions (12 bits) |
| 51-32 | Stream ID (20 bits), up to 1,048,576 streams |
| 31-20 | Topic ID (12 bits), up to 4,096 topics |
| 19-0 | Partition ID (20 bits), up to 1,000,000 partitions |`,

  SegmentVisualization: `**Diagram: Partition storage layout.** An example partition at the default 1 GiB segment size. A segment can exceed that size by one batch before rotating, and message counts depend on payload and batch sizes.

- Segment \`00000000000000000000\`: 1 GiB, about 16 million messages, offsets 0 to 15,999,999, sealed and read-only.
- Segment \`00000000000016000000\`: 1 GiB, about 16 million messages, offsets 16,000,000 to 31,999,999, sealed and read-only.
- Segment \`00000000000032000000\`: 412 MiB so far, about 6.5 million messages, active and being written with vectored I/O.

Each segment has two files: a \`.log\` file with the message data (batch records with a 48-byte header per message), and a \`.index\` file with positional and time indexes for fast offset and timestamp lookups.`,

  ServerEcosystem: `**Diagram: The Iggy server and what connects to it.** The Iggy server uses thread-per-core with io_uring on Linux, and listens on TCP port 8090, QUIC port 8080, HTTP port 3000 and WebSocket port 8092. Around it are producers (send messages), consumers (poll messages), consumer groups (horizontal scaling), the [Web UI](${SITE}/docs/web_ui/start), the [CLI](${SITE}/docs/cli/start), the [MCP server](${SITE}/docs/ai/mcp) for LLM integration, [connectors](${SITE}/docs/connectors/introduction) (sources and sinks) and [benchmarks](${SITE}/docs/server/benchmarking) (iggy-bench). SDKs: Rust, Python, Java, Go, Node.js, C#, C++ and PHP. Security: TLS, Argon2id, AES-256-GCM and role-based access control. Observability: Prometheus and OpenTelemetry.`,

  ShardDiagram: `**Diagram: Thread-per-core shard architecture.** Each shard runs its own compio runtime with an io_uring ring (default capacity 4096), pinned to its own CPU. CPU numbers and partition assignments in this example are illustrative.

- Shard 0 (coordinator) binds all listeners (TCP, QUIC, HTTP, WebSocket) and the replica plane listener. It holds the metadata write handle, terminates QUIC, TLS over TCP, secure WebSocket and HTTP, and hands plaintext TCP and WebSocket connections to other shards by file descriptor transfer. It owns partitions P0, P3 and P6.
- Shard 1 holds a metadata read handle, serves plaintext TCP and WebSocket connections passed to it, and owns P1, P4 and P7.
- Shard 2 does the same and owns P2, P5 and P8.

Shards communicate over bounded \`crossfire\` mpsc channels. Metadata changes go to shard 0, the only shard that commits metadata, while the others read it through left-right handles. Partition operations are routed to the owning shard through a lock-free \`papaya::HashMap<IggyNamespace, PartitionLocation>\`.`,

  StreamHierarchy: `**Diagram: Stream hierarchy.** An example of how data is organised:

- Stream \`orders\` (ID 0)
  - Topic \`user-events\`, 3 partitions (about 2.4 million messages a second)
    - Partitions 0, 1 and 2, each an append-only log made of segments: seg-0 and seg-1 are sealed, seg-2 is active.
  - Topic \`order-events\`, 3 partitions (about 1.8 million messages a second)
    - Partitions 0, 1 and 2, with the same segment layout.

A stream contains topics, a topic contains partitions, and a partition is stored as segments.`,

  WhyIggy: `**Diagram: How Iggy compares with traditional message streaming platforms.**

| Area | Traditional | Iggy |
|---|---|---|
| Runtime | JVM or Go runtime with GC pauses | Native Rust, no GC, predictable latency |
| I/O model | epoll plus a blocking thread pool for disk | io_uring completion-based I/O on Linux |
| Threading | Work-stealing across shared threads | Thread-per-core, configurable CPU and NUMA affinity |
| Serialization | Full deserialization on every read | Zero-copy views into raw buffers |
| Memory | Heap allocations on the hot path | 4 GiB pool budget, buffers allocated on demand, 28 sizes from 4 KiB to 512 MiB |
| Binary | JVM plus ZooKeeper or KRaft and dependencies | Single binary of about 20 MB, using native OS libraries |`,
};
