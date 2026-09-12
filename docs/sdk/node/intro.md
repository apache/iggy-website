# Node.js SDK

> The Node.js and TypeScript SDK, from installation to keeping client and server versions in step.

Rendered page: https://iggy.apache.org/docs/sdk/node/intro/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/node/intro.mdx

The Iggy Node.js SDK is a client library that allows you to interact with the Iggy API from your Node.js and TypeScript applications. It communicates with the Iggy server over TCP or TLS using the binary protocol. The package is available on [npm](https://www.npmjs.com/package/apache-iggy) and the source code can be found on [GitHub](https://github.com/apache/iggy/tree/master/foreign/node).

The SDK speaks only the current (VSR) wire protocol and doesn't fall back to older formats. Keep the client and server versions in step: pair the newest package with the newest server.

## Installation

```bash
npm install apache-iggy
```

## Quick start

The samples below expect an Iggy server on `127.0.0.1:8090`:

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

The environment variables make the server reachable through the published port (it binds to `127.0.0.1` inside the container by default) and set the root credentials the samples log in with. Without `--with-default-root-credentials` (or the `IGGY_ROOT_USERNAME` / `IGGY_ROOT_PASSWORD` variables), a first boot generates a random root password instead of `iggy`/`iggy`.

### Producer

```typescript
import { Client, Partitioning } from 'apache-iggy';

const STREAM_NAME = 'sample-stream';
const TOPIC_NAME = 'sample-topic';

const client = new Client({
  transport: 'TCP',
  options: { port: 8090, host: '127.0.0.1' },
  credentials: { username: 'iggy', password: 'iggy' },
});

// Re-running this example is fine: only create what is missing.
const streams = await client.stream.list();
const stream =
  streams.find((s) => s.name === STREAM_NAME) ??
  (await client.stream.create({ name: STREAM_NAME }));

const topics = await client.topic.list({ streamId: stream.id });
const topic =
  topics.find((t) => t.name === TOPIC_NAME) ??
  (await client.topic.create({
    streamId: stream.id,
    name: TOPIC_NAME,
    partitionCount: 1,
    compressionAlgorithm: 1, // 1 = None, 2 = Gzip
  }));

const messages = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  headers: [],
  payload: `message-${i + 1}`,
}));

await client.message.send({
  streamId: stream.id,
  topicId: topic.id,
  messages,
  partition: Partitioning.Balanced,
});

console.log(`Sent ${messages.length} message(s)`);

await client.destroy();
```

The Node SDK sends the partitioning choice on the wire, and the server resolves balanced and key routing at admission (the Rust, C#, Java, and Go clients instead resolve them client-side).

### Consumer

```typescript
import { Client, PollingStrategy, Consumer } from 'apache-iggy';

const STREAM_NAME = 'sample-stream';
const TOPIC_NAME = 'sample-topic';
const PARTITION_ID = 0;

const client = new Client({
  transport: 'TCP',
  options: { port: 8090, host: '127.0.0.1' },
  credentials: { username: 'iggy', password: 'iggy' },
});

// Next with autocommit continues from this consumer's last committed offset,
// so each run picks up where the previous one finished.
const polledMessages = await client.message.poll({
  streamId: STREAM_NAME,
  topicId: TOPIC_NAME,
  consumer: Consumer.Single,
  partitionId: PARTITION_ID,
  pollingStrategy: PollingStrategy.Next,
  count: 10,
  autocommit: true,
});

for (const message of polledMessages.messages) {
  const payload = message.payload.toString('utf8');
  console.log(`Offset: ${message.headers.offset}, Payload: ${payload}`);
}

await client.destroy();
```

## Configuration

The client constructor accepts a few options:

- **reconnect**: automatic reconnection with `{ enabled, interval, maxRetries }`.
- **heartbeatInterval**: the client pings the server every 5 seconds by default. `0` disables heartbeats. The server evicts connections that stay silent too long, so keep it well below the server's heartbeat timeout.
- **maxResponseFrameSize**: response frames larger than this limit (default 64 MiB) are rejected and close the connection. Raise it when polling very large batches.
- **poolSize**: the client currently supports exactly one pooled connection. `min`/`max` above 1 throw.
- **TLS**: set `transport: 'TLS'` and pass Node `tls.ConnectionOptions` in `options`. See the [tcp-tls example](https://github.com/apache/iggy/tree/master/examples/node/src/tcp-tls).

## Beyond the basics

- **Consumer groups**: `client.group` manages groups (including ensure-and-join in one call), and polling with `Consumer.Group` distributes partitions across group members.
- **Consumer streams**: `singleConsumerStream` and `groupConsumerStream` expose polling as Node streams.
- **Administration**: users, personal access tokens, offsets, partitions, segments, and cluster metadata are all available on the client.
- **Errors**: the package exports `ResponseError`, `DeserializeError`, `ProtocolFrameError`, and `VsrEvictionError` for precise error handling.

See the [foreign/node README](https://github.com/apache/iggy/tree/master/foreign/node) for the full API walkthrough.

## Examples

Working examples are available in the [examples/node](https://github.com/apache/iggy/tree/master/examples/node) directory, written in TypeScript. See [Examples](/docs/sdk/node/examples) for the list and how to run them.
