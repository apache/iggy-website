# Stdout Sink

> Print messages from Iggy streams to standard output, for debugging and verifying a connector pipeline.

Rendered page: https://iggy.apache.org/docs/connectors/sinks/stdout/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sinks/stdout.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

The stdout sink connector prints messages from Iggy streams to the standard output. This is useful for debugging, development, and verifying that your connector pipeline is working correctly.

The connector emits info-level tracing events through the runtime to stdout. The runtime selects text or JSON with `logging.format` and filters events with `RUST_LOG` (default `INFO`). It logs batch metadata on every invocation; `print_payload` additionally logs each message's offset and decoded payload. The invocation counter is in memory and resets when the plugin is recreated.

## Configuration

Use the broker credentials and runtime setup from the [sink guide](https://iggy.apache.org/docs/connectors/sinks/sink#configuration). Save the configuration below in that runtime's connector directory. From the matching 0.9.0/edge repository root, build the plugin:

```bash
cargo build --release -p iggy_connector_stdout_sink
```

```toml
type = "sink"
key = "stdout-sink"
enabled = true
version = 1
name = "Stdout Sink"
path = "target/release/libiggy_connector_stdout_sink"
verbose = false

[[streams]]
stream = "my-stream"
topics = ["my-topic"]
schema = "json"
batch_length = 10
poll_interval = "1s"
consumer_group = "stdout-sink-group"

[plugin_config]
print_payload = true
```

## Plugin config options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `print_payload` | bool | `false` | Whether to print the message payload to stdout |

Create `my-stream` and `my-topic` before starting the runtime, or change the sample to use existing resources. The [Random source](https://iggy.apache.org/docs/connectors/sources/random) configuration produces JSON to the same destination.
