# Binary Protocol

> Binary protocol 0.11.0: one wire format across TCP, QUIC and WebSocket, covering both the client and replica planes.

Rendered page: https://iggy.apache.org/docs/binary-protocol/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/binary-protocol/index.mdx

Iggy speaks one binary protocol over its three binary transports: TCP, QUIC, and WebSocket. Commands, responses, data models, and status codes are the same on all of them. The HTTP transport is separate: it exposes the same operations as JSON REST endpoints, listed in [server.http](https://github.com/apache/iggy/blob/master/core/server/server.http).

This section describes **binary protocol version 0.11.0**. The protocol version is the semver of the `iggy_binary_protocol` crate, and it's exchanged and checked during login (see [Connection lifecycle](/docs/binary-protocol/connection-lifecycle)). The crate itself is the source of truth: every request and response module carries a `Wire format:` doc comment, and these pages are written against those.

All multi-byte integers are **little-endian** unless stated otherwise.

The same 256-byte header layout carries two traffic planes. The pages below cover both:

- **Server ↔ SDK client**, everything a client sends or receives:
  - [Framing](/docs/binary-protocol/framing): the 256-byte headers every client-facing message rides in.
  - [Connection lifecycle](/docs/binary-protocol/connection-lifecycle): protocol versioning and the login-register handshake.
  - [Commands](/docs/binary-protocol/commands): the command codes and per-command payload layouts.
  - [Shared encodings](/docs/binary-protocol/encodings): primitives the payloads are built from.
  - [Message batches](/docs/binary-protocol/messages): the one layout messages travel and rest in.
- **Server ↔ server**, the replica-to-replica consensus traffic that never appears on a client connection:
  - [Server-to-server](/docs/binary-protocol/cluster): prepare/ack replication, view changes, and state transfer.
