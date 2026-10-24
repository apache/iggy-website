# Glossary

> Short definitions of the terms used across the Apache Iggy docs, with links to where each one is explained.

Rendered page: https://iggy.apache.org/docs/introduction/glossary/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/glossary.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

A one-line definition of each term, with a link to the page that explains it.

**Append-only log.** An ordered list of messages that only grows at the end. Messages can't be changed once written, and you can read from any earlier point to replay them. See [Concepts](https://iggy.apache.org/docs/introduction/concepts#append-only-log).

**Auto-commit.** An option on a poll. The server saves the consumer's position as it returns the messages, before the consumer has processed them. See [Polling messages](https://iggy.apache.org/docs/introduction/concepts#polling-messages).

**Connection string.** A single value such as `iggy://user:password@localhost:8090` that tells a client how to connect. The Rust SDK and the SDKs that wrap it (Python, C++ and PHP) accept one. See [Connection strings](https://iggy.apache.org/docs/sdk/connection-strings).

**Consumer.** A client that reads messages on its own rather than as part of a consumer group. Its position is kept separately from every other consumer's.

**Consumer group.** A set of consumers that share a topic's partitions, with each partition read by one member at a time. See [Consumer groups](https://iggy.apache.org/docs/introduction/concepts#consumer-groups).

**Durability.** A topic setting, `replicated` or `persisted`, that decides what must be done before a write is reported as successful. See [Durability](https://iggy.apache.org/docs/server/durability).

**Offset.** The position of a message within a partition, starting at 0. See [Concepts](https://iggy.apache.org/docs/introduction/concepts#append-only-log).

**Partition.** Where a topic's messages are actually stored. A topic's messages are spread across its partitions. See [Partition](https://iggy.apache.org/docs/introduction/concepts#partition).

**Partitioning.** How a producer picks the partition for a message: a fixed partition, round robin, or a hash of a message key. See [Getting started](https://iggy.apache.org/docs/introduction/getting-started).

**Payload.** The body of a message. The server stores it as bytes without interpreting it, so the format is up to you. See [Serialising messages](https://iggy.apache.org/docs/introduction/serialising-messages).

**Personal access token.** A token you create on the server and use in place of a username and password, for example in a scraper or a script. See [Connection strings](https://iggy.apache.org/docs/sdk/connection-strings).

**Primary and replica.** In a cluster, the primary orders writes and the replicas copy them. If the primary fails, the replicas elect a new one. See [Viewstamped Replication](https://iggy.apache.org/docs/clustering/vsr).

**Retention policy.** Topic settings that delete old messages by age or by size. See [Topic options](https://iggy.apache.org/docs/server/topic-options).

**Segment.** Part of a partition, stored on disk as a data file and an index file. Retention deletes old segments whole. See [Segment](https://iggy.apache.org/docs/introduction/concepts#segment).

**Shard.** One thread in the server that owns a set of partitions. See [Architecture](https://iggy.apache.org/docs/introduction/architecture).

**Stream.** A container for related topics. For example, a `dev` stream and a `production` stream can each have their own `orders` topic. See [Stream](https://iggy.apache.org/docs/introduction/concepts#stream).

**Topic.** A named set of partitions for one kind of message, such as orders or user events. See [Topic](https://iggy.apache.org/docs/introduction/concepts#topic).

**User headers.** Optional key and value pairs sent with a message, kept separate from the payload. See [Serialising messages](https://iggy.apache.org/docs/introduction/serialising-messages).

**VSR.** Viewstamped Replication, the protocol Apache Iggy uses to keep replicas in step. See [Viewstamped Replication](https://iggy.apache.org/docs/clustering/vsr).
