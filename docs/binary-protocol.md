# Binary Protocol

> Binary protocol 0.11.0: one wire format across TCP, QUIC and WebSocket, covering both the client and replica planes.

Rendered page: https://iggy.apache.org/docs/binary-protocol/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/binary-protocol/index.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

Iggy speaks one binary protocol over its three binary transports: TCP, QUIC, and WebSocket. Commands, responses, data models, and status codes are the same on all of them. The HTTP transport is separate: it exposes JSON REST endpoints for a subset of these operations, listed in [server.http](https://github.com/apache/iggy/blob/master/core/server/server.http).

This section describes **binary protocol version 0.11.0**. The protocol version is the `major.minor.patch` of the `iggy_binary_protocol` crate, ignoring prerelease tags, and it's exchanged and checked during login (see [Connection lifecycle](https://iggy.apache.org/docs/binary-protocol/connection-lifecycle)). The crate itself is the source of truth: request and response types document their payload layouts, and the server dispatch defines which operations are supported.

All multi-byte integers are **little-endian** unless stated otherwise.

The same 256-byte header layout carries two traffic planes. The pages below cover both:

- **Server ↔ SDK client**, everything a client sends or receives:
  - [Framing](https://iggy.apache.org/docs/binary-protocol/framing): the 256-byte headers every client-facing message rides in.
  - [Connection lifecycle](https://iggy.apache.org/docs/binary-protocol/connection-lifecycle): protocol versioning and the login-register handshake.
  - [Commands](https://iggy.apache.org/docs/binary-protocol/commands): the command codes and per-command payload layouts.
  - [Shared encodings](https://iggy.apache.org/docs/binary-protocol/encodings): primitives the payloads are built from.
  - [Message batches](https://iggy.apache.org/docs/binary-protocol/messages): the one layout messages travel and rest in.
- **Server ↔ server**, the replica-to-replica consensus traffic that never appears on a client connection:
  - [Server-to-server](https://iggy.apache.org/docs/binary-protocol/cluster): prepare/ack replication, view changes, and state transfer.
