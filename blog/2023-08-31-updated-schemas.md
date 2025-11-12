---
title: Updated schemas
slug: updated-schemas
authors: [piotr]
tags: [update, schema]
hide_table_of_contents: false
---

The latest update introduces the changes to the `PollMessages` and `GetConsumerOffset` commands response schema, as well as the `Stream`, `Topic` and `Partition` structs extended with `created_at` field.

<!--truncate-->

## Breaking changes

Breaking changes have been introduced with the commit [#670a8ba](https://github.com/apache/iggy/commit/670a8baba8617bb7e52bd51d556a621349e2e9f0). The available [iggy crate](https://crates.io/crates/iggy) supports these changes since version 0.0.60.

## PollMessages

By default, the `PollMessages` used to return `Vec<Message>` as a response, which has been changed to `PolledMessages` struct, that contains the `partition_id`, `current_offset` and `messages` field. The reason for this change was to provide more information about the current offset, and the partition from which the messages have been fetched - this might be especially useful when using the consumer groups feature, where the partition is calculated on the server-side.

```rust
pub struct PolledMessages {
    pub partition_id: u32,
    pub current_offset: u64,
    pub messages: Vec<Message>,
}
```

Serialization:

```
Partition ID (4 bytes) + Current offset (8 bytes) + Messages count (4 bytes) + Messages (N bytes)
```

## GetConsumerOffset

Previously, the `GetConsumerOffset` command used to return `u64` as a response, which has been changed to `ConsumerOffsetInfo` struct, that contains the `partition_id`, `current_offset` and `stored_offset` field. Similar to the `PollMessages` response update, the additional data might be helpful when using the consumer groups feature.

```rust
pub struct ConsumerOffsetInfo {
    pub partition_id: u32,
    pub current_offset: u64,
    pub stored_offset: u64,
}
```

Serialization:

```
Partition ID (4 bytes) + Current offset (8 bytes) + Stored offset (8 bytes)
```

## Stream, Topic, Partition

The `Stream`, `Topic` and `Partition` structs (along with the additional `Details` models when fetching the single object, not a list) have been extended with the `created_at` field, which contains the timestamp of the creation time (EPOCH in microseconds).

The `created_at` field which is `u64` (8 bytes) is always serialized right after the `id` field, and then the remaining fields follow.
