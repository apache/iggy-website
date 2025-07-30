---
title: Message state
slug: message-state
authors: ["Piotr Gankiewicz"]
tags: [new-features, message-state, message-checksum]
hide_table_of_contents: false
---

The message state is a simple field which extends the existing `message` and provides a way to define whether the particular message might be consumed by the client or not, depending on its value. Let's briefly discuss the motivation behind this feature, the implementation details and the breaking changes introduced by this release.

<!--truncate-->

## Breaking changes

Starting with the commit [#b07f23d](https://github.com/iggy-rs/iggy/commit/b07f23db798ffcda7c39650f34547f20137ff725) the breaking changes related to polling the messages by the client have been introduced. The `Message` struct used when invoking `PollMessage` command has been extended with new fields, which results in updated binary schema. The available [iggy crate](https://crates.io/crates/iggy) supports these changes since version 0.0.40.

## Introduction

The `state` is an additional field added to the `message` struct stored on the server-side, as well as polled by the client, which describes the current state of the message. By default, the message state is set to `available` (`code = 1``, see the possible codes below), meaning that the message is availabe to be consumed by the client.

However, the state might have a different value, for example `marked_for_deletion` (to be used by the upcoming retention policy feature), `poisoned` (to be used by the upcoming dead-letter queue feature) etc. In the future releases, the server will also provide a way to change the state of the message (for example to mark it as `poisoned` by the client), as well as filtering the messages by the state.

## Implementation

### Structures

The new `MessageState` is an enum which defines the possible states of the message. The `Message` struct has been extended with the `state` field, which is an instance of the `MessageState` enum. The `MessageState` enum also provides a method to convert the enum variant to the `u8` value, which is used by the binary schema.

Additionally, the `Message` struct has been extended with the `checksum` field, which is a `u32` value calculated (**CRC-32** algorithm) from the `payload` field. The checksum is used to verify the integrity of the message, and it's calculated on the server-side when the message is being stored. The client can use the checksum to verify the integrity of the message, and if the checksum doesn't match, the client can request the message again. This property has been there for a long time now, but it hasn't been used by the client so far.

The server and the client now **share the same `Message` struct**, meaning that the same type is being stored on the disk, as well as returned to the client when polling the messages. The motivation behind this approach, was not only to reduce the amount of code, but more importantly to make it easier to implement the extremely important feature being **zero-copy** (copy data from disk directly to the network buffer with bypassing the kernel space). This feature is planned to be implemented in the future.

```rust
pub struct Message {
    pub offset: u64,
    pub state: MessageState,
    pub timestamp: u64,
    pub id: u128,
    pub checksum: u32,
    pub headers: Option<HashMap<HeaderKey, HeaderValue>>,
    pub length: u32,
    pub payload: Bytes
}

pub enum MessageState {
    Available,
    Unavailable,
    Poisoned,
    MarkedForDeletion
}

impl MessageState {
    pub fn as_code(&self) -> u8 {
        match self {
            MessageState::Available => 1,
            MessageState::Unavailable => 10,
            MessageState::Poisoned => 20,
            MessageState::MarkedForDeletion => 30
        }
    }
}
```

### JSON transport

As usual, the JSON transport should be rather easy to implement, as it's just a matter of adding the `state` and `checksum` fields to the `message` object being returned when polling the messages. The `state` returns the underscored string value.

```json
  {
    "offset": 0,
    "state": "available",
    "timestamp": 1692643862990111,
    "id": 232071677777564499402827199894559175028,
    "checksum": 2144931076,
    "headers": null,
    "payload": "b3JkZXJzX2RhdGFfMg=="
  },
  {
    "offset": 1,
    "state": "available",
    "timestamp": 1692643862990112,
    "id": 44069423551493178892268378627901876657,
    "checksum": 148782482,
    "headers": {
      "key_3": {
        "kind": "uint64",
        "value": "QOIBAAAAAAA="
      },
      "key 1": {
        "kind": "string",
        "value": "dmFsdWUx"
      },
      "key-2": {
        "kind": "bool",
        "value": "AQ=="
      }
    },
    "payload": "b3JkZXJzX2RhdGFfMw=="
  }
```

### Binary transport

Next, let's take a look at the binary transport. The `Message` struct has been extended with the `state` and `checksum` fields, which results in the updated binary schema. Previously, the `message` struct was defined as follows:

```rust
pub struct Message {
    pub offset: u64,
    pub timestamp: u64,
    pub id: u128,
    pub headers: Option<HashMap<HeaderKey, HeaderValue>>,
    pub length: u32,
    pub payload: Bytes
}
```

And the serialization was:

```
Offset (8 bytes) + Timestamp (8 bytes) + ID (16 bytes) + Headers (N bytes) + Length (4 bytes) + Payload (`Length` bytes)
```

Now, the `message` looks like this:

```rust
pub struct Message {
    pub offset: u64,
    pub state: MessageState,
    pub timestamp: u64,
    pub id: u128,
    pub checksum: u32,
    pub headers: Option<HashMap<HeaderKey, HeaderValue>>,
    pub length: u32,
    pub payload: Bytes
}
```

And the serialization has changed to:

```
Offset (8 bytes) + State (1 byte) + Timestamp (8 bytes) + ID (16 bytes) + Checksum (4 bytes) + Headers (N bytes) + Length (4 bytes) + Payload (`Length` bytes)
```

And that's it - simply (de)serialize the `state` field right after the `offset` field, and the `checksum` field right after the `id` field.