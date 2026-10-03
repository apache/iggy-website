# Quickstart

> Run the Iggy server and send and receive your first message with the Rust SDK, in one file.

Rendered page: https://iggy.apache.org/docs/introduction/quickstart/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/introduction/quickstart.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

This page gets a server running and a message sent and received, in one file. To build separate producer and consumer applications step by step, see [Getting started](https://iggy.apache.org/docs/introduction/getting-started). For other languages, see the [SDK section](https://iggy.apache.org/docs/sdk/introduction).

On Linux the server needs kernel 5.19 or newer. macOS has no kernel requirement. See [System requirements](https://iggy.apache.org/docs/server/introduction#system-requirements).

## Start the server

```bash
docker run --rm \
  --cap-add=SYS_NICE --security-opt seccomp=unconfined --ulimit memlock=-1:-1 \
  -p 8090:8090 \
  -e IGGY_TCP_ADDRESS=0.0.0.0:8090 \
  -e IGGY_NODE_ADVERTISED_ADDRESS=localhost \
  -e IGGY_ROOT_USERNAME=iggy -e IGGY_ROOT_PASSWORD=iggy \
  apache/iggy:0.9.0
```

See [Docker & Helm](https://iggy.apache.org/docs/server/docker) for what each option does.

## Send and receive a message

Create a project and add the SDK and the async runtime:

```bash
cargo new iggy-quickstart
cd iggy-quickstart
cargo add iggy
cargo add tokio --features macros,rt-multi-thread
```

Replace `src/main.rs` with:

```rust
use iggy::prelude::*;
use std::str::FromStr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = IggyClient::from_connection_string("iggy://iggy:iggy@127.0.0.1:8090")?;
    client.connect().await?;

    // Re-running this example is fine: an existing stream or topic is not an error.
    match client.create_stream("my-stream").await {
        Ok(_) | Err(IggyError::StreamNameAlreadyExists(_)) => {}
        Err(e) => return Err(e.into()),
    }
    // Every topic knob rides `TopicCreateOptions`; fields left as `None`
    // resolve against the server's defaults at admission.
    match client
        .create_topic(
            &"my-stream".try_into()?,
            "my-topic",
            &TopicCreateOptions {
                partitions_count: Some(1),
                message_expiry: Some(IggyExpiry::NeverExpire),
                ..TopicCreateOptions::default()
            },
        )
        .await
    {
        Ok(_) | Err(IggyError::TopicNameAlreadyExists(_, _)) => {}
        Err(e) => return Err(e.into()),
    }

    let msg = IggyMessage::from_str("hello world")?;
    client
        .send_messages(
            &"my-stream".try_into()?,
            &"my-topic".try_into()?,
            &Partitioning::partition_id(0),
            &mut [msg],
        )
        .await?;
    println!("Message sent");

    let polled = client
        .poll_messages(
            &"my-stream".try_into()?,
            &"my-topic".try_into()?,
            Some(0),
            &Consumer::default(),
            &PollingStrategy::next(),
            10,
            true,
        )
        .await?;

    for message in &polled.messages {
        let payload = std::str::from_utf8(&message.payload)?;
        println!("Offset: {}, Payload: {}", message.header.offset, payload);
    }

    Ok(())
}
```

Run it with `cargo run`. Partition IDs are **0-based**, so the first partition of a topic is partition `0`.

## Next steps

- Build a producer and a consumer as two applications: [Getting started](https://iggy.apache.org/docs/introduction/getting-started).
- Use the producer and consumer builders with batching and offset management: [High-level SDK](https://iggy.apache.org/docs/sdk/rust/high-level-sdk).
- Use another language: [SDK section](https://iggy.apache.org/docs/sdk/introduction).
