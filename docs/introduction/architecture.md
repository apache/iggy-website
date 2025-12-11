---
id: introduction-architecture
slug: /introduction/architecture
title: Architecture
sidebar_position: 2
---

Iggy is the persistent message streaming, which means, that the messages are being stored in a form of an append-only log. You can create multiple streams, consisting of topics, which might have one or more partitions assigned, e.g. to achieve the horizontal scalability between many independent consumers or higher system resiliency. You can think of Iggy as an alternative to Kafka or RabbitMQ streams.

Let's discuss in-depth what these concepts are all about and how they relate to each other.

![Architecture](/img/architecture.png)

## Message streaming

There's a high chance that you've already used messaging tools such as RabbitMQ or Kafka, just to name a few. While they might look similar at the first glance, and actually, you can achieve the similar results with all of them (e.g. publishing and consuming the events by the different applications built on top of microservices architecture), they are quite different in their core.

The main difference is that RabbitMQ (except the recently released Streams plugin) is the message broker, which means that it's responsible for delivering the messages to the consumers. It works in the FIFO (First In, First Out) manner and the messages are being kept in the queues. For example, if you have multiple, distinct consumers, then each one would create its own queue, the message would be replicated between each queue and each consumer would be responsible for reading the messages from its own queue. Once the message is processed, it's gone from the queue, so there's no built-in way to replay past the messages. The more consumers you have, the more queues you have to create, which might result in more resources being used. The typical message broker follows the so-called smart pipes and dumb endpoints pattern.

On the other hand, Kafka is a message streaming platform, meaning that it's not responsible for delivering the messages to the consumers, but rather it's storing them in a form of an append-only log. The consumers are responsible for reading the messages from the log and processing them. You might have multiple distinct consumers, and it doesn't affect the resource usage as there's only one log. The consumers can read the messages from the beginning, or from the specific offset, thus you can replay the messages. The typical message streaming platform follows the so-called dumb pipes and smart endpoints pattern.

There are advantages and disadvantages of both approaches, but the main difference is that the message broker is responsible for delivering the messages to the consumers, while the message streaming platform is not. The message broker is a more mature concept, but the message streaming platform is gaining more and more popularity, especially in the cloud-native world. And you can achieve much higher performance and throughput with the message streaming platform, since it acts as a simple database, being optimized for the append-only operations and can be queried in a very efficient way.

As you might've guessed by now, Iggy is the latter - the message streaming platform.

## Thread per core (shared nothing) + io_uring

Iggy utilizies `io_uring` as the main I/O interface, which allows it to achieve high performance and low latency. Each core (shard), runs it's own instance of the server, which means that there is (almost) no shared state between the cores. This allows Iggy to scale linearly with the number of cores, as there is no contention between the cores. This architecture been proven by systems such as `redpanda` or `scylladb`, which are known for their high performance and low latency. Each shard owns an subset of partitions (units of parallelism in message streaming systems), and is responsible for handling all the I/O operations for those partitions. The requests are routed between the shards using message passing, which allows to avoid the locking. The partitions are distributed between the shards using `Murmur3` hashing algorithm, with an correction for small number of partitions.

```rs
pub fn calculate_shard_assignment(ns: &IggyNamespace, upperbound: u32) -> u16 {
    let mut hasher = Murmur3Hasher::default();
    hasher.write_u64(ns.inner());
    let hash = hasher.finish32();
    // Murmur3 has problems with weak lower bits for small integer inputs, so we use bits from the middle.
    return ((hash >> 16) % upperbound) as u16;
}
```

`io_uring` is an ever-growing beast, to learn more about it please check the [documentation](https://kernel.dk/io_uring.pdf) or the excellent [presentation](https://www.youtube.com/watch?v=ToSRCSijRuE) by Jens Axboe, the original author of `io_uring`.

Check [benchmarking](../server/benchmarking.md) section to see some performance numbers.

## Append-only log

The append-only log is the core concept of Iggy. It's a simple data structure, which is optimized for the append-only operations. It's a sequence of records, that are being appended to the end of the log. The records are immutable, so that they can't be changed once they are written to the log. The records are being written in the order they are received, which results in the log being is ordered.

To navigate the log, you can use the offset, which is the position of the record in the log. The offset is a simple integer, that starts from 0 and is incremented by 1 for each record. When the client is reading the records from the log, it can specify the offset from which it wants to start reading the records. The client can also specify the maximum number of records it wants to read. The client can read the records from the beginning, or from the specific offset, which means that you can replay the messages.

```
+-------------------------------------------------------+
|                  Append-Only Log                      |
+-------------------------------------------------------+
| Message1  | Message2 | Message3 | Message4 | Message5 |
| --------  | -------- | -------- | -------- | -------- |
| Offset=0  | Offset=1 | Offset=2 | Offset=3 | Offset=4 |
+-------------------------------------------------------+
```

## Stream

While we could put an equal sign between the log and the stream, they are not the same, at least in a case of Iggy streaming server.
The stream is a logical concept, and you might think of it as a namespace. For example, you could have a single stream for the whole system, or multiple streams e.g. representing the different environments, such as `dev`, `staging` and `production`. The stream is identified by its unique ID. The stream can have one or more topics assigned, which results in the records being published to the specific topics that belong to the particular stream.

## Topic

The topic is also the logical concept, which is a part of the stream. The topic is identified by its unique ID. You could think of topic as an entity being responsible for storing the specific type of the records. For example, you could have a topic for the user events, and another topic for the order events, etc.

The important thing to note is that, the messages are not being stored in the topic directly, but rather in the partitions, which are assigned to the topic. The topic can have one or more partitions assigned, that could help achieve higher parallelism and throughput. The topic can also have the retention policy assigned, which means that the records are being deleted automatically once they are older than the specified retention period.

## Partition

The partition has its own unique ID and belongs to the topic. The partition is responsible for storing the records. The records are being distributed between the partitions, therefore the partition acts as a simple database, which is optimized for the append-only operations. The partition is identified by its unique ID, which is an integer. The partition ID starts from 1 and is incremented by 1 for each partition. The partition ID is unique per topic, thus the same partition ID can be used in multiple topics.

Thanks to having multiple partitions, we can achieve the horizontal scalability between many independent consumers, since each consumer can read the messages from the different partitions. This can be achieved by using more advanced concepts such as consumer groups.

## Segment

The segment, being a part of the partition, is the actual physical layer which stores the records in the binary format in a form of the files. Each segment has the limited size (e.g. 1 GB) and once it's full, the new segment is being created automatically. The segment name is based on the start offset of the first record in the segment and is unique per partition.

## Structure

Having in mind that stream consists of topics, which might have one or more partitions assigned, and each partition consists of segments, we can visualize the structure of the Iggy data directory as follows:

```
streams
└── 1
    └── topics
        └── 1
            ├── partitions
            │             └── 1
            │                 ├── 00000000000000000000.index
            │                 ├── 00000000000000000000.log
```

The additional `.index` file is being created automatically and are being used to speed up the search operations by keeping track of the offsets and timestamps of the records.
