---
title: Connectors runtime
authors: [piotr]
tags: []
hide_table_of_contents: false
date: 2025-06-06
---
## Extending Apache Iggy capabilities

In the world of message streaming, connectors quite often play a crucial role in facilitating data exchange between different systems. While Apache Iggy remains the core messaging infrastructure, **focusing on extreme efficiency** (high throughput, low latency, and minimal resource consumption), it could also benefit from a more extensible architecture. This is where connectors come into play.

<!--truncate-->

## What are the connectors

If you've ever used e.g. Apache Kafka or one of the Kafka-compatible solutions, such as Redpanda, you might've already encountered the concept of connectors. For example, there's a dedicated [Connect API](https://kafka.apache.org/documentation/#connectapi) allowing you to create the custom connectors (plugins) for various data sources.

Typically, connectors are designed to handle data ingestion and transformation tasks. They can be used to read data from external sources, transform it, and then write it to the message streaming system (**sources**), or the other way around (**sinks**) - fetch data from the message streaming system and write it to external services (e.g. databases, file systems, etc.).

Let's say that we would like to get the real-time changes from a database (Postgres CDC for example) and send them to Apache Iggy, while performing some optional data transformation, such as filtering or enriching the data. Or, we might want to fetch data from Apache Iggy (e.g. produced by our custom services), transform it, and then push it further to the external indexer such as Elastic or Quickwit.

**Instead of building all these pipelines from scratch as custom applications, we can leverage the power of connectors to simplify the process**. Simply download one of the existing plugins, configure it using the provided configuration files, and start using it - no need to write any code!

Here's an example of a configuration file for the sink connector named `stdout`:

```toml
# Required configuration for a sink connector
[sinks.stdout]
enabled = true
name = "Stdout sink"
path = "connectors/libiggy_connector_stdout_sink"

# Collection of the streams from which messages are consumed
[[sinks.stdout.streams]]
stream = "example_stream"
topics = ["example_topic"]
schema = "json"
batch_size = 1000
poll_interval = "5ms"
consumer_group = "stdout_sink_connector"

# Custom configuration for the sink connector, deserialized to type T from `config` field
[sinks.stdout.config]
print_payload = true

# Optional data transformation(s) to be applied after consuming messages from the stream
[sinks.stdout.transforms.add_fields]
enabled = true

# Collection of the fields transforms to be applied after consuming messages from the stream
[[sinks.stdout.transforms.add_fields.fields]]
key = "message"
value.static = "hello"
```

## Rust-based plugins

Since Apache Iggy is implemented in Rust, it was an easy choice to implement the connectors in Rust as well. **This allows us to take advantage of the Rust's powerful type system and memory safety features**, ensuring that the connectors are reliable and efficient. Internally, we use **[dlopen2](https://github.com/OpenByteDev/dlopen2)** library to load the plugins during the runtime initialization - feel free to check how **[Arroyo](https://www.arroyo.dev/blog/rust-plugin-systems/)** uses it too.

Thanks to this approach, just like Iggy itself, the connector runtime (which is a separate process), is very lightweight and easy to deploy. **The runtime uses just a few MBs of memory on its own, while consuming minimal CPU resources.** Behind the scenes, we use the shared **[Tokio runtime](https://tokio.rs)** to manage the asynchronous tasks and events across all connectors, as well as the **[tracing](https://docs.rs/tracing/latest/tracing/)** crate for logging and tracing purposes.

When running a simple benchmark based on the custom **[Quickwit sink](https://github.com/apache/iggy/tree/master/core/connectors/sinks/quickwit_sink)** connector, which pulls the data in real time from Iggy stream, does a basic data transformation (using the JSON payload format), and then pushes the data further to the Quickwit HTTP API, we observed that this plugin **can easily handle hundreds of thousands of messages per second, while using ~40MB of memory**. And keep in mind, that it's the very first (alpha) release of the connector runtime, so the performance will only improve over time.

Last, but not least, It's quite easy to create your own connectors - simply implement either `Sink` or `Source` trait, compile the library and configure it in the runtime. Please check the **[repository](https://github.com/apache/iggy/tree/master/core/connectors/)** or the **[documentation](/docs/connectors/introduction)** for more details.

```rust
#[async_trait]
pub trait Sink: Send + Sync {
    /// Invoked when the sink is initialized, allowing it to perform any necessary setup.
    async fn open(&mut self) -> Result<(), Error>;

    /// Invoked every time a batch of messages is received from the configured stream(s) and topic(s).
    async fn consume(
        &self,
        topic_metadata: &TopicMetadata,
        messages_metadata: MessagesMetadata,
        messages: Vec<ConsumedMessage>,
    ) -> Result<(), Error>;

    /// Invoked when the sink is closed, allowing it to perform any necessary cleanup.
    async fn close(&mut self) -> Result<(), Error>;
}
```

```rust
#[async_trait]
pub trait Source: Send + Sync {
    /// Invoked when the source is initialized, allowing it to perform any necessary setup.
    async fn open(&mut self) -> Result<(), Error>;

    /// Invoked every time a batch of messages is produced to the configured stream and topic.
    async fn poll(&self) -> Result<ProducedMessages, Error>;

    /// Invoked when the source is closed, allowing it to perform any necessary cleanup.
    async fn close(&mut self) -> Result<(), Error>;
}
```

## What's next?

Since it's the very early release to showcase what's possible with the connector runtime, we plan to focus on improving the performance and stability of the runtime itself.

Moreover, we plan to build more connectors, data transformations and schema encoders/decoders, to support the seamless transition between the different data formats and protocols.

It's also worth mentioning that the runtime uses one of the existing network protocols available via Rust SDK to connect to the Iggy server (so-called distributed mode). And while it might be the case for most of the deployments out there, we might also support e.g. UDS or some sort of IPC to allow the connectors deployment on the same machine, next to the streaming server.

Finally, we would love to hear your feedback and suggestions on how to improve the runtime and connectors. Please feel free to open an **[issue](https://github.com/apache/iggy/issues)**, **[pull request](https://github.com/apache/iggy/pulls)** or start a **[discussion](https://github.com/apache/iggy/discussions)**.

As always, you are more than welcome to join our **[Discord community](https://discord.gg/apache-iggy)**!
