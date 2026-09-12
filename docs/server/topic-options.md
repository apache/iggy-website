# Topic Options

> Per-topic retention, durability and segment layout options, set when the topic is created.

Rendered page: https://iggy.apache.org/docs/server/topic-options/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/server/topic-options.mdx

Retention, durability, and segment layout are per-topic decisions, made when the topic is created. They used to be server-wide `[system.*]` keys, which gave every knob two homes. The server now [refuses to boot](/docs/server/configuration#relocated-configuration-keys) on the old keys, and each topic carries its own values instead.

Options are key-value pairs sent with `CreateTopic`. Unknown keys are **rejected at the edge, never skipped**: a silently ignored knob would leave the client on server defaults with no way to find out. The same mechanism exists for streams and users, but their catalogs are empty today. Only topics have option keys.

## The catalog

| Option | Default | Constraints | Description |
|--------|---------|-------------|-------------|
| `max_topic_size` | unlimited | | Delete the oldest sealed segments once the topic grows past this size. |
| `message_expiry` | none | | Delete sealed segments older than this. |
| `compression_algorithm` | `none` | `none` or `gzip` | Placeholder: stored and reported, no compression applied yet. |
| `segment_size` | 1 GiB | 512-byte multiple, at least 1 MiB, at most 1 GiB | Soft size limit per segment: a segment may close one whole batch past it. |
| `durability` | `replicated` | `replicated` or `persisted` | Message completion policy. `persisted` requires recoverable stable-storage copies at the replication quorum before success. |
| `consumer_offset_durability` | `replicated` | `replicated` or `persisted` | Completion policy for explicit consumer-offset stores and deletes, independent of message durability. |
| `messages_required_to_save` | 1024 | non-zero, at most 16777216 | Flush the journal once it holds this many messages. |
| `size_of_messages_required_to_save` | 1 MiB | at most 1 GiB | Flush the journal once it holds this many bytes. Paired with the message count; whichever threshold trips first flushes. |
| `preallocate_segments` | `false` | `segment_size` x partitions at most 64 GiB per create | Reserve each segment's bytes up front where the filesystem supports it. |

Both retention policies can be active at once. The active segment is **never touched**. Deletion is done by the server's segment cleaner (`[data_maintenance.messages]`, enabled by default).

Both durability policies write data to disk and default independently to `replicated`. Neither inherits the other. Flush thresholds schedule ordinary segment writes; required persistence, capacity pressure, or lifecycle operations can flush earlier. They do not weaken the `persisted` completion guarantee.

Value forms are forgiving: byte sizes accept a raw number of bytes or a string like `"128 MiB"`, expiry accepts microseconds or a humantime string like `"7 days"`, booleans accept `true`/`false`. Create admission re-parses and re-encodes what you send, so a string `segment_size=128MiB` is stored as the number it names.

`preallocate_segments` reserves exactly `segment_size` of real disk per partition the moment the topic is created (and again as segments rotate). With the default 1 GiB segment size that's 1 GiB per partition up front, which is why it's opt-in and why one create is **capped at 64 GiB** of total reservation.

## Setting options

At creation, every interface takes the same keys:

```bash
# CLI: --set is repeatable. Positional arguments: stream, name,
# partitions count, compression algorithm.
iggy topic create my-stream my-topic 1 none \
  --set segment_size=128MiB \
  --durability persisted \
  --consumer-offset-durability persisted
```

In the CLI, both durability policies have named flags. `--set` is repeatable and covers other storage options, such as `segment_size`. `compression_algorithm`, `message_expiry`, and `max_topic_size` also have first-class parameters. Run `iggy options topic` to discover what the server accepts.

SDKs expose typed durability values in their topic creation options. In Rust, set `TopicCreateOptions::durability` and `TopicCreateOptions::consumer_offset_durability` to `Durability::Replicated` or `Durability::Persisted`. The HTTP API takes `"durability"` and `"consumer_offset_durability"` as string values in the create body's `options` map.

Keys absent from the wire request are resolved by the admitting server and stored as **derived** entries. Typed SDKs can send their default durability values explicitly. `GetTopic` returns explicit and derived blocks, so the effective values and the provenance of the request remain visible.

## Create-only vs updatable

**Only three options** can change after creation, via `UpdateTopic`:

- `compression_algorithm`
- `message_expiry`
- `max_topic_size`

Updates are **patches**: a key you don't send keeps its current value.

The storage options (`segment_size`, `durability`, `consumer_offset_durability`, `messages_required_to_save`, `size_of_messages_required_to_save`, `preallocate_segments`) are **create-only**. A topic gets them at creation and keeps them. `UpdateTopic` rejects changes to either durability policy, so select both before creating the topic.

## Discovering the catalog

Ask the server which keys it accepts, with their types, defaults, and descriptions:

```bash
# CLI
iggy options topic

# HTTP
GET /options/topic
```

SDKs expose the same call as `describe_options`. The scope is `topic`, `stream`, or `user`.

Discovery matters most on the binary transports: TCP, QUIC, and WebSocket carry **only an error code** for a rejected key, not its name, so the catalog is how a client finds out what this server supports. Over HTTP the error message names the offending key directly.

## Durability

`replicated` waits for quorum commit and application without an additional stable-storage barrier. `persisted` also requires recoverable stable-storage copies at the required quorum. On a single node that means recoverable local persistence before success; in a cluster it uses durable prepare history. Setting `messages_required_to_save=1` is not required for `persisted`.

The former `enforce_fsync` option is rejected. Use `durability` for messages and `consumer_offset_durability` for explicit offset changes. Poll auto-commit remains asynchronous, and HTTP `ack=none` confirms dispatch only, regardless of these policies.

See [Durability](/docs/server/durability) for single-node failure behavior and [Cluster Durability](/docs/clustering/durability) for the quorum and WAL guarantees.
