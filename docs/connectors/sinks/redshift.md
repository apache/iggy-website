# Redshift

> Send Iggy messages to Redshift with the connector runtime.

Rendered page: https://iggy.apache.org/docs/connectors/sinks/redshift/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sinks/redshift.mdx

Docs version: server 0.10.0, Rust SDK 0.12.0, CLI 0.15.0, Node.js SDK 0.11.0, Python, Java, Go and C# SDKs 0.10.0, Swift, C++ and PHP SDKs 0.2.0

The Redshift sink serializes batches to Parquet, stages them in S3 and loads an existing Redshift table with COPY. Configure both the Redshift connection and S3 access before starting the runtime.

## Configuration

Use the [sink runtime setup](https://iggy.apache.org/docs/connectors/sinks/sink) and build `iggy_connector_redshift_sink`. The plugin requires `connection_string`, `target_table`, `aws_iam_role`, `s3_bucket`, `s3_prefix` and `aws_region`. Supply S3 credentials through the supported credential configuration for your deployment.

| Setting | Default | Purpose |
| --- | --- | --- |
| `batch_size` | 100 | Messages buffered per Parquet file and COPY operation |
| `max_connections` | 5 | Redshift connection pool size |
| `include_metadata` | `true` | Include stream, topic, partition, offset, timestamp and schema |
| `include_checksum` | `false` | Include the Iggy checksum |
| `include_origin_timestamp` | `false` | Include producer time |
| `payload_format` | `varbyte` | Payload encoding in Parquet |
| `max_retries` | 3 | COPY retries after the first attempt |
| `retry_delay` | One second | Pause between attempts |
| `archive` | `false` | Retain successfully loaded staging files under the archive prefix |

`aws_access_key_id` and `aws_secret_access_key` supply explicit staging credentials. `s3_endpoint` supports an alternate S3 endpoint. The [complete example configuration](https://github.com/apache/iggy/blob/server-0.10.0/core/connectors/sinks/redshift_sink/config.toml) includes a local staging service setup. Replace its credentials and role before use.

## Payloads and delivery

`payload_format="json"` writes a string column, not a native Redshift SUPER value. Use Redshift JSON parsing when structured queries need that representation. `varbyte` preserves the serialized payload as bytes.

With `archive=false`, a successfully loaded staging file is deleted. With it enabled, the file is moved under the archive prefix. A staged file alone does not prove that COPY completed.

The runtime commits offsets on read. A COPY failure that outlasts plugin retries is logged and is not replayed by the runtime. A retry after an uncertain load can duplicate rows. See the [source reference](https://github.com/apache/iggy/blob/server-0.10.0/core/connectors/sinks/redshift_sink/README.md).
