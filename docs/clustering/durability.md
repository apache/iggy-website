# Cluster Durability

> Quorum completion, persisted prepare history, and the failures each topic policy covers.

Rendered page: https://iggy.apache.org/docs/clustering/durability/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/clustering/durability.mdx

Iggy uses [Viewstamped Replication](/docs/clustering/vsr) to commit partition
operations. The topic's `durability` and `consumer_offset_durability`
options select the storage guarantee required for message production and
explicit offset changes, respectively. Both default independently to
`replicated`. Both continue to write data to disk.

For the creation options and single-node behavior, see
[Durability](/docs/server/durability).

## What an acknowledgement means

For an operation that waits for completion:

| Policy | Required before success |
| --- | --- |
| `replicated` | VSR quorum commit and local application, without an additional stable-storage barrier |
| `persisted` | VSR quorum commit backed by recoverable stable-storage copies at the required quorum, followed by local application |

The policy changes what a replica must retain before its acknowledgement can
count toward commit. It does not replace quorum commit with a primary-only
disk write.

Iggy's replication quorum is not a strict majority for every group size:

| Replicas | Replication quorum | View-change quorum |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 2 | 2 |
| 3 | 2 | 2 |
| 4 | 2 | 3 |
| 5 | 3 | 3 |
| 6 | 3 | 4 |

Except for two replicas, the replication quorum is `min(ceil(n / 2), 3)`
and the view-change quorum is `n - replication_quorum + 1`. Two replicas
require both for either quorum. The quorums therefore intersect. These are
the [implemented quorum rules](https://github.com/apache/iggy/blob/97f7b0c0335f81691bef34f923f21d783016a6a4/core/consensus/src/impls.rs),
not a configurable acknowledgement count.

## Replicated completion

With both policies set to `replicated`, partition prepares stay off the
disk prepare-WAL path. Replicas retain the prepares in memory, and committed
messages reach segment files through ordinary flush scheduling.

Success therefore does not prove that the operation reached stable storage
on any replica. Replication protects against failures while sufficient peers
retain the history and can form the quorums needed for recovery and progress.
For example, a healthy three-replica group can continue after one replica
fails.

Failure independence matters. A shared power loss, an OOM cascade, or a
crash triggered on every replica can destroy multiple volatile copies at
once. A process-only failure can lose messages still in the processes'
journals, even while the kernels and their page caches remain alive.
Replication count alone does not establish a bound on that loss.

## Persisted completion

When either policy is `persisted`, each multi-replica partition uses a
bounded on-disk prepare WAL. The WAL records full prepares, including message
payloads. A prepare requiring persistence cannot release its `PrepareOk`
until its history and durable frontier are recoverable.

Prepares can be forwarded while local persistence is pending. Once enough
replicas have met the required barrier, the operation can commit and the
primary can apply it and reply. An acknowledged message may still be in
the prepare WAL rather than in a segment file; its recovery does not depend
on first reaching a segment flush threshold.

The WAL also retains predecessors across message and offset operations.
Consequently:

- `durability=persisted` does not make an offset response persisted when
  `consumer_offset_durability=replicated`.
- `consumer_offset_durability=persisted` with replicated messages still
  journals message payloads. A durable offset's predecessor history must
  remain recoverable.
- A shared barrier can also persist co-batched operations with the weaker
  policy. That incidental persistence does not strengthen what their earlier
  `replicated` acknowledgements promised.
- Only the `replicated` / `replicated` combination avoids the disk prepare
  WAL entirely.

WAL history is reclaimed only after the materialized segment and offset
state needed to replace it has been synchronized. The server's
`[partition] wal_bytes_max` setting, default `256 MiB`, bounds active WAL
and queued/in-flight prepare bytes per partition. Capacity pressure causes
checkpointing and backpressure; it does not downgrade a persisted operation.
Temporary rewrites need additional disk space.

## Recovery and failure limits

A restarting replica loads segment and offset state and, when enabled,
reconciles the durable prepare WAL with that state. It also restores durable
consensus state and follows the recovery protocol before serving as a healthy
replica. It does not treat every locally recovered prepare as committed.

Missing required history, checksum failures, or contradictory materialized
state must not become an empty healthy partition. Recovery can fence a
partition and repair it from peers. Storage errors withhold successful
completion; a locally failed application of a committed operation fences the
partition and initiates server shutdown.

`persisted` protects acknowledged operations across process and power
failures when the required storage copies remain intact and the storage
honors synchronization. Recovery and availability still require the
protocol's quorums. It cannot protect against destruction of all durable
copies, nor does it prevent configured retention or explicit deletion.

## Choosing the policies

Use `replicated` when the workload accepts the risk of losing acknowledged
operations after correlated failures in exchange for avoiding a required
storage barrier at completion. Isolate replicas across failure domains; see
[Deployment](/docs/clustering/deploy).

Use `durability=persisted` when acknowledged messages must be recoverable
after volatile copies are lost. Select
`consumer_offset_durability=persisted` independently when explicit offset
stores and deletes need the same guarantee. Ordinary flush thresholds can
remain at their defaults.

Neither policy turns HTTP `ack=none` or a poll's auto-commit into an awaited
durable result. See [Which responses prove completion](/docs/server/durability#which-responses-prove-completion).

The storage mechanisms are implemented in the
[partition persistence worker](https://github.com/apache/iggy/blob/97f7b0c0335f81691bef34f923f21d783016a6a4/core/partitions/src/persistence.rs)
and [prepare journal](https://github.com/apache/iggy/blob/97f7b0c0335f81691bef34f923f21d783016a6a4/core/journal/src/partition_journal.rs).
The [crash-recovery tests](https://github.com/apache/iggy/blob/97f7b0c0335f81691bef34f923f21d783016a6a4/core/integration/tests/cluster/crash_durability.rs)
exercise acknowledged persisted messages and offsets below ordinary flush
thresholds, on both a singleton and a three-replica cluster.
