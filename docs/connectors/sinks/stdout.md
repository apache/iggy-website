# Stdout Sink

> Print messages from Iggy streams to standard output, for debugging and verifying a connector pipeline.

Rendered page: https://iggy.apache.org/docs/connectors/sinks/stdout/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sinks/stdout.mdx

The stdout sink connector prints messages from Iggy streams to the standard output. This is useful for debugging, development, and verifying that your connector pipeline is working correctly.

## Configuration

```toml
type = "sink"
key = "stdout-sink"
enabled = true
version = 1
name = "Stdout Sink"
path = "/path/to/libiggy_connector_stdout_sink.so"
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
