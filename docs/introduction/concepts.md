# Concepts

> The domain model behind Iggy, and how an append-only streaming log differs from a message broker.

Rendered page: https://iggy.apache.org/docs/introduction/concepts/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/concepts.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

Iggy is a persistent message streaming platform: messages are stored in a form of an **append-only log**. You can create multiple streams, consisting of topics, which might have one or more partitions assigned, e.g. to divide consumption among independent consumers. Multi-node replication provides redundancy. You can think of Iggy as an alternative to Kafka or RabbitMQ streams.

## Message streaming

You've probably used RabbitMQ or Kafka already. They look similar at the first glance, and you can achieve the similar results with both (e.g. publishing and consuming the events by the different applications built on top of microservices architecture), but they work differently underneath.

RabbitMQ is a **message broker** with both queues and [streams](https://www.rabbitmq.com/docs/streams). Traditional queues deliver messages to consumers and remove them after acknowledgement, or on delivery when automatic acknowledgement is used, so acknowledged messages cannot be replayed from the queue. Multiple consumers can share a queue and divide its messages. Independent subscribers that each need a copy use separate queues bound to an exchange. Queues normally use FIFO (First In, First Out) order, but priorities, redelivery and competing consumers can affect the observed order. See [RabbitMQ's queue semantics](https://www.rabbitmq.com/docs/queues). The typical message broker follows the so-called smart pipes and dumb endpoints pattern.

On the other hand, Kafka is a **message streaming platform** that stores messages in an append-only log and serves [consumer fetch requests](https://kafka.apache.org/41/design/design/). The consumers are responsible for reading the messages from the log and processing them. Multiple consumer groups can read the same retained log without a separate stored copy for each group, although their fetch requests still consume CPU and network resources. The consumers can read the messages from the beginning, or from the specific offset, thus you can replay the messages. The typical message streaming platform follows the so-called dumb pipes and smart endpoints pattern.

Both approaches have advantages and disadvantages. The message broker is a more mature concept, but the message streaming platform is gaining more and more popularity, especially in the cloud-native world. And you can achieve much higher performance and throughput with the message streaming platform, since it acts as a simple database, being optimized for the append-only operations and can be queried in a very efficient way.

Iggy is the latter, a message streaming platform.

## Append-only log

The append-only log is the core concept of Iggy. It's a simple data structure, which is optimized for the append-only operations. It's a sequence of records, that are being appended to the end of the log. The records are **immutable**, so that they can't be changed once they are written to the log. Records within a partition follow the order admitted by that partition's primary. There is no global ordering across partitions.

You address the log by **offset**, the position of the record in the log. Offsets start from 0 and increase within a partition. They are not guaranteed to be contiguous: after recovery, the server can skip reserved offsets to avoid reusing them. When the client reads the records, it specifies the offset to start from and the maximum number of records it wants. Starting from the beginning, or from any earlier offset, is how you replay the messages.

**Diagram: Append-only log.** Messages are appended in order, each with the next offset (0, 1, 2 and so on). New messages are always written at the end. A consumer tracks its own position in the log with an offset, independently of other consumers.

**Diagram: Stream hierarchy.** An example of how data is organised:

- Stream `orders` (ID 0)
  - Topic `user-events`, 3 partitions (about 2.4 million messages a second)
    - Partitions 0, 1 and 2, each an append-only log made of segments: seg-0 and seg-1 are sealed, seg-2 is active.
  - Topic `order-events`, 3 partitions (about 1.8 million messages a second)
    - Partitions 0, 1 and 2, with the same segment layout.

A stream contains topics, a topic contains partitions, and a partition is stored as segments.

## Stream

While we could put an equal sign between the log and the stream, they are not the same, at least in a case of Iggy streaming server.
The stream is a logical concept, and you might think of it as a **namespace**. For example, you could have a single stream for the whole system, or multiple streams e.g. representing the different environments, such as `dev`, `staging` and `production`. The stream is identified by its unique ID. The stream can have zero or more topics assigned, which results in the records being published to the specific topics that belong to the particular stream.

## Topic

The topic is also the logical concept, which is a part of the stream. The topic is identified by its ID, which is unique within its stream. You could think of topic as an entity being responsible for storing the specific type of the records. For example, you could have a topic for the user events, and another topic for the order events, etc.

The messages are not being stored in the topic directly, but rather in the **partitions**, which are assigned to the topic. The topic can have one or more partitions assigned, that could help achieve higher parallelism and throughput. The topic can also have a **retention policy**. Expiry removes whole sealed segments after their newest message has expired, subject to the stored consumer-offset barrier; it does not delete each message immediately at its expiry time. See [topic options](https://iggy.apache.org/docs/server/topic-options) for expiry and size-limit behavior. Topics also support maximum size limits and per-topic storage options (`segment_size`, `durability`, `consumer_offset_durability`, and flush thresholds) set at creation, plus a `compression_algorithm` option (a placeholder today: no compression is applied yet). Both [durability policies](https://iggy.apache.org/docs/server/durability) independently default to `replicated`.

## Partition

The partition has its own unique ID and belongs to the topic. The partition is responsible for storing the records. The records are being distributed between the partitions, therefore the partition acts as a simple database, which is optimized for the append-only operations. The partition is identified by its unique ID, which is an integer. Stream, topic and partition IDs are assigned **starting from 0**. Deleted stream and topic IDs can be reused. New partitions use IDs above the highest remaining partition ID, so deleting the highest partitions can also allow their IDs to be reused. The partition ID is unique per topic, thus the same partition ID can be used in multiple topics.

Thanks to having multiple partitions, we can achieve the horizontal scalability between many independent consumers, since each consumer can read the messages from the different partitions. This can be achieved by using more advanced concepts such as consumer groups.

Each partition in the thread-per-core architecture is owned by **exactly one shard per replica** and includes:
- A `SegmentedLog` with sealed segments and one active segment
- Consumer offsets and consumer group offsets

## Segment

The segment, being a part of the partition, is the actual **physical layer** which stores the records in the binary format in a form of the files. Each segment has a soft size limit (1 GiB unless the topic sets its own `segment_size`). A segment can exceed it by one whole batch before it is sealed and a new segment is created. The segment name is based on the start offset of the first record in the segment and is unique per partition.

Each segment consists of:
- `.log` file - the actual message data
- `.index` file - positional and time indexes for fast lookups

## Polling messages

Consumers can poll the messages in multiple ways:

- **By offset** - start reading from the specified offset. The client tracks its own position.
- **By timestamp** - start reading from the first message at or after the given timestamp.
- **First / Last** - start from the beginning or the end of the partition.
- **Next** - continue from the consumer offset stored on the server side. The server tracks the cursor. On the primary, `auto_commit: true` submits an offset update before the poll response is delivered, without waiting for that update to commit. Follower polls do not advance it. This alone guarantees neither at-most-once nor at-least-once processing. For processing-before-commit ordering, explicitly store the offset after processing, using `store_consumer_offset()` in the Rust SDK.

## Consumer groups

Consumer groups provide horizontal scaling for message consumption. When multiple consumers join the same consumer group, the server automatically distributes partitions among group members so that each partition has **at most one member permitted to poll it** within that group. When members join or leave, the server triggers a **cooperative partition rebalancing** with a pending revocation phase (configurable timeout, default 30s) to let the previous owner finish processing and commit before handoff. Application processing and offset-commit ordering still determine whether failures cause skips or duplicates.

**Diagram: Consumer group.** Three consumers in one group share six partitions: consumer A polls P0 and P3, consumer B polls P1 and P4, and consumer C polls P2 and P5. Within a group, each partition has at most one member allowed to poll it. Members joining or leaving trigger a rebalance, and pending handoffs can pause polling briefly.

## Message format

**Diagram: Rust SDK message header (64 bytes, little-endian).** This is the SDK's byte layout. Wire and disk batches use a 48-byte frame header per message instead.

| Bytes | Field | Type | Meaning |
|---|---|---|---|
| 0-8 | checksum | u64 | xxHash3 integrity checksum |
| 8-24 | id | u128 | Client-supplied 128-bit ID; the Rust SDK generates a UUIDv4 if omitted |
| 24-32 | offset | u64 | Increasing offset within the partition |
| 32-40 | timestamp | u64 | Server-assigned timestamp |
| 40-48 | origin_timestamp | u64 | Client-provided timestamp |
| 48-52 | user_headers_length | u32 | Length of the user headers |
| 52-56 | payload_length | u32 | Length of the payload |
| 56-64 | reserved | u64 | Reserved, must be 0 |

The Rust SDK's `IggyMessageHeader::to_bytes()` representation is 64 bytes, with little-endian fields. The diagram and table describe that SDK representation, not Rust struct memory layout. On the wire and on disk, messages travel inside batch records with a compact 48-byte per-message frame header. See the [Binary Protocol](https://iggy.apache.org/docs/binary-protocol) section for the exact encodings.

| Field | Bytes | Type | Description |
|-------|-------|------|-------------|
| checksum | 0-8 | u64 | xxHash3 integrity checksum |
| id | 8-24 | u128 | Client-supplied 128-bit ID; generated as UUIDv4 when omitted by the Rust SDK |
| offset | 24-32 | u64 | Increasing offset within the partition |
| timestamp | 32-40 | u64 | Server-assigned timestamp |
| origin_timestamp | 40-48 | u64 | Client-provided timestamp |
| user_headers_length | 48-52 | u32 | Length of optional headers |
| payload_length | 52-56 | u32 | Length of payload |
| reserved | 56-64 | u64 | Reserved (must be 0) |

In the SDK message representation, the header is followed by payload bytes and then optional user-header bytes.

To see how the server schedules these concepts across CPU cores and stores them on disk, head over to [architecture](https://iggy.apache.org/docs/introduction/architecture).
