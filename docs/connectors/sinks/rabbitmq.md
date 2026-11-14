# RabbitMQ

> Send Iggy messages to RabbitMQ with the connector runtime.

Rendered page: https://iggy.apache.org/docs/connectors/sinks/rabbitmq/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/connectors/sinks/rabbitmq.mdx

Docs version: server 0.10.0, Rust SDK 0.12.0, CLI 0.15.0, Node.js SDK 0.11.0, Python, Java, Go and C# SDKs 0.10.0, Swift, C++ and PHP SDKs 0.2.0

The RabbitMQ sink publishes messages to an AMQP 0.9.1 exchange. It declares the configured exchange, enables publisher confirmations and uses mandatory publishing. Configure a queue and binding that match the routing key before sending messages.

## Configuration

Use the [sink runtime setup](https://iggy.apache.org/docs/connectors/sinks/sink) and build `iggy_connector_rabbitmq_sink`. Its plugin configuration is:

```toml
[plugin_config]
amqp_url = "amqp://guest:guest@localhost:5672"
exchange = "iggy_events"
exchange_type = "topic"
routing_key = "iggy.messages"
durable_exchange = true
delivery_mode = "persistent"
include_metadata = true
verbose_logging = false
max_retries = 3
retry_delay_secs = 1
max_retry_delay_secs = 5
timeout_secs = 30
```

Use the guest credentials only with a local broker. Exchange type accepts `direct`, `topic`, `fanout` or `headers`. Exchange durability must match an existing exchange. Delivery mode accepts `persistent` or `non_persistent`. Durable delivery also depends on the broker and queue configuration.

## Headers and failure handling

User headers are preserved. With metadata enabled, the sink also adds `iggy_stream`, `iggy_topic`, `iggy_partition_id` and `iggy_offset`. String headers become AMQP LongString and raw headers become ByteArray.

The sink pipelines publishes and waits for confirmations. Transient failures retry from the first unconfirmed message. An in-flight tail can already be delivered, so retries can duplicate it. An unroutable mandatory publish fails the batch and forces a new connection before the next poll.

The runtime commits Iggy offsets on read and does not replay a failed callback after its retry budget. Publisher confirmations do not provide an end-to-end exactly-once guarantee. See the [source reference](https://github.com/apache/iggy/blob/server-0.10.0/core/connectors/sinks/rabbitmq_sink/README.md).
