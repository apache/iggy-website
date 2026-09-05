# Security

> Authentication, authorization, transport encryption and encryption at rest in the Iggy server.

Rendered page: https://iggy.apache.org/docs/server/security/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/server/security.mdx

Iggy provides multiple layers of security covering authentication, authorization, transport encryption, and data encryption at rest.

## Authentication

Iggy supports two authentication mechanisms:

### Username and password

Users authenticate with a username and password via `login_user()`. Passwords are hashed using **Argon2id** (a memory-hard hashing algorithm). On first startup, the server generates a random password for the `root` user and logs it to the console. You can override this by setting environment variables:

```bash
IGGY_ROOT_USERNAME=iggy
IGGY_ROOT_PASSWORD=my-secret-password
```

Or use the `--with-default-root-credentials` flag for development (sets root credentials to `iggy`/`iggy`).

**Important**: once the data directory exists, environment variable credentials are **ignored**. To reset credentials, you must use the `--fresh` flag (which deletes all data).

The root user **cannot be deleted**, and its permissions are fixed: it always holds every permission.

### Personal Access Tokens (PAT)

PATs provide programmatic access with optional expiry. Each user can have up to `max_tokens_per_user` (default 100) active tokens. Tokens are **hashed before storage** and can be revoked at any time.

```bash
# Create a PAT via CLI
iggy -u iggy -p secret pat create my-token 7d

# Use the PAT for authentication
iggy -t my-token-value stream list
```

An automatic cleaner removes expired tokens at a configurable interval.

Only the ping liveness probe and the login endpoints themselves are served without authentication. **Everything else** - including the Prometheus `/metrics` scrape - requires an authenticated session or bearer credential.

## Authorization

Iggy provides granular permissions at three levels:

1. **Global permissions** - apply to the whole server and all streams
2. **Stream permissions** - scoped to one stream and all its topics
3. **Topic permissions** - scoped to one topic within a stream

The root user has full access to everything and **bypasses all permission checks**. Other users can be assigned specific permissions using the CLI, HTTP API, SDK, or Web UI.

### Permission matrix

The global permissions and the operations they unlock:

| Operation | Required global permission |
|-----------|---------------------------|
| Get server stats | `read_servers` |
| List clients, get client | `read_servers` |
| Create, update, delete users; update permissions; change passwords | `manage_users` |
| Get user, list users | `read_users` |
| Create, update, delete streams | `manage_streams` |
| Get stream, list streams | `read_streams` |
| Create, update, delete topics | `manage_topics` |
| Get topic, list topics | `read_topics` |
| Consumer groups: create, delete, join, leave, get | `read_topics` |
| Poll messages | `poll_messages` |
| Send messages | `send_messages` |

Two kinds of implication apply on top of the table:

- **Supersets**: every `manage_*` permission includes its `read_*` counterpart. In addition `manage_streams` includes `manage_topics`, `read_streams` includes `read_topics`, and `read_topics` includes `poll_messages`.
- **Self-service**: an authenticated user can always read their own account, change their own password, and manage their own personal access tokens, without any of the user permissions above.

### Scoped permissions

Instead of (or in addition to) global grants, permissions can be scoped per stream and per topic:

- **Stream scope**: `manage_stream`, `read_stream`, `manage_topics`, `read_topics`, `poll_messages`, `send_messages`, plus an optional per-topic map. `read_stream` includes `read_topics` and `poll_messages` within that stream.
- **Topic scope**: `manage_topic`, `read_topic`, `poll_messages`, `send_messages`. `read_topic` includes `poll_messages` on that topic.

### How permissions cascade

Permissions are checked from top to bottom: global, then stream, then topic. A permission granted at a higher level covers everything below it:

- Global `poll_messages` lets the user poll messages from **all** streams and topics.
- Stream-scoped `poll_messages` on stream 1 lets the user poll from **all topics** in stream 1, but not from other streams.
- Topic-scoped `poll_messages` on topic 5 of stream 1 lets the user poll **only** from that topic.

If a stream has no entry in the user's stream permissions, only global permissions apply to it. The same holds for topics within a stream.

For example, a user that may only consume from stream 42 needs no global permissions at all: grant stream-scoped `read_stream` and `poll_messages` on stream 42, and the user can read that stream, list its topics, and poll messages from any topic in it. Nothing else.

## Transport encryption (TLS)

Each transport configures TLS in its own section, and the `self_signed` semantics differ per transport:

| Transport | Section | Behavior |
|-----------|---------|----------|
| TCP | `[tcp.tls]` | `self_signed = true` generates an ephemeral certificate only while `cert_file` does not exist; an existing PEM pair is loaded instead. |
| WebSocket | `[websocket.tls]` | Same load-or-generate rule as TCP. |
| QUIC | `[quic.certificate]` | TLS is mandatory (part of the QUIC spec). `self_signed = true` **always** generates an ephemeral certificate and ignores `cert_file`/`key_file`, logging a warning if the files exist. |
| HTTP | `[http.tls]` | No `self_signed` option: HTTPS requires real `cert_file`/`key_file`. |

For production deployments, provide proper certificates via `cert_file` and `key_file`. Ephemeral certificates change on every start and cannot be verified by clients. See [Networking](/docs/server/networking) for the surrounding transport configuration.

## Data encryption at rest

Iggy supports optional **AES-256-GCM** encryption for message payloads and state commands. When enabled, all data is encrypted before being written to disk and decrypted when read. The encryption key must be a 32-byte base64-encoded string.

```toml
[system.encryption]
enabled = false
key = ""  # 32-byte base64-encoded key
```

## JWT (HTTP API)

The HTTP API uses JWT (JSON Web Tokens) for session management. Tokens are signed with HS256 by default and have configurable expiry, clock skew tolerance, and audience/issuer validation:

```toml
[http.jwt]
algorithm = "HS256"
issuer = "iggy.apache.org"
audience = "iggy.apache.org"
access_token_expiry = "1 h"
clock_skew = "5 s"
```

Further keys (`valid_issuers`, `valid_audiences`, `not_before`, `use_base64_secret`, the signing secrets) are covered in [Configuration](/docs/server/configuration).

**Signing secrets**: `encoding_secret` and `decoding_secret` default to empty, which makes the server generate a secure random secret on every start. That's a safe single-node default with two consequences: issued tokens **die on restart**, and in a cluster each node signs with its own key, so bearers are node-local and follower-to-primary request forwarding stays disabled. For clusters, configure an identical secret on every node (prefer the `IGGY_HTTP_JWT_ENCODING_SECRET`/`IGGY_HTTP_JWT_DECODING_SECRET` environment variables over on-disk config), or enable `cluster.auth` so the JWT key derives from the cluster's shared PSK.

**Refresh tokens**: `POST /users/refresh-token` re-issues an access token from a still-valid one presented in the request body, answering the same identity shape as login, so HTTP clients can extend a session without re-sending credentials.

**Federated issuers**: the opt-in `[[http.jwt.trusted_issuers]]` list accepts tokens minted by external identity providers for application-to-application flows. Each entry names an `issuer`, `audience`, and `jwks_url`. Signatures are verified against the issuer's JWKS (fetches are rate-limited), and every token from that issuer is remapped onto the configured non-root `user_id`. With no entries configured, the listener accepts only self-issued tokens. See [Configuration](/docs/server/configuration) for the key reference.

## Cluster security

In cluster mode, replica-to-replica traffic can require an authenticated handshake based on a pre-shared key (with a documented rolling rotation procedure) and can be wrapped in TLS 1.3. With `cluster.auth` enabled and no JWT secrets configured, the PSK also becomes the cluster-wide JWT key source. See [Clustering security](/docs/clustering/security).
