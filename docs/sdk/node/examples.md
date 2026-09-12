# Examples

> TypeScript examples for the Node.js SDK, exercised by CI so they match the current SDK.

Rendered page: https://iggy.apache.org/docs/sdk/node/examples/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/node/examples.mdx

Working examples are available in the [examples/node](https://github.com/apache/iggy/tree/master/examples/node) directory, written in TypeScript. CI exercises them, so they always match the current SDK:

- **getting-started** - basic producer and consumer
- **basic** - producer and consumer with utilities
- **message-envelope** - JSON message envelope pattern
- **message-headers** - custom message headers
- **multi-tenant** - multi-tenant streaming setup
- **tcp-tls** - TLS-encrypted TCP connections
- **stream-builder** - end-to-end walkthrough: create a stream and topic, produce, and consume
- **sink-data-producer** - bulk data generation for sink connectors

## Running the examples

Start an Iggy server first:

```bash
# Latest release
docker run --rm \
  --cap-add=SYS_NICE --security-opt seccomp=unconfined --ulimit memlock=-1:-1 \
  -p 8090:8090 \
  -e IGGY_TCP_ADDRESS=0.0.0.0:8090 \
  -e IGGY_NODE_ADVERTISED_ADDRESS=localhost \
  -e IGGY_ROOT_USERNAME=iggy -e IGGY_ROOT_PASSWORD=iggy \
  apache/iggy:latest

# Or from the repository source
cargo run --bin iggy-server -- --fresh --with-default-root-credentials
```

The environment variables make the server reachable through the published port (it binds to `127.0.0.1` inside the container by default) and set the `iggy`/`iggy` root credentials the examples default to.

Then, from `examples/node`, install the dependencies and run a producer/consumer pair:

```bash
npm ci
npm run test:getting-started:producer
npm run test:getting-started:consumer
```

Each example set has a matching `test:<name>` script in `examples/node/package.json`.

For the quick-start code itself, see the [Node.js SDK intro](/docs/sdk/node/intro).
