# Concepts

> The domain model behind Iggy, and how an append-only streaming log differs from a message broker.

Rendered page: https://iggy.apache.org/docs/introduction/concepts/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/concepts.mdx

Iggy is a persistent message streaming platform: messages are stored in a form of an **append-only log**. You can create multiple streams, consisting of topics, which might have one or more partitions assigned, e.g. to achieve the horizontal scalability between many independent consumers or higher system resiliency. You can think of Iggy as an alternative to Kafka or RabbitMQ streams.

## Message streaming

You've probably used RabbitMQ or Kafka already. They look similar at the first glance, and you can achieve the similar results with both (e.g. publishing and consuming the events by the different applications built on top of microservices architecture), but they work differently underneath.

The main difference is that RabbitMQ (except the recently released Streams plugin) is the **message broker**, which means that it's responsible for delivering the messages to the consumers. It works in the FIFO (First In, First Out) manner and the messages are being kept in the queues. For example, if you have multiple, distinct consumers, then each one would create its own queue, the message would be replicated between each queue and each consumer would be responsible for reading the messages from its own queue. Once the message is processed, it's gone from the queue, so there's **no built-in way to replay** past the messages. The more consumers you have, the more queues you have to create, which might result in more resources being used. The typical message broker follows the so-called smart pipes and dumb endpoints pattern.

On the other hand, Kafka is a **message streaming platform**, meaning that it's not responsible for delivering the messages to the consumers, but rather it's storing them in a form of an append-only log. The consumers are responsible for reading the messages from the log and processing them. You might have multiple distinct consumers, and it doesn't affect the resource usage as there's only one log. The consumers can read the messages from the beginning, or from the specific offset, thus you can replay the messages. The typical message streaming platform follows the so-called dumb pipes and smart endpoints pattern.

Both approaches have advantages and disadvantages. The message broker is a more mature concept, but the message streaming platform is gaining more and more popularity, especially in the cloud-native world. And you can achieve much higher performance and throughput with the message streaming platform, since it acts as a simple database, being optimized for the append-only operations and can be queried in a very efficient way.

Iggy is the latter, a message streaming platform.

## Append-only log

The append-only log is the core concept of Iggy. It's a simple data structure, which is optimized for the append-only operations. It's a sequence of records, that are being appended to the end of the log. The records are **immutable**, so that they can't be changed once they are written to the log. The records are being written in the order they are received, which results in the log being ordered.

You address the log by **offset**, the position of the record in the log. The offset is a simple integer that starts from 0 and is incremented by 1 for each record. When the client reads the records, it specifies the offset to start from and the maximum number of records it wants. Starting from the beginning, or from any earlier offset, is how you replay the messages.

<AppendOnlyLogViz />

<StreamHierarchy />

## Stream

While we could put an equal sign between the log and the stream, they are not the same, at least in a case of Iggy streaming server.
The stream is a logical concept, and you might think of it as a **namespace**. For example, you could have a single stream for the whole system, or multiple streams e.g. representing the different environments, such as `dev`, `staging` and `production`. The stream is identified by its unique ID. The stream can have one or more topics assigned, which results in the records being published to the specific topics that belong to the particular stream.

## Topic

The topic is also the logical concept, which is a part of the stream. The topic is identified by its unique ID. You could think of topic as an entity being responsible for storing the specific type of the records. For example, you could have a topic for the user events, and another topic for the order events, etc.

The messages are not being stored in the topic directly, but rather in the **partitions**, which are assigned to the topic. The topic can have one or more partitions assigned, that could help achieve higher parallelism and throughput. The topic can also have the **retention policy** assigned, which means that the records are being deleted automatically once they are older than the specified retention period. Topics also support maximum size limits and per-topic durability options (`segment_size`, `enforce_fsync`, flush thresholds) set at creation, plus a `compression_algorithm` option (a placeholder today: no compression is applied yet).

## Partition

The partition has its own unique ID and belongs to the topic. The partition is responsible for storing the records. The records are being distributed between the partitions, therefore the partition acts as a simple database, which is optimized for the append-only operations. The partition is identified by its unique ID, which is an integer. Stream, topic and partition IDs are all assigned **starting from 0**, incremented by 1 for each new one. The partition ID is unique per topic, thus the same partition ID can be used in multiple topics.

Thanks to having multiple partitions, we can achieve the horizontal scalability between many independent consumers, since each consumer can read the messages from the different partitions. This can be achieved by using more advanced concepts such as consumer groups.

Each partition in the thread-per-core architecture is owned by **exactly one shard** and includes:
- A `SegmentedLog` with sealed segments and one active segment
- Consumer offsets and consumer group offsets

## Segment

The segment, being a part of the partition, is the actual **physical layer** which stores the records in the binary format in a form of the files. Each segment has the limited size (1 GiB unless the topic sets its own `segment_size`) and once it's full, the new segment is being created automatically. The segment name is based on the start offset of the first record in the segment and is unique per partition.

Each segment consists of:
- `.log` file - the actual message data
- `.index` file - positional and time indexes for fast lookups

## Polling messages

Consumers can poll the messages in multiple ways:

- **By offset** - start reading from the specified offset. The client tracks its own position.
- **By timestamp** - start reading from the first message at or after the given timestamp.
- **First / Last** - start from the beginning or the end of the partition.
- **Next** - continue from the consumer offset stored on the server side. The client no longer needs to track the offset itself. Combine it with `auto_commit: true` to commit the offset automatically once the messages are fetched (*at-most-once* delivery), or call `store_offset()` explicitly after processing.

## Consumer groups

Consumer groups provide horizontal scaling for message consumption. When multiple consumers join the same consumer group, the server automatically distributes partitions among group members so that each partition is consumed by **exactly one member**. When members join or leave, the server triggers a **cooperative partition rebalancing** with a pending revocation phase (configurable timeout, default 30s) to ensure smooth transitions without message loss.

<ConsumerGroupViz />

## Message format

<MessageHeaderDiagram />

In the SDKs, each message carries a 64-byte in-memory header (little-endian fields). On the wire and on disk, messages travel inside batch records with a compact 48-byte per-message frame. See the [Binary Protocol](/docs/binary-protocol) section for the exact encodings.

| Field | Bytes | Type | Description |
|-------|-------|------|-------------|
| checksum | 0-8 | u64 | xxHash3 integrity checksum |
| id | 8-24 | u128 | Unique message ID (UUIDv4) |
| offset | 24-32 | u64 | Sequential offset in partition |
| timestamp | 32-40 | u64 | Server-assigned timestamp |
| origin_timestamp | 40-48 | u64 | Client-provided timestamp |
| user_headers_length | 48-52 | u32 | Length of optional headers |
| payload_length | 52-56 | u32 | Length of payload |
| reserved | 56-64 | u64 | Reserved (must be 0) |

After the header comes the optional user headers bytes, followed by the payload bytes.

To see how the server schedules these concepts across CPU cores and stores them on disk, head over to [architecture](/docs/introduction/architecture).
