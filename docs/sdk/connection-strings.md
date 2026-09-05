# Connection Strings

> The canonical reference for Iggy connection strings, covering every scheme, credential form and option.

Rendered page: https://iggy.apache.org/docs/sdk/connection-strings/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/connection-strings.mdx

A connection string configures an Iggy client in a single line: transport, credentials, server address, and options. This page is the canonical reference for every scheme, credential form, and option key.

Connection strings are supported by the Rust SDK and the SDKs that wrap it (Python, C++, PHP).

## Format

```
iggy[+transport]://credentials@host:port[?option=value&option=value]
```

The host and port are **always required**. Options are appended as `key=value` pairs separated by `&`.

**Unknown option keys are hard errors.** The parser rejects the whole string with `InvalidConnectionString` instead of ignoring the key, so a typo fails fast rather than silently falling back to a default.

## Transport selection

The scheme picks the transport. Each transport has its own default server port:

| Scheme | Transport | Default server port |
|--------|-----------|---------------------|
| `iggy://` | TCP (default) | 8090 |
| `iggy+tcp://` | TCP | 8090 |
| `iggy+quic://` | QUIC | 8080 |
| `iggy+http://` | HTTP | 3000 |
| `iggy+ws://` | WebSocket | 8092 |

## Credentials

Two forms are accepted:

**Username and password**, separated by a colon. Both parts must be non-empty:

```
iggy://username:password@localhost:8090
```

**Personal Access Token**: any credential without a colon is treated as a PAT. Server-minted tokens are plain base64 strings with no prefix, so paste the token exactly as the server returned it:

```
iggy://<personal-access-token>@localhost:8090
```

**Do not prepend anything** to the token. Strings like `iggypat-...` appear only in Iggy's own test code. A real token with a prefix added will fail to log in.

The default `iggy`/`iggy` root credentials **only exist** when the server was started with `--with-default-root-credentials` (or with `IGGY_ROOT_USERNAME`/`IGGY_ROOT_PASSWORD` set) on its first boot. Otherwise the root user gets a generated password and samples using `iggy:iggy` fail with `InvalidCredentials`:

```bash
cargo run --bin iggy-server -- --fresh --with-default-root-credentials
```

## Duration values

Options typed as durations take human-readable values such as `5s`, `500ms`, or `1m`, unless a table below says the value is a plain number.

## TCP options

| Key | Description | Default |
|-----|-------------|---------|
| `tls` | Enable TLS (`true`/`false`) | `false` |
| `tls_domain` | Domain name for TLS validation | empty |
| `tls_ca_file` | Path to a CA certificate file | none |
| `reconnection_retries` | Number of reconnection attempts, or `unlimited` | `unlimited` |
| `reconnection_interval` | Duration between reconnection attempts | `1s` |
| `reestablish_after` | Duration to wait before reestablishing the connection | `5s` |
| `heartbeat_interval` | Duration between heartbeats | `5s` |
| `nodelay` | Enable `TCP_NODELAY` (`true`/`false`) | `false` |

```
iggy://iggy:iggy@localhost:8090?tls=true&tls_domain=example.com&reconnection_retries=5&heartbeat_interval=3s&nodelay=true
```

## QUIC options

The QUIC reconnection keys **differ from TCP**: `reconnection_max_retries` (not `reconnection_retries`) and `reconnection_reestablish_after` (not `reestablish_after`). Using the TCP names in a QUIC string is a hard error.

| Key | Description | Default |
|-----|-------------|---------|
| `response_buffer_size` | Response buffer size in bytes | `10000000` |
| `max_concurrent_bidi_streams` | Maximum concurrent bidirectional streams | `10000` |
| `datagram_send_buffer_size` | Datagram send buffer size in bytes | `100000` |
| `initial_mtu` | Initial MTU | `1200` |
| `send_window` | Send window size | `100000` |
| `receive_window` | Receive window size | `100000` |
| `keep_alive_interval` | Keep-alive interval in milliseconds (number) | `5000` |
| `max_idle_timeout` | Maximum idle timeout in milliseconds (number) | `10000` |
| `validate_certificate` | Validate the server certificate (`true`/`false`) | `false` |
| `heartbeat_interval` | Duration between heartbeats | `5s` |
| `reconnection_max_retries` | Number of reconnection attempts, or `unlimited` | `unlimited` |
| `reconnection_interval` | Duration between reconnection attempts | `1s` |
| `reconnection_reestablish_after` | Duration to wait before reestablishing the connection | `5s` |

```
iggy+quic://iggy:iggy@localhost:8080?validate_certificate=false&reconnection_max_retries=5
```

## WebSocket options

| Key | Description | Default |
|-----|-------------|---------|
| `heartbeat_interval` | Duration between heartbeats | `5s` |
| `reconnection_retries` | Number of reconnection attempts, or `unlimited` | `unlimited` |
| `reconnection_interval` | Duration between reconnection attempts | `1s` |
| `reestablish_after` | Duration to wait before reestablishing the connection | `5s` |
| `read_buffer_size` | Read buffer size in bytes | transport default |
| `write_buffer_size` | Write buffer size in bytes | transport default |
| `max_write_buffer_size` | Maximum write buffer size in bytes | transport default |
| `max_message_size` | Maximum WebSocket message size in bytes | transport default |
| `max_frame_size` | Maximum WebSocket frame size in bytes | transport default |
| `accept_unmasked_frames` | Accept unmasked frames (`true`/`false`) | transport default |
| `tls` | Enable TLS (`true`/`false`) | `false` |
| `tls_domain` | Domain name for TLS validation | empty |
| `tls_ca_file` | Path to a CA certificate file | none |
| `tls_validate_certificate` | Validate the server certificate (`true`/`false`) | `false` |

```
iggy+ws://iggy:iggy@localhost:8092?heartbeat_interval=5s&max_message_size=1048576
```

## HTTP options

| Key | Description | Default |
|-----|-------------|---------|
| `heartbeat_interval` | Duration between heartbeats | `5s` |
| `retries` | Number of request retries | `3` |

```
iggy+http://iggy:iggy@localhost:3000?retries=5
```

## Usage

```rust
use iggy::prelude::*;

// TCP with default options
let client = IggyClient::from_connection_string("iggy://iggy:iggy@localhost:8090")?;

// QUIC
let client = IggyClient::from_connection_string("iggy+quic://iggy:iggy@localhost:8080")?;

// WebSocket
let client = IggyClient::from_connection_string("iggy+ws://iggy:iggy@localhost:8092")?;

// HTTP
let client = IggyClient::from_connection_string("iggy+http://iggy:iggy@localhost:3000")?;
```

```python
# Python
client = IggyClient.from_connection_string("iggy://iggy:iggy@localhost:8090")
```

When you need settings a connection string cannot express (a custom `Encryptor`, a `Partitioner`, and similar), start from `IggyClientBuilder::from_connection_string()` and extend the builder on top.
