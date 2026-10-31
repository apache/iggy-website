# Coming from Apache Kafka

> How Apache Kafka's topics, partitions, consumer groups and offsets map to Apache Iggy, and what works differently.

Rendered page: https://iggy.apache.org/docs/introduction/coming-from-kafka/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/coming-from-kafka.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

If you already know Apache Kafka, most of Apache Iggy will feel familiar. This page maps the Kafka terms you know to Iggy's and lists what works differently. For when to choose one or the other, see [Apache Iggy or Apache Kafka](https://iggy.apache.org/blogs/2026/09/23/apache-iggy-or-apache-kafka).

## How the terms map

| Kafka | Iggy | What to know |
|---|---|---|
| No equivalent | Stream | A container for related topics. For example, a `dev` stream and a `production` stream can each have their own `orders` topic. |
| Topic | Topic | Belongs to one stream. |
| Partition | Partition | Where messages are stored, as in Kafka. |
| Consumer group | Consumer group | Each partition goes to one member of the group, and the server rebalances when members join or leave. |
| Offset | Offset | Starts at 0 in each partition, but can skip numbers after a recovery. |
| Retention | Retention policy | Set per topic. Whole segments are deleted once all their messages have expired. |

[Concepts](https://iggy.apache.org/docs/introduction/concepts) explains each of these in more detail.

## What works differently

**Iggy has its own protocol.** A Kafka client can't talk to Iggy yet, so you use an [Iggy SDK](https://iggy.apache.org/docs/sdk/introduction), the HTTP API or the [binary protocol](https://iggy.apache.org/docs/binary-protocol). A Kafka protocol gateway is being built (see [issue #3421](https://github.com/apache/iggy/issues/3421)), but it can't serve consumers yet.

**There is an extra level above topics.** Every topic lives in a stream, so you create a stream before you create its topics.
