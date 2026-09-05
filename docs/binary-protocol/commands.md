# Commands

> The catalog of command codes, their operation bytes, and which commands are replicated.

Rendered page: https://iggy.apache.org/docs/binary-protocol/commands/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/binary-protocol/commands.mdx

## Catalog

The u32 command codes. Replicated commands are identified on the wire by their `operation` byte (see [Operation discriminants](/docs/binary-protocol/framing#operation-discriminants)). The code column below is the protocol-level registry and, for non-replicated commands, the value carried in header bytes 196..200.

```bash
# System
PING = 1                                  # non-replicated; works without login
GET_STATS = 10                            # non-replicated
GET_SNAPSHOT = 11                         # non-replicated
GET_CLUSTER_METADATA = 12                 # non-replicated
DESCRIBE_OPTIONS = 13                     # non-replicated
GET_ME = 20                               # non-replicated
GET_CLIENT = 21                           # non-replicated
GET_CLIENTS = 22                          # non-replicated

# Users
GET_USER = 31                             # non-replicated
GET_USERS = 32                            # non-replicated
CREATE_USER = 33                          # operation 141
DELETE_USER = 34                          # operation 143
UPDATE_USER = 35                          # operation 142
UPDATE_PERMISSIONS = 36                   # operation 145
CHANGE_PASSWORD = 37                      # operation 144
LOGIN_USER = 38                           # legacy; server rejects with MalformedLogin eviction
LOGOUT_USER = 39                          # operation 3 (Logout)
LOGIN_REGISTER = 40                       # operation 1 (Register)
LOGIN_REGISTER_WITH_PAT = 45              # operation 1 (Register)

# Personal access tokens
GET_PERSONAL_ACCESS_TOKENS = 41           # non-replicated
CREATE_PERSONAL_ACCESS_TOKEN = 42         # operation 146
DELETE_PERSONAL_ACCESS_TOKEN = 43         # operation 147
LOGIN_WITH_PERSONAL_ACCESS_TOKEN = 44     # legacy; server rejects with MalformedLogin eviction

# Messages
POLL_MESSAGES = 100                       # non-replicated
SEND_MESSAGES = 101                       # operation 160
FLUSH_UNSAVED_BUFFER = 102                # parses, but always fails with FeatureUnavailable

# Consumer offsets
GET_CONSUMER_OFFSET = 120                 # non-replicated
STORE_CONSUMER_OFFSET = 121               # operation 161
DELETE_CONSUMER_OFFSET = 122              # operation 162

# Streams
GET_STREAM = 200                          # non-replicated
GET_STREAMS = 201                         # non-replicated
CREATE_STREAM = 202                       # operation 128
DELETE_STREAM = 203                       # operation 130
UPDATE_STREAM = 204                       # operation 129
PURGE_STREAM = 205                        # operation 131

# Topics
GET_TOPIC = 300                           # non-replicated
GET_TOPICS = 301                          # non-replicated
CREATE_TOPIC = 302                        # operation 132
DELETE_TOPIC = 303                        # operation 134
UPDATE_TOPIC = 304                        # operation 133
PURGE_TOPIC = 305                         # operation 135

# Partitions
CREATE_PARTITIONS = 402                   # operation 136
DELETE_PARTITIONS = 403                   # operation 137

# Segments
DELETE_SEGMENTS = 503                     # operation 138

# Consumer groups
GET_CONSUMER_GROUP = 600                  # non-replicated
GET_CONSUMER_GROUPS = 601                 # non-replicated
CREATE_CONSUMER_GROUP = 602               # operation 139
DELETE_CONSUMER_GROUP = 603               # operation 140
JOIN_CONSUMER_GROUP = 604                 # operation 148
LEAVE_CONSUMER_GROUP = 605                # operation 149
SYNC_CONSUMER_GROUP = 606                 # non-replicated
```

`FLUSH_UNSAVED_BUFFER` still decodes on the wire, but the server has no on-demand flush primitive and answers every call with `FeatureUnavailable`. Per-topic durability is configured with the `enforce_fsync` [topic option](/docs/server/topic-options) instead.

## Payloads

Payloads below are the request **body** (the bytes after the 256-byte header). Types reference the [shared encodings](/docs/binary-protocol/encodings). Empty payload means the body has zero bytes.

### System

**Ping. Code: 1.** Empty payload. The only command accepted before login.

**Get stats. Code: 10.** Empty payload.

**Get snapshot. Code: 11.**

```text
[compression: u8][types_count: u8][snapshot_type: u8] x types_count
```

Compression codes: 1 = Stored, 2 = Deflated, 3 = Bzip2, 4 = Zstd, 5 = Lzma, 6 = Xz. Snapshot type codes: 1 = FilesystemOverview, 2 = ProcessList, 3 = ResourceUsage, 4 = Test, 5 = ServerLogs, 6 = ServerConfig, 100 = All.

**Get cluster metadata. Code: 12.** Empty payload.

**Describe options. Code: 13.**

```text
[scope: u8]
```

Scope: 1 = topic, 2 = stream, 3 = user. Returns the option catalog for the scope: keys, value kinds, defaults, and descriptions. See [Options block](/docs/binary-protocol/encodings#options-block).

**Get me. Code: 20.** Empty payload.

**Get client. Code: 21.**

```text
[client_id: u32]
```

**Get clients. Code: 22.** Empty payload.

### Streams

**Get stream. Code: 200.**

```text
[stream_id: Identifier]
```

**Get streams. Code: 201.** Empty payload.

**Create stream. Code: 202.**

```text
[name_len: u8][name: N][options block to end]
```

The stream option catalog is empty today, so the block is normally empty (zero bytes).

**Delete stream. Code: 203.**

```text
[stream_id: Identifier]
```

**Update stream. Code: 204.**

```text
[stream_id: Identifier][name_len: u8][name: N][options block to end]
```

Patch semantics: absent option keys are left unchanged.

**Purge stream. Code: 205.**

```text
[stream_id: Identifier]
```

### Topics

**Get topic. Code: 300.**

```text
[stream_id: Identifier][topic_id: Identifier]
```

**Get topics. Code: 301.**

```text
[stream_id: Identifier]
```

**Create topic. Code: 302.**

```text
[stream_id: Identifier][partitions_count: u32][name_len: u8][name: N][options block to end]
```

The fixed fields are the shape of the operation: which stream, how many partitions, what name. Every topic setting (`compression_algorithm`, `message_expiry`, `max_topic_size`, `segment_size`, `enforce_fsync`, `messages_required_to_save`, `size_of_messages_required_to_save`, `preallocate_segments`) rides the options block. See [Topic options](/docs/server/topic-options). `partitions_count` is an argument, not a setting: it is consumed at admission and never persisted as an option.

**Delete topic. Code: 303.**

```text
[stream_id: Identifier][topic_id: Identifier]
```

**Update topic. Code: 304.**

```text
[stream_id: Identifier][topic_id: Identifier][name_len: u8][name: N][options block to end]
```

Only `compression_algorithm`, `message_expiry`, and `max_topic_size` are updatable. Absent keys are left unchanged.

**Purge topic. Code: 305.**

```text
[stream_id: Identifier][topic_id: Identifier]
```

### Partitions

**Create partitions. Code: 402.**

```text
[stream_id: Identifier][topic_id: Identifier][partitions_count: u32]
```

**Delete partitions. Code: 403.**

```text
[stream_id: Identifier][topic_id: Identifier][partitions_count: u32]
```

### Segments

**Delete segments. Code: 503.**

```text
[stream_id: Identifier][topic_id: Identifier][partition_id: u32][segments_count: u32]
```

Deletes the `segments_count` oldest sealed segments of the partition.

### Messages

**Poll messages. Code: 100.**

```text
[consumer: Consumer][stream_id: Identifier][topic_id: Identifier]
[partition_flag: u8][partition_id: u32]
[strategy: 9 bytes][count: u32][auto_commit: u8]
```

`strategy` is a [polling strategy](/docs/binary-protocol/encodings#polling-strategy). `count` is the requested number of messages. `auto_commit = 1` stores the consumer offset server-side as part of the poll.

The response body:

```text
[partition_id: u32][current_offset: u64][messages_count: u32]
[batch records to end]
```

The 16-byte prefix is followed by a stream of [batch records](/docs/binary-protocol/messages) served as stored: each record's header carries the stamped `base_offset` and `base_timestamp`, and each frame's deltas resolve against them. A record may be a server-sliced view of a larger stored batch, so the first polled offset is `base_offset + offset_delta` of the first frame, not necessarily `base_offset` itself. `current_offset` is the partition's newest offset at poll time.

**Send messages. Code: 101.**

```text
[metadata_length: u32]
[stream_id: Identifier][topic_id: Identifier][partitioning: Partitioning]
[messages_count: u32]
[batch: 256-byte batch header + frames]
```

`metadata_length` counts the bytes from `stream_id` through `messages_count` inclusive, so a reader can skip straight to the batch. The producer leaves `partition_id`, `base_offset`, and `base_timestamp` zero in the [batch header](/docs/binary-protocol/messages), and the server stamps them. Every checksum is producer-computed and verified at admission. The reserved regions must be zero.

**Flush unsaved buffer. Code: 102.**

```text
[stream_id: Identifier][topic_id: Identifier][partition_id: u32][fsync: u8]
```

Parses, but the server always answers `FeatureUnavailable`: there is no on-demand flush primitive. Use the per-topic `enforce_fsync` option for durability guarantees.

### Consumer offsets

**Get consumer offset. Code: 120.**

```text
[consumer: Consumer][stream_id: Identifier][topic_id: Identifier]
[partition_flag: u8][partition_id: u32]
```

Response body (20 bytes):

```text
[partition_id: u32][current_offset: u64][stored_offset: u64]
```

**Store consumer offset. Code: 121.**

```text
[consumer: Consumer][stream_id: Identifier][topic_id: Identifier]
[partition_flag: u8][partition_id: u32][offset: u64][ack: u8]
```

**Delete consumer offset. Code: 122.**

```text
[consumer: Consumer][stream_id: Identifier][topic_id: Identifier]
[partition_flag: u8][partition_id: u32][ack: u8]
```

The trailing `ack` byte is mandatory on both write commands. A payload without it fails to decode. Ack levels:

| Value | Level | Meaning |
|-------|-------|---------|
| 0 | `NoAck` | Leader-local write; respond as soon as local state is updated (the fast path `PollMessages` auto-commit uses) |
| 1 | `Quorum` | Replicate through partition consensus; respond after a quorum commit (default for explicit writes) |

### Consumer groups

**Get consumer group. Code: 600.**

```text
[stream_id: Identifier][topic_id: Identifier][group_id: Identifier]
```

**Get consumer groups. Code: 601.**

```text
[stream_id: Identifier][topic_id: Identifier]
```

**Create consumer group. Code: 602.**

```text
[stream_id: Identifier][topic_id: Identifier][name_len: u8][name: N]
```

**Delete consumer group. Code: 603.**

```text
[stream_id: Identifier][topic_id: Identifier][group_id: Identifier]
```

**Join consumer group. Code: 604.**

```text
[stream_id: Identifier][topic_id: Identifier][group_id: Identifier]
```

**Leave consumer group. Code: 605.**

```text
[stream_id: Identifier][topic_id: Identifier][group_id: Identifier]
```

**Sync consumer group. Code: 606.**

```text
[stream_id: Identifier][topic_id: Identifier][group_id: Identifier]
```

Read-only: a member asks for its current partition assignment and the group generation, so it can select partitions to poll client-side.

### Users

**Get user. Code: 31.**

```text
[user_id: Identifier]
```

**Get users. Code: 32.** Empty payload.

**Create user. Code: 33.**

```text
[username_len: u8][username: N][password_len: u8][password: N][status: u8]
[has_permissions: u8][permissions_len: u32, only when has_permissions = 1][permissions: M bytes]
[options block to end]
```

`permissions_len` and the permissions bytes are present **only** when `has_permissions = 1`. When it is 0 the options block follows immediately. The user option catalog is empty today, so the block is normally empty. `status`: 1 = active, 2 = inactive.

**Delete user. Code: 34.**

```text
[user_id: Identifier]
```

**Update user. Code: 35.**

```text
[user_id: Identifier]
[has_username: u8][username_len: u8, only when 1][username: N, only when 1]
[has_status: u8][status: u8, only when 1]
[options block to end]
```

**Update permissions. Code: 36.**

```text
[user_id: Identifier][has_permissions: u8]
[permissions_len: u32, only when has_permissions = 1][permissions: M bytes, only when 1]
```

As in `CreateUser`, the length field is conditional: with `has_permissions = 0` the payload ends at the flag.

**Change password. Code: 37.**

```text
[user_id: Identifier]
[current_password_len: u8][current_password: N]
[new_password_len: u8][new_password: N]
```

### Authentication

Login and logout are part of the [connection lifecycle](/docs/binary-protocol/connection-lifecycle):

- **Login register. Code: 40.** `Operation::Register`. The body is `ClientVersionInfo` + credentials, described in [Login-register](/docs/binary-protocol/connection-lifecycle#login-register).
- **Login register with PAT. Code: 45.** `Operation::Register`. The body is `ClientVersionInfo` + token.
- **Logout user. Code: 39.** `Operation::Logout`. Empty payload.
- Codes **38** and **44** are the pre-register login shapes. The server rejects both with a `MalformedLogin` eviction.

### Personal access tokens

**Get personal access tokens. Code: 41.** Empty payload.

**Create personal access token. Code: 42.**

```text
[name_len: u8][name: N][expiry: u64]
```

`expiry` is a duration in **microseconds**. Two sentinel values exist: `0` (server default, which currently means no expiry) and `u64::MAX` (never expires).

**Delete personal access token. Code: 43.**

```text
[name_len: u8][name: N]
```
