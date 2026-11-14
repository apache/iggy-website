# HTTP Source

> Receive webhooks through authenticated HTTP paths and forward their payloads to Iggy.

Rendered page: https://iggy.apache.org/docs/connectors/sources/http/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sources/http.mdx

Docs version: server 0.10.0, Rust SDK 0.12.0, CLI 0.15.0, Node.js SDK 0.11.0, Python, Java, Go and C# SDKs 0.10.0, Swift, C++ and PHP SDKs 0.2.0

The HTTP source accepts webhook POST bodies and produces raw messages to one configured stream and topic. Instances that use the same listener address share the listener. A separate admin address serves management, health details and metrics.

## Configuration

Build `iggy_connector_http_source` from the same release source as the runtime. Create the destination stream and topic. Add this connector file through the [local provider](https://iggy.apache.org/docs/connectors/runtime#local-file-provider):

```toml
type = "source"
key = "http_github"
enabled = true
version = 0
name = "HTTP source (GitHub)"
path = "target/release/libiggy_connector_http_source"

[[streams]]
stream = "webhooks"
topic = "github_events"
schema = "raw"
batch_length = 100
linger_time = "5ms"

[plugin_config]
listen_addr = "127.0.0.1:9090"
admin_listen_addr = "127.0.0.1:9091"
instance_name = "http_github"
topic_path = "github_events"
auth_bearer_token = "replace_with_secret_token"
management_token = "replace_with_admin_token"
max_body_size_bytes = 1048576
buffer_capacity = 10000
max_batch_size = 500
include_http_metadata = true
forward_headers = ["X-GitHub-Delivery", "X-Request-ID"]
```

Replace both sample tokens. Keep the admin listener off the public load balancer. Terminate TLS in front of the public listener. Instances that share a listener must use the same address. Topic paths and endpoint IDs must be unique across those instances.

## Routes and authentication

`POST /topics/{topic_path}` uses `auth_bearer_token`. If that field is omitted, the named path has no authentication. `POST /e/{endpoint_id}` uses a secret path with optional bearer or HMAC authentication. Generate secret endpoint IDs and keep their URLs private.

HMAC-SHA256 validation uses the raw body, not reserialized JSON. Per-endpoint secrets belong in TOML or the management API. Local environment overrides target top-level plugin fields and do not populate nested endpoint secrets.

Unknown plugin keys are ignored. Inspect the effective authentication posture in startup logs after changing configuration. The runtime control API exposes raw plugin configuration, so access to it also exposes configured secrets.

## Responses and health

| Status | Meaning |
| --- | --- |
| 200 | Body queued in memory, with `{"status":"queued"}` |
| 400 | Invalid or empty body |
| 401 | Authentication failed |
| 404 | Unknown, revoked or expired endpoint |
| 413 | Body exceeds the configured limit |
| 429 | Buffer full, with `Retry-After: 1` |
| 503 | Instance unavailable, closing, or named route changed during the request |

Public `GET /health` returns success only while every serving instance on the listener has a healthy poll path. A stalled path or a batch receiving negative acknowledgements for over 60 seconds makes it unavailable. An instance does not publish routes until its first poll starts.

## Delivery and retries

HTTP 200 confirms an in-memory enqueue. It does not confirm an Iggy write or durable storage. Process crashes and shutdown can lose accepted events. Sender retries and replayed batches can also create duplicates.

The source retains a negatively acknowledged batch and retries it with bounded backoff. There is no fixed NACK stop limit by default. Set `max_consecutive_nacks` only when accepted webhooks can be replayed externally after a restart. A stopped source can leave a buffer that no task drains.

Forward the provider's delivery ID and use it for application deduplication. An Iggy message ID stays stable for a batch replay, but a new HTTP request receives a new ID. The [source reference](https://github.com/apache/iggy/blob/server-0.10.0/core/connectors/sources/http_source/README.md) describes endpoint management, persistence and metrics.
