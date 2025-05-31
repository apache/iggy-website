---
id: server-schema
slug: /server/schema
title: Schema
sidebar_position: 4
---

Since the Iggy server supports a variety of transport protocols, it is important to have a common schema for all of them, that will represent the data in a unified way. Commands (requests), responses, data models, status codes, must be the same for all transports.

Currently, there are 2 ways of data representation: JSON (text) and binary - any serialization format that you prefer such as bincode, SBE, flatbuffers, protobuf or even your custom one, as the server simply expects the raw bytes as the message payload.

The binary format is more compact and efficient, but it is not human-readable - it's being used by TCP and QUIC transports. The JSON format is used by HTTP transport - all the existing endpoints are available in the [server.http](https://github.com/apache/iggy/blob/master/core/server/server.http).

## Request schema

All the requests are represented as a binary message. The message consists of 3 parts: length, code and payload:

- length - 4-byte integer (u32) which represents the total length: code (4 bytes) + payload (N bytes)
- code - 4-byte integer (u32) which represents the request code
- payload - binary data of N bytes length

For example, if the payload is 100 bytes, the length will have a value of 104 (100 bytes for payload + 4 const bytes for the code). The message as whole will have 108 (4 + 4 + 100) bytes size.

```
+-----------------------------------------------------------+
|           |           |                                   |
|  LENGTH   |   CODE    |              PAYLOAD              |
|           |           |                                   |
+-----------------------------------------------------------+
|  4 bytes  |  4 bytes  |              N bytes              |
```

## Response schema

All the responses are represented as a binary message. The message consists of 3 parts: status, length and payload:

- status - 4-byte integer (u32) which represents the status code. The status code is 0 for success and any other value for an error.
- length - 4-byte integer (u32) which represents the total length: status (4 bytes) + payload (N bytes)
- payload - binary data of N bytes length

In case of errors, the length will be always equal to 0 and the payload will be empty.

When trying to fetch the resource which may not exist, such as a stream, topic, user etc., the response will have a status code 0 (OK), but the payload will be empty, as there's no data to return.

```
+-----------------------------------------------------------+
|           |           |                                   |
|  STATUS   |  LENGTH   |              PAYLOAD              |
|           |           |                                   |
+-----------------------------------------------------------+
|  4 bytes  |  4 bytes  |              N bytes              |
```


## Request codes

```bash
PING = 1;
GET_STATS = 10;
GET_SNAPSHOT_FILE = 11;
GET_ME = 20;
GET_CLIENT = 21;
GET_CLIENTS = 22;
GET_USER = 31;
GET_USERS = 32;
CREATE_USER = 33;
DELETE_USER = 34;
UPDATE_USER = 35;
UPDATE_PERMISSIONS = 36;
CHANGE_PASSWORD = 37;
LOGIN_USER = 38;
LOGOUT_USER = 39;
GET_PERSONAL_ACCESS_TOKENS = 41;
CREATE_PERSONAL_ACCESS_TOKEN = 42;
DELETE_PERSONAL_ACCESS_TOKEN = 43;
LOGIN_WITH_PERSONAL_ACCESS_TOKEN = 44;
POLL_MESSAGES = 100;
SEND_MESSAGES = 101;
FLUSH_UNSAVED_BUFFER = 102;
GET_CONSUMER_OFFSET = 120;
STORE_CONSUMER_OFFSET = 121;
GET_STREAM = 200;
GET_STREAMS = 201;
CREATE_STREAM = 202;
DELETE_STREAM = 203;
UPDATE_STREAM = 204;
PURGE_STREAM = 205;
GET_TOPIC = 300;
GET_TOPICS = 301;
CREATE_TOPIC = 302;
DELETE_TOPIC = 303;
UPDATE_TOPIC = 304;
PURGE_TOPIC = 305;
CREATE_PARTITIONS = 402;
DELETE_PARTITIONS = 403;
GET_CONSUMER_GROUP = 600;
GET_CONSUMER_GROUPS = 601;
CREATE_CONSUMER_GROUP = 602;
DELETE_CONSUMER_GROUP = 603;
JOIN_CONSUMER_GROUP = 604;
LEAVE_CONSUMER_GROUP = 605;
```

## Shared

---

### Consumer

```rust
pub struct Consumer {
    pub kind: ConsumerKind,
    pub id: u32,
}

pub enum ConsumerKind {
    Consumer,       // Value = 1 (default)
    ConsumerGroup   // Value = 2
}
```

The `Consumer` is a simple structs which represents the type of the consumer. It can be either a consumer or a consumer group. This type is used when interacting with the messages related commands  data such as `PollMessages`, `GetConsumerOffset` and `StoreConsumerOffset`.

**Serialization**

- `kind` - 1 byte
- `id` - 4 bytes

### Identifier

```rust
pub struct Identifier {
    pub kind: IdKind,
    pub length: u8,
    pub value: Vec<u8>
}

pub enum IdKind {
    Numeric,      // Value = 1 (default)
    String        // Value = 2
}
```

The `Identifier` is a struct which represents the identifier of the stream or topic. It consists of the `kind` (numeric or string), `length` (length of the identifier value) and `value` (actual value of the identifier). The `value` is a vector of bytes, which can be either a numeric value (e.g. 1 encoded as const 4 bytes for u32 type) or a string (e.g. "my-stream") with variable length of UTF-8 string, maximum 255 bytes (chars). The total length varies between 3 (string type with a single char) and 257 bytes (string type with 255 chars).

**Serialization**

- `kind` - 1 byte
- `length` - 1 byte
- `value` - N bytes

### PolledMessages

```rust
pub struct PolledMessages {
    pub partition_id: u32,
    pub current_offset: u64,
    pub messages: Vec<Message>,
}
```

The `PolledMessages` is a struct returned by the `PollMessages` command. It consists of the `partition_id`, `current_offset` and `messages` fields. The `messages` field is a vector of `Message` structs.


**Serialization**

- `partition_id` - 4 bytes
- `current_offset` - 8 bytes
- `messages_count` - 4 bytes (hidden field)
- `messages` - N bytes


### Message

```rust
pub struct Message {
    pub offset: u64,
    pub state: MessageState,
    pub timestamp: u64,
    pub id: u128,
    pub checksum: u32,
    pub headers: Option<HashMap<HeaderKey, HeaderValue>>,
    pub length: u32,
    pub payload: Bytes,
}
```

The `Message` consists of the `offset` (offset of the message in the partition), `state` (state of the message), `timestamp` (timestamp of the message), `id` (unique identifier of the message), `checksum` (checksum of the message), `headers` (optional headers of the message), `length` (length of the payload) and `payload` (actual payload of the message).

**Serialization**

- `offset` - 8 bytes
- `state` - 1 byte
- `timestamp` - 8 bytes
- `id` - 16 bytes
- `checksum` - 4 bytes
- `headers` - N bytes
- `length` - 4 bytes
- `payload` - N bytes


### ConsumerOffsetInfo

The `ConsumerOffsetInfo` is a struct returned by the `GetConsumerOffset` command. It consists of the `partition_id`, `current_offset` and `stored_offset` fields.

```rust
pub struct ConsumerOffsetInfo {
    pub partition_id: u32,
    pub current_offset: u64,
    pub stored_offset: u64,
}
```

**Serialization**

- `partition_id` - 4 bytes
- `current_offset` - 8 bytes
- `stored_offset` - 8 bytes


## Streams

---

### Get stream

```rust
pub struct GetStream {
    pub stream_id: Identifier
}
```

**Code: 200**

**Serialization**

- `stream_id` - 3-257 bytes

### Get streams

```rust
pub struct GetStreams {}
```

**Code: 201**

**Serialization**

- Empty bytes


### Create stream

```rust
pub struct CreateStream {
    pub stream_id: u32,
    pub name: String
}
```

**Code: 202**

**Serialization**

- `stream_id` - 3-257 bytes
- `name_length` - 1 byte (hidden field)
- `name` - 1-255 bytes


### Delete stream

```rust
pub struct DeleteStream {
    pub stream_id: Identifier
}
```

**Code: 203**

**Serialization**

- `stream_id` - 3-257 bytes

## Topics

---

### Get topic

```rust
pub struct GetTopic {
    pub stream_id: Identifier,
    pub topic_id: Identifier
}
```

**Code: 300**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes

### Get topics

```rust
pub struct GetTopics {
    pub stream_id: Identifier
}
```

**Code: 301**

**Serialization**

- `stream_id` - 3-257 bytes

### Create topic

```rust
pub struct CreateTopic {
    pub stream_id: Identifier,
    pub topic_id: u32,
    pub partitions_count: u32,
    pub message_expiry: Option<u32>,
    pub name: String,
}
```

**Code: 302**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partitions_count` - 4 bytes
- `name_length` - 1 byte (hidden field)
- `name` - 1-255 bytes

### Delete topic

```rust
pub struct DeleteTopic {
    pub stream_id: Identifier,
    pub topic_id: Identifier
}
```

**Code: 303**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes

## Partitions

---

### Create partitions

```rust
pub struct CreatePartitions {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partitions_count: u32
}
```

**Code: 402**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partitions_count` - 4 bytes

### Delete partitions

```rust
pub struct DeletePartitions {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partitions_count: u32
}
```

**Code: 403**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partitions_count` - 4 bytes

## Messages

---

### Poll messages

```rust
pub struct PollMessages {
    pub consumer: Consumer,
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partition_id: u32,
    pub strategy: PollingStrategy,
    pub count: u32,
    pub auto_commit: bool,
}

pub struct PollingStrategy {
    pub kind: PollingKind,
    pub value: u64,
}

pub enum PollingKind {
    Offset,     // Value = 1 (default)
    Timestamp,  // Value = 2
    First,      // Value = 3
    Last,       // Value = 4
    Next,       // Value = 5
}
```

**Code: 100**

**Serialization**

- `consumer` - 5 bytes
- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partition_id` - 4 bytes
- `strategy` - 9 bytes
- `count` - 4 bytes
- `auto_commit` - 1 byte

### Send messages

```rust
pub struct SendMessages {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partitioning: Partitioning,
    pub messages: Vec<Message>
}

pub struct Partitioning {
    pub kind: PartitioningKind,
    pub length: u8,
    pub value: Vec<u8>
}

pub enum PartitioningKind {
    Balanced,     // Value = 1 (default)
    PartitionId,  // Value = 2
    MessagesKey   // Value = 3
}

pub struct Message {
    pub id: u128,
    pub length: u32,
    pub payload: Bytes // Memory-optimized vector of bytes
    pub headers: Option<HashMap<HeaderKey, HeaderValue>> // Optional headers, see the changelog for more details
}

pub struct HeaderKey(String);

pub struct HeaderValue {
    pub kind: HeaderKind,
    pub value: Vec<u8>
}

pub enum HeaderKind {
    Raw,
    String,
    Bool,
    Int8,
    Int16,
    Int32,
    Int64,
    Int128,
    Uint8,
    Uint16,
    Uint32,
    Uint64,
    Uint128,
    Float32,
    Float64
}
```

**Code: 101**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partitioning` - 3-257 bytes
- `messages` - 16 + 4 + N bytes per single message

## Consumer offsets

---

### Get consumer offset

```rust
pub struct GetConsumerOffset {
    pub consumer: Consumer,
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partition_id: u32
}
```

**Code: 120**

**Serialization**

- `consumer` - 5 bytes
- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partition_id` - 4 bytes

### Store consumer offset

```rust
pub struct StoreConsumerOffset {
    pub consumer: Consumer,
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub partition_id: u32,
    pub offset: u64
}
```

**Code: 121**

**Serialization**

- `consumer` - 5 bytes
- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `partition_id` - 4 bytes
- `offset` - 8 bytes

## Consumer groups

---

### Get consumer group

```rust
pub struct GetConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32
}
```

**Code: 600**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `consumer_group_id` - 4 bytes

### Get consumer groups

```rust
pub struct GetConsumerGroups {
    pub stream_id: Identifier,
    pub topic_id: Identifier
}
```

**Code: 601**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes

### Create consumer group

```rust
pub struct CreateConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32
}
```

**Code: 602**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `consumer_group_id` - 4 bytes

### Delete consumer group

```rust
pub struct DeleteConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32
}
```

**Code: 603**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `consumer_group_id` - 4 bytes

### Join consumer group

```rust
pub struct JoinConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32
}
```

**Code: 604**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `consumer_group_id` - 4 bytes

### Leave consumer group

```rust
pub struct LeaveConsumerGroup {
    pub stream_id: Identifier,
    pub topic_id: Identifier,
    pub consumer_group_id: u32
}
```

**Code: 605**

**Serialization**

- `stream_id` - 3-257 bytes
- `topic_id` - 3-257 bytes
- `consumer_group_id` - 4 bytes

## System

---

### Get me

```rust
pub struct GetMe {}
```

**Code: 20**

**Serialization**

- Empty bytes

### Get client

```rust
pub struct GetClient {
    pub client_id: u32
}
```

**Code: 21**

**Serialization**

- `client_id` - 4 bytes


### Get clients

```rust
pub struct GetClients {}
```

**Code: 22**

**Serialization**

- Empty bytes

### Get stats

```rust
pub struct GetStats {}
```

**Code: 10**

**Serialization**

- Empty bytes
