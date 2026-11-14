# MQTT

> Read MQTT subscriptions and acknowledge broker messages after Iggy accepts their batch.

Rendered page: https://iggy.apache.org/docs/connectors/sources/mqtt/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sources/mqtt.mdx

Docs version: server 0.10.0, Rust SDK 0.12.0, CLI 0.15.0, Node.js SDK 0.11.0, Python, Java, Go and C# SDKs 0.10.0, Swift, C++ and PHP SDKs 0.2.0

The MQTT source subscribes to an MQTT broker and sends payloads to one Iggy stream and topic. It supports MQTT 3.1.1 and MQTT 5, TLS, optional client certificates and per-filter QoS. MQTT 5 is the default.

## Configuration

Build `iggy_connector_mqtt_source` from the same release source as the runtime. Create the destination stream and topic before starting the connector. Add this file to the [local provider](https://iggy.apache.org/docs/connectors/runtime#local-file-provider):

```toml
type = "source"
key = "mqtt"
enabled = true
version = 1
name = "MQTT source"
path = "target/release/libiggy_connector_mqtt_source"
plugin_config_format = "json"

[[streams]]
stream = "iot"
topic = "telemetry"
schema = "raw"
batch_length = 100
linger_time = "5ms"

[plugin_config]
broker_url = "mqtt://127.0.0.1:1883"
subscriptions = ["devices/+/telemetry"]
protocol = "mqtt5"
include_metadata = false
qos = 2
client_id = "iggy-mqtt-source-debug"
clean_start = false
session_expiry_interval = 3600
keep_alive = "30s"
poll_timeout = "1s"
request_capacity = 32
batch_size = 100
batch_timeout = "10ms"
max_retries = 5
verbose_logging = false
```

`broker_url` and a nonempty `subscriptions` list are required. Broker URLs accept `mqtt://`, `mqtts://` or `ssl://`. Supply `username` and `password` together when the broker requires credentials. `subscription_qos` can override the default QoS for a filter already listed in `subscriptions`. Each value must be zero, one or two.

Use a stable `client_id`, `clean_start=false` and a nonzero MQTT 5 session expiry to resume broker sessions. With `include_metadata=true`, the source places MQTT 5 properties in a JSON envelope. Without it, payloads remain raw bytes.

## TLS

`plugin_config.tls.ca_file` selects a CA bundle. `client_cert_file` and `client_key_file` must be supplied together for mutual TLS. Certificate hostname validation uses the host in `broker_url`. A separate server-name override is not available.

## Batching

`batch_size` defaults to 100 and `batch_timeout` to 10 milliseconds after the first message. `poll_timeout` defaults to one second. `request_capacity` defaults to 32. The source keeps one batch in flight until the runtime reports its result.

These plugin limits are separate from the runtime producer's `batch_length` and `linger_time`. Configure only one destination `[[streams]]` entry per source instance. There is no per-message destination routing.

## Delivery behavior

For QoS 1 and QoS 2, the source defers broker acknowledgements until Iggy accepts the batch. An Iggy failure causes a negative batch result, and the plugin retains the batch for replay. A crash after Iggy accepts it but before the broker receives the acknowledgement can produce duplicates.

`max_retries` defaults to five retries after the first broker acknowledgement attempt. If these attempts fail, the source abandons that acknowledgement and continues. Broker redelivery can then duplicate the message. QoS 0 has no acknowledgement token and cannot use this recovery mechanism.

The source returns no durable connector checkpoint. Recovery after restart depends on the broker retaining the MQTT session. MQTT packet IDs are temporary and cannot serve as durable deduplication keys. The source does not provide an end-to-end exactly-once guarantee, including when MQTT uses QoS 2.

Select the destination topic's [durability](https://iggy.apache.org/docs/server/durability) before creation. An Iggy acknowledgement under `replicated` does not imply stable-storage persistence. The [MQTT source reference](https://github.com/apache/iggy/blob/server-0.10.0/core/connectors/sources/mqtt_source/README.md) includes broker setup and recovery examples.
