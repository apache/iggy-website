# Client Failover

> Local reads, leader redirection, and retryable errors from the client side

Rendered page: https://iggy.apache.org/docs/clustering/client-failover/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/clustering/client-failover.mdx

A clustered deployment changes what a client can expect from any single node: reads are served locally where possible, writes must reach the right primary, and the SDKs follow the primary as it moves.

## Where requests are served

**Reads** are served from the local replicated state on whichever node owns the namespace locally, followers included. A client connected to a follower can poll messages and read metadata without touching the primary.

**Writes** go through consensus and are admitted on the plane's primary *only*: metadata operations on the metadata primary, message and offset writes on the primary of that partition's consensus group. A write returns after the required VSR commit, or returns a retryable error when the replica is changing view or catching up.

One caveat on follower reads: server-managed offset auto-commit replicates the polled offset through the partition consensus, which only the partition primary may do. A poll served by a follower **does not advance the durable consumer offset**. Auto-commit is best-effort *at-least-once* delivery either way, so this widens the redelivery window after failover rather than losing data.

## Leader redirection

Leader-aware SDKs find the primary instead of requiring you to point them at it:

1. The client connects to any node from its connection string and fetches cluster metadata, which lists every node with its name, client endpoints, role, and status.
2. When the connected node isn't the leader, the client reconnects to the leader's advertised endpoint for the transport in use.
3. When the cluster is transiently leaderless (for roughly one heartbeat timeout after a primary fails, while the election completes), the client polls the metadata until a leader appears instead of failing.
4. Redirects are **capped** (three in the Rust SDK) so a flapping roster can't bounce the client forever.

The address a client is redirected to is the node's `advertised_address` (or the matching `advertised_addresses` selector), falling back to the roster `ip`. Getting those right matters: the client redials **exactly what the metadata advertises**. See [Configuration](/docs/clustering/configuration) for the selector rules.

The Rust implementation lives in [`core/sdk/src/leader_aware.rs`](https://github.com/apache/iggy/blob/master/core/sdk/src/leader_aware.rs).

## Retryable errors

During a view change or while a replica catches up, writes fail with transient errors rather than definitive ones. The SDKs replay those transparently, so a primary failover surfaces as **added latency rather than an error**, as long as it completes within the client's retry budget. Definitive errors (validation failures, permission denials) are **never replayed**.

## SDK support

Every SDK speaks the VSR wire protocol and can connect to any node of a cluster. Client-side leader redirection is exercised by the shared `leader_redirection` BDD suite, which runs against a real two-node cluster:

| SDK | VSR wire protocol | Leader redirection suite |
| --- | --- | --- |
| Rust | yes | yes |
| Go | yes | yes |
| C# | yes | yes |
| Java | yes | yes |
| Python | yes | not yet |
| Node.js | yes | not yet |
| C++ | yes | not yet |

Run the suite for one SDK with:

```bash
./scripts/run-bdd-tests.sh rust leader_redirection
```

For SDKs without redirection coverage, connect clients to the current primary for write-heavy workloads, or front the cluster's HTTP transport with a load balancer and rely on [follower HTTP forwarding](/docs/clustering/security) for control-plane operations.
