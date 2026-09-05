# Elasticsearch Source

> Poll documents from an Elasticsearch index into Iggy streams, incrementally when a timestamp field is configured.

Rendered page: https://iggy.apache.org/docs/connectors/sources/elasticsearch/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sources/elasticsearch.mdx

The Elasticsearch source connector polls documents from an Elasticsearch index and produces them to Iggy streams. With a timestamp field configured, each poll only fetches documents newer than the last one seen, giving incremental, restart-safe ingestion.

## Configuration

```toml
type = "source"
key = "elasticsearch"
enabled = true
version = 0
name = "Elasticsearch source"
path = "target/release/libiggy_connector_elasticsearch_source"

[[streams]]
stream = "elasticsearch_stream"
topic = "documents"
schema = "json"
batch_length = 1000
linger_time = "5ms"

[plugin_config]
url = "http://localhost:9200"
index = "logs"
polling_interval = "30s"
batch_size = 100
timestamp_field = "@timestamp"
```

### Plugin config options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `url` | string | required | Elasticsearch cluster URL |
| `index` | string | required | Index to poll; must exist when the connector starts |
| `username` / `password` | string | none | Optional basic authentication credentials |
| `query` | table | `match_all` | Elasticsearch query DSL applied on each poll |
| `polling_interval` | string | `"10s"` | Delay before each poll cycle |
| `batch_size` | integer | `100` | Maximum documents fetched per poll |
| `timestamp_field` | string | none | Document field used for incremental polling |

A custom `query` must be a structured object. In TOML that means nested tables (an inline JSON string won't work):

```toml
[plugin_config.query.term.level]
value = "error"
```

Alternatively, set `plugin_config_format = "json"` and provide the plugin config as JSON, as the crate's own [config example](https://github.com/apache/iggy/tree/master/core/connectors/sources/elasticsearch_source) does.

## How Polling Works

Each cycle the connector waits `polling_interval`, then runs a search against `index` with the configured `query`, `size = batch_size`, sorted ascending by `timestamp_field` (`@timestamp` when unset). Every document's `_source` becomes one JSON message.

When `timestamp_field` is set, the query is also filtered to documents whose timestamp is greater than the newest one seen so far, so already-processed documents are not fetched again. Without a `timestamp_field` there is no incremental cursor and each poll returns the first `batch_size` matching documents.

## State

State is managed by the connectors runtime, not by the connector itself. Along with each batch of produced messages, the connector returns its progress (last poll timestamp plus document, poll, and error counters). The runtime persists it atomically to a per-connector file, `source_<key>.state`, under the `[state]` path from the runtime config (default `local_state`). On restart the runtime hands the saved state back to the connector, which resumes polling from the last processed timestamp.

State persistence requires no plugin configuration. To reset the connector's position, stop the runtime and delete the state file.
