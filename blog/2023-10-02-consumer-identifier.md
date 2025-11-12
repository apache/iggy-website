---
title: Consumer identifier
slug: consumer-identifier
authors: [piotr]
tags: [new-features, consumers, identifier]
hide_table_of_contents: false
---

In the latest update, the Iggy server as well as the clients for all the available transport protocols have been extended with the support for **consumer identifier**. Whether you poll the messages, store the consumer offsets, or create consumer groups, you can use the well-established `identifier` type, instead of just `u32`, which is now a common standard for the resources' identification such as streams, topics, users and consumers.

<!--truncate-->

## Breaking changes

The breaking changes have been introduced in Iggy server, starting from version `0.0.30` and Iggy SDK, starting from version `0.0.90`. The final commit containing all the mentioned changes is [#655f9b6](https://github.com/apache/iggy/commit/655f9b6bccb0ae4148422f32475a9bedc09827d2).

## Consumer identifier

```rust
pub struct Consumer {
    pub kind: ConsumerKind,
    pub id: Identifier,
}
```

All the commands, such as `PollMessages`, `StoreConsumerOffset` and `GetConsumerOffset` which contain the `consumer` field, now require an update to the underlying serialization, as the `id` field is now an `Identifier` type, instead of `u32`. The serialization is the same, as when working with the `stream`, `topic` or `user` resources.

From now on, whenever working with the `consumer` or `consumer group` resource, you can use the numeric or text identifier.

## Consumer groups

```rust
pub struct CreateConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32,
    pub name: String,
}
```

When creating the consumer group, the required `name` field has been added (must be **unique per topic**), and is serialized as usual, at the end of the payload, starting with the `name length` (4 bytes) and the `name` itself (N bytes).


```rust
pub struct DeleteConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: Identifier,
}

pub struct GetConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: Identifier,
}

pub struct JoinConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: Identifier,
}

pub struct LeaveConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: Identifier,
}
```

The `DeleteConsumerGroup`, `GetConsumerGroup`, `JoinConsumerGroup` and `LeaveConsumerGroup` commands have been extended with the `consumer_group_id` field, which is now an `Identifier` type, instead of `u32`.


```rust
pub struct ConsumerGroup {
    pub id: u32,
    pub name: String,
    pub partitions_count: u32,
    pub members_count: u32,
}

pub struct ConsumerGroupDetails {
    pub id: u32,
    pub name: String,
    pub partitions_count: u32,
    pub members_count: u32,
    pub members: Vec<ConsumerGroupMember>,
}
```

When fetching the consumer group(s), the `ConsumerGroup` and `ConsumerGroupDetails` structs have been extended with the `name` field, which serialized after `members_count`.
