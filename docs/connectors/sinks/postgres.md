# Postgres Sink

> Store messages from Iggy topics in a PostgreSQL table, with optional table creation and configurable payload storage.

Rendered page: https://iggy.apache.org/docs/connectors/sinks/postgres/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sinks/postgres.mdx

The PostgreSQL sink connector consumes messages from Iggy topics and stores them in a PostgreSQL table, with optional automatic table creation and configurable payload storage.

This page is a curated subset of the documentation. The canonical reference, including SQL query recipes for each payload format, is the upstream [postgres_sink README](https://github.com/apache/iggy/tree/master/core/connectors/sinks/postgres_sink) in the `apache/iggy` repository.

## Features

- **Automatic Table Creation**: Optionally create the target table on startup
- **Batch Processing**: Insert messages in configurable batches for performance
- **Metadata Storage**: Store Iggy message metadata (offset, timestamp, topic, etc.)
- **Configurable Payload Storage**: Store the payload as raw bytes, native JSONB, or text
- **Automatic Retries**: Transient database errors are retried with a configurable delay
- **Connection Pooling**: Efficient database connection management

## Configuration

```toml
type = "sink"
key = "postgres-sink"
enabled = true
version = 1
name = "Postgres Sink"
path = "/path/to/libiggy_connector_postgres_sink.so"

[[streams]]
stream = "user_events"
topics = ["events"]
schema = "json"
batch_length = 100
poll_interval = "5ms"
consumer_group = "postgres-sink"

[plugin_config]
connection_string = "postgresql://username:password@localhost:5432/database"
target_table = "iggy_messages"
auto_create_table = true
```

### Plugin config options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `connection_string` | string | required | PostgreSQL connection string |
| `target_table` | string | required | Table to insert messages into |
| `batch_size` | u32 | `100` | Messages per insert batch |
| `max_connections` | u32 | `10` | Max database connections |
| `auto_create_table` | bool | `false` | Create the target table if it doesn't exist |
| `include_metadata` | bool | `true` | Include Iggy metadata columns |
| `include_checksum` | bool | `true` | Include message checksum |
| `include_origin_timestamp` | bool | `true` | Include original message timestamp |
| `payload_format` | string | `"bytea"` | Payload column type: `bytea`, `json` (alias `jsonb`), or `text` |
| `verbose_logging` | bool | `false` | Log at info level instead of debug |
| `max_retries` | u32 | `3` | Max retry attempts for transient errors |
| `retry_delay` | string | `"1s"` | Base delay between retries (e.g. `500ms`, `2s`) |

## Payload Format

The `payload_format` option determines the type of the `payload` column and how the message payload is stored:

| Format | Column Type | Description |
| ------ | ----------- | ----------- |
| `bytea` | `BYTEA` | Raw bytes (default). Preserves exact binary content, works with any payload. |
| `json` / `jsonb` | `JSONB` | Native JSON. Enables JSON operators and GIN indexing. Payload must be valid JSON. |
| `text` | `TEXT` | UTF-8 text. Payload must be valid UTF-8. |

With the default `bytea` format, JSON payloads can still be queried by converting the bytes: `convert_from(payload, 'UTF8')::jsonb->>'user_id'`. With `json`, the native operators apply directly: `payload->>'user_id'`.

## Table Schema

When `auto_create_table` is enabled, the following table structure is created (the `payload` column type follows `payload_format`):

```sql
CREATE TABLE iggy_messages (
    id DECIMAL(39, 0) PRIMARY KEY,
    iggy_offset BIGINT,
    iggy_timestamp TIMESTAMP WITH TIME ZONE,
    iggy_stream TEXT,
    iggy_topic TEXT,
    iggy_partition_id INTEGER,
    iggy_checksum BIGINT,
    iggy_origin_timestamp TIMESTAMP WITH TIME ZONE,
    payload BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Querying the Data

```sql
-- Get all messages from a specific stream
SELECT * FROM iggy_messages WHERE iggy_stream = 'user_events';

-- Read a bytea payload as text (for text/JSON payloads)
SELECT id, iggy_offset, convert_from(payload, 'UTF8') as payload_text
FROM iggy_messages
WHERE iggy_stream = 'user_events';
```

For a JSONB query example, a TEXT search example, and recommended indexes, see the upstream [postgres_sink README](https://github.com/apache/iggy/tree/master/core/connectors/sinks/postgres_sink).

## Performance Considerations

- Use an appropriate `batch_size` for your workload (larger batches give better throughput)
- Create indexes on frequently queried columns (`iggy_stream`, `iggy_topic`, `created_at`)
- Monitor connection pool usage via `max_connections`
