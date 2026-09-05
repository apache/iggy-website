# Examples

> The Rust SDK examples in the core repository, and how to start a server to run them against.

Rendered page: https://iggy.apache.org/docs/sdk/rust/examples/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/rust/examples.mdx

In the core repository, you can find the following [examples](https://github.com/apache/iggy/tree/master/examples/rust/src) using the Rust SDK.

Before running any of them, start the server with the default root credentials. Without the flag (or `IGGY_ROOT_USERNAME`/`IGGY_ROOT_PASSWORD`) root gets a **generated password** and every example fails with `InvalidCredentials`:

```bash
cargo run --bin iggy-server -- --fresh --with-default-root-credentials
```

The examples are cargo example targets of the `iggy_examples` crate. Run them from the `examples/rust` directory with `cargo run --example <name>`. Partition IDs are **0-based**: the examples send to and poll from partition `0`.

- **[Getting started](https://github.com/apache/iggy/tree/master/examples/rust/src/getting-started)** - the basic example which is discussed in the [getting started](/docs/introduction/getting-started) guide.

  ```bash
  cargo run --example getting-started-producer
  cargo run --example getting-started-consumer
  ```

- **[Basic](https://github.com/apache/iggy/tree/master/examples/rust/src/basic)** - producer and consumer using the low-level `Client` trait with CLI args for transport selection (TCP/QUIC/HTTP/WebSocket).

  ```bash
  cargo run --example basic-producer
  cargo run --example basic-consumer
  ```

- **[New SDK](https://github.com/apache/iggy/tree/master/examples/rust/src/new-sdk)** - an introduction to the high-level SDK as discussed in the [dedicated guide](/docs/sdk/rust/high-level-sdk).

  ```bash
  cargo run --example new-sdk-producer
  cargo run --example new-sdk-consumer
  ```

- **[Stream builder](https://github.com/apache/iggy/tree/master/examples/rust/src/stream-builder)** - examples using the `IggyStream`, `IggyStreamProducer`, and `IggyStreamConsumer` builder APIs as discussed in the [stream builder guide](/docs/sdk/rust/stream-builder).

  ```bash
  cargo run --example stream-basic
  cargo run --example stream-producer
  cargo run --example stream-consumer
  cargo run --example stream-producer-config
  cargo run --example stream-consumer-config
  ```

- **[Message envelope](https://github.com/apache/iggy/tree/master/examples/rust/src/message-envelope)** - the example of how to send a message with a custom envelope e.g. to differentiate between different types of messages.

  ```bash
  cargo run --example message-envelope-producer
  cargo run --example message-envelope-consumer
  ```

- **[Message headers](https://github.com/apache/iggy/tree/master/examples/rust/src/message-headers)** - the example of how to send a message with custom headers (typed headers, message type discrimination, client-side compression).

  ```bash
  cargo run --example message-headers-type-producer
  cargo run --example message-headers-type-consumer
  cargo run --example message-headers-compression-producer
  cargo run --example message-headers-compression-consumer
  cargo run --example typed-headers-producer
  cargo run --example typed-headers-consumer
  ```

- **[Multi-tenant](https://github.com/apache/iggy/tree/master/examples/rust/src/multi-tenant)** - the larger example of how to structure your application to support multiple tenants (separated by the unique streams) with the different users, permissions, topics etc.

  ```bash
  cargo run --example multi-tenant-producer
  cargo run --example multi-tenant-consumer
  ```

- **[TCP TLS](https://github.com/apache/iggy/tree/master/examples/rust/src/tcp-tls)** - TLS-encrypted TCP connections with custom CA certificates.

  ```bash
  cargo run --example tcp-tls-producer
  cargo run --example tcp-tls-consumer
  ```

- **[Sink data producer](https://github.com/apache/iggy/tree/master/examples/rust/src/sink-data-producer)** - generating random JSON records in bulk batches for sink connector testing.

  ```bash
  cargo run --example sink-data-producer
  ```
