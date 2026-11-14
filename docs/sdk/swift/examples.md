# Examples

> Run the Swift producer and consumer from the Apache Iggy source release.

Rendered page: https://iggy.apache.org/docs/sdk/swift/examples/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/swift/examples.mdx

Docs version: server 0.10.0, Rust SDK 0.12.0, CLI 0.15.0, Node.js SDK 0.11.0, Python, Java, Go and C# SDKs 0.10.0, Swift, C++ and PHP SDKs 0.2.0

The [Swift examples](https://github.com/apache/iggy/tree/server-0.10.0/examples/swift) use the SDK from the same checkout. Start the server from the repository root with development credentials and a separate data directory:

```bash
IGGY_PATH=local_data/swift-example cargo run --bin iggy-server -- --with-default-root-credentials
```

From `examples/swift`, run the producer and then the consumer:

```bash
swift run --package-path getting-started producer
swift run --package-path getting-started consumer
```

The producer creates `sample-stream` and `sample-topic` if needed and sends five batches of ten messages. The consumer reads from the first message, stores no offset and exits after five batches. Running it again replays retained messages.

Both programs accept `--tcp-server-address`, `--tls`, `--tls-ca-file` and `--tls-domain`. The [example README](https://github.com/apache/iggy/blob/server-0.10.0/examples/swift/README.md) provides the development TLS commands.
