# Cluster Security

> Replica authentication, shared-secret rotation, and TLS for replica traffic

Rendered page: https://iggy.apache.org/docs/clustering/security/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/clustering/security.mdx

Replica-to-replica security has two layers, both in the `[cluster]` configuration: a pre-shared-key handshake that authenticates peers (`[cluster.auth]`) and optional TLS that encrypts the replica connection (`[cluster.tls]`).

## Replica authentication

Replica authentication uses a cluster-wide pre-shared key (PSK) and a BLAKE3 keyed-MAC handshake. With `cluster.auth.enabled = true`, every replica peer must complete the authenticated handshake or be rejected:

```toml
[cluster.auth]
enabled = true
shared_secret = ""
```

- The secret must be **at least 32 bytes** of CSPRNG output and **byte-identical on every node**.
- Prefer the `IGGY_CLUSTER_AUTH_SHARED_SECRET` environment variable over storing the secret in TOML. The value is masked in logs and never written into the runtime configuration snapshot.
- Authentication is **off by default**, which leaves replica traffic unauthenticated. Enabling it is a **coordinated-restart change**: flip every node in one restart.
- The 32-byte minimum is enforced whenever the cluster is enabled, even with `auth.enabled = false`: a configured non-empty secret shorter than 32 bytes fails boot.

## Rotating the shared secret

`previous_shared_secret` enables a rolling key rotation without an authentication outage. The retiring key is accepted *for verification only*. Every MAC a node produces uses `shared_secret`. Rotate in three rolls, restarting every node after each step:

1. `shared_secret = old`, `previous_shared_secret = new` on every node
2. `shared_secret = new`, `previous_shared_secret = old` on every node
3. `shared_secret = new` alone, closing the window

Leave `previous_shared_secret` **empty outside a rotation**. It has the same 32-byte floor and the same environment-variable preference as the primary key (`IGGY_CLUSTER_AUTH_PREVIOUS_SHARED_SECRET`), and it must differ from `shared_secret`. An identical value is refused at boot because the rotation would be a no-op.

## Replica TLS

`[cluster.tls]` wraps every replica connection on the `tcp_replica` port in TLS 1.3 (ALPN `iggy-replica`) before the replica handshake runs:

```toml
[cluster.auth]
enabled = true

[cluster.tls]
enabled = true
self_signed = false
cert_file = "/etc/iggy/tls/node.crt"
key_file = "/etc/iggy/tls/node.key"
ca_file = "/etc/iggy/tls/ca.crt"
```

TLS requires `cluster.auth.enabled = true`, and the server **refuses to start** otherwise. The reason: replica TLS carries no client certificates, so it authenticates the acceptor only. The PSK handshake authenticates the peer. TLS supplies confidentiality. Without the PSK requirement, any TLS-capable host could register as a replica.

Enabling TLS is also a coordinated-restart change: a TLS dialer can't talk to a plaintext acceptor or vice versa.

Two certificate modes exist:

- **CA mode** (`self_signed = false`, the default): `cert_file`, `key_file`, and `ca_file` are all required. Each node presents `cert_file` on its acceptor side, and dialers verify peer certificates against the `ca_file` trust anchors. The dialer verifies each peer against the `ip` string from that peer's `cluster.nodes` entry, so certificates need matching IP SANs.
- **Self-signed mode** (`self_signed = true`): the node auto-generates a certificate at boot and the dialer accepts ANY peer certificate. This gives you encrypted replica traffic without certificate management, but **no acceptor authentication at all**: peer authenticity rests entirely on the PSK handshake. Use CA mode when the replica network is not trusted.

## HTTP tokens across the cluster

Follower nodes forward control-plane HTTP requests (stream, topic, user, and similar metadata operations) to the current metadata primary, so **any node can answer any control-plane request**. This requires JWT key material that every node can verify, from either of two sources:

- explicitly configured `http.jwt` signing secrets, identical on every node, or
- the cluster PSK: when HTTP is enabled, cluster auth is enabled, and no `http.jwt` secrets are configured, the signing key is derived from `shared_secret`.

Either way, a bearer token minted on any node verifies on every node, which is the invariant the forwarding depends on. Forwarded requests dial the primary at its roster `ip` and `ports.http`. The follower verifies the caller's bearer locally before forwarding, and the primary re-authenticates the request through its normal stack.

The forwarding covers the control plane only. Partition-plane writes over HTTP (producing messages, storing consumer offsets) are **not forwarded**: each partition is its own consensus group whose primary can diverge from the metadata primary, so those requests must land on the right node. See [Client failover](/docs/clustering/client-failover) for how clients find it.
