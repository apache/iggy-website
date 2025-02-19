---
id: introduction-stream-builder
slug: /introduction/stream-builder
title: Stream Builder
sidebar_position: 5
---

In the previous section, the high level SDK introduced the connection string to simplify the client configuration and
indeed, it does provide a simple way to connect to the server. However, when you write an event based application,
you typically encounter one or more of the following scenarios:

1) The consumer and producer operate on the same stream and topic.
2) The consumer operates on different streams and topics.
3) The producers operate on different streams and topics.
4) Add consumers dynamically at runtime.
5) Add producers dynamically at runtime.

The stream builder provides a convenient way to create the iggy client, producer and consumer for these use cases.
All source code examples are located in the [**examples folder
**](https://github.com/iggy-rs/iggy/tree/master/examples/src/stream-builder) of the iggy repository. Also,
if you encounter a problem with any of the examples below, please ask in the [**community discord
**](https://iggy.rs/discord).

## IggyStream Builder

In the first case, the IggyStream Builder offers a fast and efficient way to get you started:

```rust
use iggy::client::{Client, StreamClient};
use iggy::consumer_ext::IggyConsumerMessageExt;
use iggy::error::IggyError;
use iggy::messages::send_messages::Message;
use iggy::stream_builder::{IggyStream, IggyStreamConfig};
use iggy_examples::shared::stream::PrintEventConsumer;
use std::str::FromStr;
use tokio::sync::oneshot;

const IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";

#[tokio::main]
async fn main() -> Result<(), IggyError> {
    let stream_config = IggyStreamConfig::default();
    let (client, producer, consumer) = 
    IggyStream::with_client_from_connection_string(IGGY_URL, &stream_config).await?;
    
    let (sender, receiver) = oneshot::channel();
    tokio::spawn(async move {
        match consumer.consume_messages(&PrintEventConsumer {}, receiver)
        .await {
            Ok(_) => {}
            Err(err) => eprintln!("Failed to consume messages: {err}"),
        }
    });

    producer.send_one(Message::from_str("Hello World")?).await?;
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

    sender.send(()).expect("Failed to send shutdown signal");
    client.delete_stream(stream_config.stream_id()).await?;
    client.shutdown().await?;

    Ok(())
}
```

As you can see, the `IggyStream` builder is used to create the iggy client, producer and consumer.
Here, we use the default configuration to get started quickly, but you can always customize the configuration to fit
your requirements.

The `consume_messages` method is not part of the IggyConsumer; instead, you import the IggyConsumerMessageExt
trait which provides the `consume_messages` method. The PrintEventConsumer implements the MessageConsumer trait
and is invoked to process each incoming message. A simple implementation is show below:

```rust
use iggy::clients::consumer::ReceivedMessage;
use iggy::consumer_ext::MessageConsumer;
use iggy::error::IggyError;

#[derive(Debug)]
pub struct PrintEventConsumer {}

impl MessageConsumer for PrintEventConsumer {
    async fn consume(&self, message: ReceivedMessage) -> Result<(), IggyError> {
        // Extract message payload as raw bytes
        let raw_message = message.message.payload.as_ref();
        let message = String::from_utf8_lossy(raw_message);
        println!("Message received: {}", message);

        Ok(())
    }
}
```

## IggyStreamProducer Builder

When you implement the producer side, you can use the `IggyStreamProducer` to get started:

```rust
use iggy::client::{Client, StreamClient};
use iggy::error::IggyError;
use iggy::messages::send_messages::Message;
use iggy::stream_builder::{IggyProducerConfig, IggyStreamProducer};
use std::str::FromStr;

const IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";

#[tokio::main]
async fn main() -> Result<(), IggyError> {
    let config = IggyProducerConfig::default();
    let (client, producer) = 
    IggyStreamProducer::with_client_from_url(IGGY_URL, &config).await?;

    producer.send_one(Message::from_str("Hola Iggy")?).await?;

    // Wait a bit for all messages to arrive.
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
    println!("Stop the message stream and shutdown iggy client");
    client.delete_stream(config.stream_id()).await?;
    client.shutdown().await?;
    Ok(())
}
```

If you already have a custom iggy client, you can use that one by replacing the `with_client_from_url`
constructor with the following:

```rust
    let producer = IggyStreamProducer::build(&client, &config).await?;
```

You find sample utils to build a customized iggy client in
the [**examples folder**](https://github.com/iggy-rs/iggy/blob/master/examples/src/shared/client.rs) of the iggy
repository.

### Producer configuration

The IggyProducerConfig gives you a way to configure the producer in sufficient detail. Please note, if you have
questions about any of those settings, please ask in the community discord. Also note, when your requirements exceed
this configuration, you can still use the [**underlying low level SDK
** ](https://github.com/iggy-rs/iggy/blob/master/examples/src/basic/producer/main.rs) for fine grained control over the
every
detail of the producer.

See below a commented configuration example:

```rust
use iggy::error::IggyError;
use iggy::identifier::Identifier;
use iggy::messages::send_messages::{Partitioning};
use iggy::stream_builder::{IggyProducerConfig};
use iggy::utils::duration::IggyDuration;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), IggyError> {
    let stream = "test_stream";
    let topic = "test_topic";

    // The builder simplifies the IggyProducer configuration.
    let config = IggyProducerConfig::builder()
        // Set the stream identifier and name.
        .stream_id(Identifier::from_str_value(stream)?)
        .stream_name(stream)
        // Set the topic identifier and name
        .topic_id(Identifier::from_str_value(topic)?)
        .topic_name(topic)
        // Sets the number of partitions to create for the topic.
        // The more clients are reading concurrently, 
        // the more partitions you should create.
        // i.e. if you have 10 clients, you should create 10 partitions
        .topic_partitions_count(10)
        // Optionally, you can set the replication factor for redundancy.
        // There is a tradeoff between replication factor and performance,
        // so you better benchmark your setup.
        .topic_replication_factor(2)
        // The max number of messages to send in a batch. 
        // The greater the batch size, the higher the bulk throughput.
        // Note, there is a tradeoff between batch size and latency, 
        // so you want to benchmark your setup.
        .batch_size(100)
        // Sets the interval between sending the messages.  
        // Affects latency so you want to benchmark.
        .send_interval(IggyDuration::from_str("5ms").unwrap())
        // `Partitioning` specifies to which partition the messages 
        // should be sent.
        // It has the following options:
        // - `Balanced` - round-robin dispatch.
        // - `PartitionId` - the partition ID is provided by the client.
        // - `MessagesKey` - the partition ID is calculated by the server 
        //    using the hash of the provided messages key.
        .partitioning(Partitioning::balanced())
        // Sets the retry policy (maximum number of retries and interval) 
        // in case of messages sending failure.
        // The error can be related either to disconnecting from the server 
        // or to the server rejecting the messages.
        // Default is 3 retries with 1 second interval between them.
        .send_retries_count(3)
        .send_retries_interval(IggyDuration::new_from_secs(1))
        // Optionally, set a custom client side encryptor for encrypting 
        // the messages' payloads. Currently only Aes256Gcm is supported.
        // Note, this is independent of server side encryption.
        // You can add client encryption, server encryption, or both.
        // .encryptor(Arc::new(EncryptorKind::Aes256Gcm(Aes256GcmEncryptor::new(&[1; 32])?)))
        .build();
    Ok(())
}
```

## IggyStreamConsumer Builder

When you have an existing server with multiple producers, you may have to implement a consumer for a specific stream or
topic. In some cases you may already have a configured iggy client, in others you may need to create
one. In either case, you can use the `IggyStreamConsumer` to create the consumer.

### Build consumer and client

```rust
use iggy::client::Client;
use iggy::consumer_ext::IggyConsumerMessageExt;
use iggy::error::IggyError;
use iggy::stream_builder::{IggyConsumerConfig, IggyStreamConsumer};
use iggy_examples::shared::stream::PrintEventConsumer;
use tokio::sync::oneshot;

const IGGY_URL: &str = "iggy://iggy:iggy@localhost:8090";

#[tokio::main]
async fn main() -> Result<(), IggyError> {
    let config = IggyConsumerConfig::default();
    let (client, consumer) = 
    IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;

    let (tx, rx) = oneshot::channel();
    tokio::spawn(async move {
        match consumer.consume_messages(&PrintEventConsumer {}, rx)
            .await{
            Ok(_) => {}
            Err(err) => eprintln!("Failed to consume messages: {err}"),
        }
    });

    // Wait a bit for all messages to arrive.
    tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
    println!("Stop the message stream and shutdown iggy client");
    tx.send(()).expect("Failed to send shutdown signal");
    client.shutdown().await?;
    Ok(())
}
```

Similar to the previous StreamBuilder, the IggyConsumerMessageExt is used to process messages using
the PrintEventConsumer implementation of the MessageConsumer trait.

### Build consumer from an existing client

In the event that you have an existing iggy client, you can use the `IggyStreamConsumer::build` method to create the
consumer. To do so, just replace the `with_client_from_url` with the following:

```rust
    let consumer= IggyStreamConsumer::build(&client, &config).await?;
```

Notice, you find some utils to build a customized iggy client in
the [**examples folder**](https://github.com/iggy-rs/iggy/blob/master/examples/src/shared/client.rs) of the iggy
repository.

### Consumer configuration

The default configuration only exists to get you started quickly i.e. to test out an idea, draft an proof of concept or
similar. In practice, you often want fine grained control over the configuration. The IggyConsumerConfig gives you a way
to configure the consumer in sufficient detail without distracting with low level details.
Please note, if you have questions about any of those settings, please ask in
the [community discord](https://iggy.rs/discord). See below a commented configuration example:

```rust
use iggy::clients::consumer::{AutoCommit, AutoCommitWhen};
use iggy::consumer::ConsumerKind;
use iggy::error::IggyError;
use iggy::identifier::Identifier;
use iggy::messages::poll_messages::PollingStrategy;
use iggy::stream_builder::{IggyConsumerConfig};
use iggy::utils::duration::IggyDuration;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), IggyError> {
  let stream = "test_stream";
  let topic = "test_topic";

  let config = IggyConsumerConfig::builder()
    // Set the stream identifier and name.
    .stream_id(Identifier::from_str_value(stream)?)
    .stream_name(stream)
    // Set the topic identifier and name
    .topic_id(Identifier::from_str_value(topic)?)
    .topic_name(topic)
    // The auto-commit configuration for storing the message offset.
    // See: https://github.com/iggy-rs/iggy/blob/master/sdk/src/clients/consumer.rs
    .auto_commit(AutoCommit::When(AutoCommitWhen::PollingMessages))
    // The max number of messages to send in a batch. 
    // The greater the batch size, the higher the bulk throughput.
    // Note, there is a tradeoff between batch size and latency, 
    // so you want to benchmark your configuration.
    // Note, this only applies to batch send messages. 
    // Single messages are sent immediately.
    .batch_size(100)
    // Create the stream if it doesn't exist.
    .create_stream_if_not_exists(true)
    // Create the topic if it doesn't exist.
    .create_topic_if_not_exists(true)
    // The name of the consumer. Must be unique.
    .consumer_name("test_consumer".to_string())
    // The type of consumer. It can be either `Consumer` or `ConsumerGroup`. 
    // ConsumerGroup is default.
    .consumer_kind(ConsumerKind::ConsumerGroup)
    // Sets the number of partitions for ConsumerKind `Consumer`. 
    // Does not apply to `ConsumerGroup`.
    .partitions_count(1)
    // The polling interval for messages.
    .polling_interval(IggyDuration::from_str("5ms").unwrap())
    // `PollingStrategy` specifies from where to start polling messages.
    // It has the following kinds:
    // - `Offset` - start polling from the specified offset.
    // - `Timestamp` - start polling from the specified timestamp.
    // - `First` - start polling from the first message in the partition. 
    // - `Last` - start polling from the last message in the partition. 
    // - `Next` - start polling from the next message after the 
    // last polled message based on the stored consumer offset.
    .polling_strategy(PollingStrategy::last())
    // Sets the polling retry interval in case of server disconnection.
    .polling_retry_interval(IggyDuration::new_from_secs(1))
    // Sets the number of retries and the interval when initializing 
    // the consumer if the stream or topic is not found.
    // Might be useful when the stream or topic is created dynamically 
    // by the producer.
    // The retry only occurs when configured and is disabled by default.
    // When you want to retry at most 5 times with an interval of 1 second,
    // you set `init_retries` to 5 and `init_interval` to 1 second.
    .init_retries(5)
    .init_interval(IggyDuration::new_from_secs(1))
    // Optionally, set a custom client side encryptor for encrypting 
    // the messages' payloads. Currently only Aes256Gcm is supported.
    // Key must be identical to the one used by the producer; 
    // thus ensure secure key exchange.
    // Note, this is independent of server side encryption.
    // you can add client encryption, server encryption, or both.
    // .encryptor(Arc::new(EncryptorKind::Aes256Gcm(Aes256GcmEncryptor::new(&[1; 32])?)))
    .build();

    Ok(())
}
```

## Add consumers dynamically at runtime.

When you create consumers on demand at application runtime, you have to
ensure that the stream and topic exist before creating the consumer and
you have to set the `init_retries` and `init_interval` in the stream builder
to ensure the consumer retries a few more times in case the topic and stream are not immediately available.

However, when you cannot guarantee that the stream or topic exist before the consumer starts,
you have to set `create_stream_if_not_exists` and `create_topic_if_not_exists` to `true` in the IggyConsumerConfig
to ensure the consumer creates them and starts correctly. Other than that, you just call the
`IggyStreamConsumer::build` method as before i.e.:

```rust
    let config = get_my_custom_iggy_consumer_config();
    let (client, consumer) = IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;
```

Where `get_my_custom_iggy_consumer_config` refers to a function that returns an `IggyConsumerConfig`
that specifies the stream and topic to consume as well the init retry or whether to create the stream and topic.

## Add producers dynamically at runtime.

Adding new producers to the iggy server at runtime is as simple as creating a new config and
calling the `IggyStreamProducer::build` method. Unlike the consumer, the producer always crates
missing streams or topics by default. The `IggyConsumerConfig` has a convenient builder to create
a new configuration from just the stream, topic, batch size and send interval. See the example below.

```rust 
    let config = IggyConsumerConfig::from_stream_topic(
            "new_stream",
            "new_topic",
            100,
            IggyDuration::from_str("5ms").unwrap(),
        ).unwrap();
        
    let (client, consumer) = IggyStreamConsumer::with_client_from_url(IGGY_URL, &config).await?;
```

If you encounter a problem with any of the examples show on this page,
please ask in the [**community discord**](https://iggy.rs/discord). 
