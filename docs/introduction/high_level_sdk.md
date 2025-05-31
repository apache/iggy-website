---
id: introduction-high-level-sdk
slug: /introduction/high-level-sdk
title: High-level SDK
sidebar_position: 4
---

If you've read through the [getting started](/introduction/getting-started) guide, you might have noticed that it's quite verbose and requires a lot of boilerplate code to get started. This is where the High-level SDK comes in, as it does provide a more user-friendly interface to interact with the Iggy API for both, producer and consumer. Let's consider the following features:

- Automatically creating & joining the consumer groups
- Committing the offset depending on the particular mode (e.g. in the background based on some interval, after polling N messages etc.)
- Batching the messages, whether it's about producing or consuming
- Processing the messages as if the stream was an async iterator
- Reusing the same client for both, producing and consuming on the same topic without repeating the configuration
- And more...

## Connection string

Instead of providing the configuration for the client, you can use the connection string. It's a string that contains all the necessary information to connect to the Iggy API with only a single caveat, as it does support TCP protocol only for now. Here's the basic example:

```bash
iggy://iggy:secret@localhost:3050
```

Which can be used to create the client like this:

```rust
let client = IggyClient::from_connection_string("iggy://iggy:secret@localhost:3050")?;
```

And here's the full example with its all optional parts:

```bash
iggy://iggy:secret@localhost:3050?tls=true&tls_domain=test.com&reconnection_retries=5&reconnection_interval=5s&reestablish_after=10s&heartbeat_interval=3s
```

By default, the connection string is parsed with the following options:

- `tls` - whether to use the TLS connection or not (default: `false`)
- `tls_domain` - the domain to use for the TLS connection (default: `None`)
- `reconnection_retries` - the number of retries to establish the connection (default: `unlimited`)
- `reconnection_interval` - the interval between the reconnection attempts (default: `1s`)
- `reestablish_after` - the time to wait before reestablishing the connection (default: `5s`)
- `heartbeat_interval` - the interval between the heartbeat messages (default: `5s`)

Unless you need to provide a specific implementation of the client-side `Encryptor`, `Partitioner` or adjust some other settings, you should be good to go with the connection string. On the other hand, you can always make use of `IggyClientBuilder::from_connection_string()` to extend the options on top of the provided connection string.

Additionally, if you were to check the internal implementation of `IggyClient`, you'd notice that it does use `IggySharedMut<>` which means that you can use a single instance of the client across multiple threads. Typically, it's a good idea to create a separate connection for producing and consuming, but it's not a requirement.

## Producer

The producer is a high-level abstraction that allows you to send messages to the topic. It's quite simple to use and doesn't require you to handle the offsets, partitions or any other low-level details. To begin with, you can simply invoke `client.producer()` to get the `IggyProducerBuilder` allowing you to configure the producer. Let's take a look at the basic example:

```rust
let mut producer = client
    .producer("my-stream", "my-topic")?
    .batch_size(1000)
    .send_interval(IggyDuration::from_str("5ms")?)
    .partitioning(Partitioning::balanced())
    .build();
producer.init().await?;
```

The code above will result in creating the producer that will try to send the messages in batches of 1000 every 5 milliseconds. The partitioning is set to `balanced` which means that the producer will try to distribute the messages evenly across all the partitions. The `init()` method is used to ensure that the producer is ready to send the messages by validating the existence of the stream, topic etc.

Finally, you can use the `send()` method to send the messages to the topic. The producer doesn't need to be a mutable reference, as it's only required during the initialization phase. Here's how you can send the messages:

```rust
let messages = vec![Message::from_str("hello")?, Message::from_str("world")?];
producer.send(messages).await?
```

Of course, you can provide the message headers, custom binary serialization etc. as it's the same `Message` struct as the one used in the low-level API. The producer will take care of the rest, including the retries, partitioning, batching etc.

## Consumer

The consumer is a high-level abstraction that allows you to receive the messages from the topic. It's quite simple to use and doesn't require you to handle the offsets, partitions or any other low-level details. To begin with, you can simply invoke `client.consumer()` to get the `IggyConsumerBuilder` allowing you to configure the consumer. Let's take a look at the basic example:

```rust
let mut consumer = client
    .consumer_group("my-consumer-group", "my-stream", "my-topic")?
    .auto_commit(AutoCommit::IntervalOrWhen(
        IggyDuration::from_str("1s")?,
        AutoCommitWhen::ConsumingAllMessages,
    ))
    .create_consumer_group_if_not_exists()
    .auto_join_consumer_group()
    .polling_strategy(PollingStrategy::next())
    .poll_interval(IggyDuration::from_str("1ms")?)
    .batch_size(1000)
    .build();
```

The code above will result in creating the consumer that will try to consume the messages in batches of 1000 every 1 millisecond. The auto-commit is set to commit the offset every second or when all the messages are consumed (fetched). The polling strategy is set to `next` which means that the consumer will try to consume the next available message from the partition currently assigned to the consumer group (you can also invoke a regular `consumer()` builder if you do not plan to use the consumer groups). The `build()` method is used to create the consumer.

Finally, you can use the `next()` method to receive the messages from the topic. The consumer doesn't need to be a mutable reference, as it's only required during the initialization phase. Here's how you can consume the messages:

```rust
consumer.init().await?;

// Start consuming the messages
while let Some(message) = consumer.next().await {
    // Handle the message
}
```

In order to use the async iterator extension, add [futures-util](https://crates.io/crates/futures-util) dependency.
