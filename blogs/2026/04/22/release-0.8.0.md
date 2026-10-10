# Apache Iggy 0.8.0 Release

Published: 2026-04-22

Rendered page: https://iggy.apache.org/blogs/2026/04/22/release-0.8.0/

Source: https://github.com/apache/iggy-website/blob/main/content/blog/release-0.8.0.mdx

## Release 0.8.0

Less than two months after [0.7.0](https://iggy.apache.org/blogs/2026/02/24/release-0.7.0/), we're excited to release **[Apache Iggy 0.8.0](https://github.com/apache/iggy/releases/tag/server-0.8.0)** - a release focused on deep internal restructuring and hardening the path to clustering.

While 0.7.0 laid the foundations for **Viewstamped Replication (VSR)** consensus, 0.8.0 is about **unifying the architecture**: a complete **wire protocol rewrite** that eliminates three redundant serialization paths, a new **shard crate** with proper request routing, a **persistent WAL journal** for metadata durability, a **WAL-backed ClientTable** with view-change safety, new **memory primitives** for zero-copy message handling, initial **A2A (Agent-to-Agent) protocol** support for agentic workloads, and significant **security improvements** including user header encryption. On the SDK side, the **C++ client** is being revived with low-level bindings and Bazel infrastructure, while the **Go SDK** gained full **TCP/TLS** support and the **Java SDK** shipped **async connection pooling**.

---

## Iggy Server

### Wire Protocol Rewrite

The largest refactoring effort in this release is the **complete unification of the wire protocol**. The binary protocol layer previously had three redundant serialization paths: `ServerCommand` enum with a hand-rolled `binary_mapper`, the `BytesSerializable` trait for domain type serialization, and `WireEncode`/`WireDecode` for wire protocol types - all doing the same job with different APIs.

This release collapses them into one:

- **[Wire protocol codec and types](https://github.com/apache/iggy/pull/2946)** - new `WireEncode`/`WireDecode` types in the `binary_protocol` crate
- **[Wire types for all commands](https://github.com/apache/iggy/pull/2962)** - wire types and zero-copy message primitives for every command
- **[Sans-IO frame codec](https://github.com/apache/iggy/pull/2967)** - frame codec and command dispatch table, decoupled from I/O for better testability
- **[ServerCommand/BytesSerializable removal](https://github.com/apache/iggy/pull/3041)** - the `ServerCommand` enum, `binary_mapper`, 45+ command structs, and `BytesSerializable` trait are all deleted; wire types flow directly from transport through shard dispatch to handlers
- **[Partitions rework](https://github.com/apache/iggy/pull/3020)** - partitions refactored around `Message<H, B>` with explicit ownership model, removing the old prefix/tail copy-on-write design and its aliasing problems

### Clustering & VSR Consensus

Building on 0.7.0's VSR foundations, this release introduces the structural primitives needed to wire consensus into the server:

- **[Shard crate & IggyShard](https://github.com/apache/iggy/pull/2811)** - new dedicated `shard` crate with a generic `IggyShard` that dispatches incoming network messages to the correct consensus plane via `PlaneIdentity`
- **[Shard router](https://github.com/apache/iggy/pull/2853)** - routes requests within shards to the appropriate handlers
- **[Plane trait](https://github.com/apache/iggy/pull/2780)** - a unified abstraction for dispatching requests to different subsystems based on plane demux logic
- **[MuxPlane handles](https://github.com/apache/iggy/pull/2855)** - metadata and partition handles for MuxPlane, wiring subsystems into the consensus layer
- **[Namespaced pipelines](https://github.com/apache/iggy/pull/2765)** - independent commit progress across namespaces with per-namespace VecDeques under one global operation sequence and hash chain
- **[Loopback queue](https://github.com/apache/iggy/pull/2825)** - loopback queue for primary self-addressed messages in consensus
- **[STM response threading](https://github.com/apache/iggy/pull/2856)** - state machine responses now propagated back through consensus Reply body, so clients receive assigned IDs without a second query
- **[VSR types consolidation](https://github.com/apache/iggy/pull/3014)** - consolidated VSR types into `binary_protocol`
- **[server-ng binary](https://github.com/apache/iggy/pull/3053)** - new `iggy-server-ng` binary crate for the next-generation server with clustering support
- **[ClientTable with WAL-backed commit path](https://github.com/apache/iggy/pull/3023)** - client request tracking with at-most-once semantics, durably persisted through the WAL and safe across view changes

The **simulator** also advanced significantly with a **[PacketSimulator](https://github.com/apache/iggy/pull/2769)** for deterministic testing, **[poll_messages support](https://github.com/apache/iggy/pull/2960)**, **[Network wired into the tick loop](https://github.com/apache/iggy/pull/3049)** with per-replica outboxes and replica crash simulation, and the **[view change protocol wired end-to-end](https://github.com/apache/iggy/pull/3092)** so leader failover can now be exercised deterministically.

### Persistent WAL Journal

**[Persistent WAL journal with recovery and compaction](https://github.com/apache/iggy/pull/2916)** - metadata changes are now durably persisted to a write-ahead log with recovery and compaction support, a critical building block for cluster state durability. The **[partition journal](https://github.com/apache/iggy/pull/2909)** was also refactored to use the `Storage` trait as backing storage rather than inline data.

### Memory & Buffer Primitives

New memory management primitives for high-throughput message handling:

- **[Aligned buffer memory pool](https://github.com/apache/iggy/pull/2921)** - pre-allocated aligned buffers for efficient I/O operations
- **[TwoHalves buffer](https://github.com/apache/iggy/pull/2944)** - a split buffer using `Vec<u8>` instead of `Bytes`, with mutable and immutable halves that share the same allocation initially and diverge on first clone - the mutable part is copied while the immutable part uses thread-safe reference counting for cheap sharing

### Agentic Workloads

- **[A2A (Agent-to-Agent) protocol support](https://github.com/apache/iggy/pull/2656)** - initial server-side support for the A2A protocol, backed by **JWKS** so agents from different tenants can authenticate with their own public keys, with key rotation handled without server restarts. This lands the first piece of the agentic story outlined in 0.7.0's roadmap.

### Security Improvements

- **[User header encryption](https://github.com/apache/iggy/pull/3040)** - both server-side and client-side encryption now encrypt user-defined headers alongside the message payload; previously headers were left in plaintext on disk (**BREAKING**)
- **[Random JWT secrets](https://github.com/apache/iggy/pull/2974)** - empty JWT secret defaults now trigger secure random generation at startup, preventing all instances from sharing the same signing key
- **[SecretString credentials](https://github.com/apache/iggy/pull/2931)** - credentials wrapped in `SecretString` to prevent accidental leaks in logs and debug output
- **[Consensus header validation](https://github.com/apache/iggy/pull/2887)** - fixed undefined behavior where untrusted bytes from the network were reinterpreted as Rust enum discriminants without validation
- **[Plaintext secrets regression test](https://github.com/apache/iggy/pull/2945)** - ensures secrets are never persisted as plaintext
- **[Dependabot security fixes](https://github.com/apache/iggy/pull/3087)** - swept up outstanding Dependabot-flagged vulnerabilities across the workspace

### Notable Bug Fixes

- **[Consumer offset skip](https://github.com/apache/iggy/pull/2958)** - prevented consumer offset from being skipped during concurrent produce and consume operations
- **[Consumer offsets beyond max partition range](https://github.com/apache/iggy/pull/2794)** - prevented storing consumer offsets beyond the valid partition range
- **[Correct offset after segment deletion](https://github.com/apache/iggy/pull/2798)** - `current_offset` now reports the correct value after segment deletion
- **[Stats semver wire alignment](https://github.com/apache/iggy/pull/3036)** - fixed wire format alignment for stats using a zero sentinel
- **[io_uring EINVAL diagnostics](https://github.com/apache/iggy/pull/3021)** - added diagnostics for shard executor io_uring failures
- **[Windows build fix](https://github.com/apache/iggy/pull/2971)** - fixed broken Windows build for SDK and CLI
- **[Hostnames in server address config](https://github.com/apache/iggy/pull/2923)** - SDKs accept hostnames (not just IPs) in server addresses across all transports
- **[Non-tty password read](https://github.com/apache/iggy/pull/3084)** - CLI no longer breaks when stdin is not a tty (piped input, scripted usage)
- **[CLI context home directory](https://github.com/apache/iggy/pull/3069)** - ensures the home directory exists before writing context files
- **[Iceberg sink credential provider chain](https://github.com/apache/iggy/pull/3045)** - the Iceberg connector now honors the default AWS credential provider chain

### Other Improvements

- **[Threads count and disk space in sysinfo stats](https://github.com/apache/iggy/pull/2917)** - extended system stats reporting
- **[Delete segments via HTTP](https://github.com/apache/iggy/pull/2804)** - added the delete segments command to the HTTP transport
- **[ServerConfig extraction](https://github.com/apache/iggy/pull/2796)** - moved `ServerConfig` types from the server into a dedicated `configs` crate
- **[IggyMessagesBatch::last_offset O(1)](https://github.com/apache/iggy/pull/2840)** - performance improvement for batch offset lookups

### Breaking Changes

- **[User header encryption](https://github.com/apache/iggy/pull/3040)** - encryption now covers user headers in addition to payload (all SDKs updated)
- **[Wire protocol unification](https://github.com/apache/iggy/pull/3041)** - `BytesSerializable` trait and 45+ command structs removed; wire types are the single serialization path
- **[Stats semver wire alignment](https://github.com/apache/iggy/pull/3036)** - wire format change for stats using a zero sentinel for forward compatibility

Docker images are available on **[Docker Hub](https://hub.docker.com/u/apache?page=1&search=iggy)**.

---

## SDKs

### Rust

- **Rust client bumped to [0.10.0](https://github.com/apache/iggy/pull/3126)**
- **[Sans-IO frame codec and command dispatch table](https://github.com/apache/iggy/pull/2967)** - decoupled from I/O for better testability and portability
- **[Wire types for all commands with zero-copy message primitives](https://github.com/apache/iggy/pull/2962)** - foundation for the unified wire protocol
- **[Auto-reconnect on transport errors](https://github.com/apache/iggy/pull/2880)** - automatic reconnection after server restart
- **[Hostname support for QUIC and WebSocket](https://github.com/apache/iggy/pull/2768)** - clients now accept hostnames, not just IP addresses
- **[iobuf inlined into `iggy_binary_protocol`](https://github.com/apache/iggy/pull/3110)** - one less crate boundary for the hot path
- **[TCP/TLS producer and consumer examples](https://github.com/apache/iggy/pull/2820)**

### C++

The C++ SDK is being actively revived with foundational work:

- **[Low-level bindings with e2e CI config](https://github.com/apache/iggy/pull/2852)** - initial low-level bindings, tests, and end-to-end CI pipeline
- **[Consumer group functions](https://github.com/apache/iggy/pull/2988)** - consumer group support in the C++ client
- **[Bazel building and testing infrastructure](https://github.com/apache/iggy/pull/2785)** - proper build system for the C++ SDK

### Java

- **[Async connection pooling](https://github.com/apache/iggy/pull/2606)** - `FixedChannelPool`-based async connection pooling for improved throughput
- **[Async API parity with blocking client](https://github.com/apache/iggy/pull/2718)** - full async API matching all blocking client methods
- **[Connection timeout support](https://github.com/apache/iggy/pull/3026)**
- **[Generation-based auth for pooled channels](https://github.com/apache/iggy/pull/2910)** - correct re-authentication when pooled connections are recycled
- **[Unified blocking TCP client](https://github.com/apache/iggy/pull/2947)** - blocking client reimplemented as a thin wrapper over the async client
- **[TCP/TLS integration tests and examples](https://github.com/apache/iggy/pull/2823)**

### C\#

- **[Async method naming convention](https://github.com/apache/iggy/pull/2994)** - all async methods renamed with `Async` suffix following .NET conventions
- **[SDK version in login requests](https://github.com/apache/iggy/pull/2937)**
- **[TCP/TLS producer and consumer examples](https://github.com/apache/iggy/pull/2821)**
- **[Integration tests rewrite](https://github.com/apache/iggy/pull/2710)** - removed `DependsOn` for independent, parallelizable tests
- Fixed **[.NET node redirection in TCP client](https://github.com/apache/iggy/pull/2843)**

### Go

- **[TCP/TLS connection](https://github.com/apache/iggy/pull/2834)** - full TCP/TLS transport implementation
- **[Binary reader/writer](https://github.com/apache/iggy/pull/2986)** - native binary protocol encoding and decoding
- **[Command interface](https://github.com/apache/iggy/pull/2737)** - improved request handling abstraction
- **[SDK version in login requests](https://github.com/apache/iggy/pull/3025)**
- **[Infinite reconnection](https://github.com/apache/iggy/pull/2884)** - upgraded to go-retry v5 with infinite reconnection support
- **[TLS integration tests and examples](https://github.com/apache/iggy/pull/2898)**
- Fixed **[permissions serialization](https://github.com/apache/iggy/pull/3015)** and **[TCP client connect](https://github.com/apache/iggy/pull/2860)**
- Fixed **[CreateUser / UpdatePermissions buffer size](https://github.com/apache/iggy/pull/3097)** and **[stats field deserialization aligned with Rust SDK](https://github.com/apache/iggy/pull/3032)**

### Python

- **[TLS and auth args in getting-started examples](https://github.com/apache/iggy/pull/2754)**
- **[Migrated from pip to uv](https://github.com/apache/iggy/pull/2767)** for faster dependency management

### Node.js (TypeScript)

- **[TCP/TLS integration tests and examples](https://github.com/apache/iggy/pull/2822)**
- Fixed **[hostname verification](https://github.com/apache/iggy/pull/2913)** - uses localhost instead of disabling verification

### CLI

- **[Context create/delete commands](https://github.com/apache/iggy/pull/2998)** - completes the login/logout workflow with persistent context management
- **[Cluster metadata command](https://github.com/apache/iggy/pull/2839)** - inspect cluster metadata from the CLI

---

## Connectors

New connectors and runtime improvements:

- **[InfluxDB Sink and Source](https://github.com/apache/iggy/pull/2933)** - new connector for InfluxDB integration
- **[MongoDB sink connector](https://github.com/apache/iggy/pull/2815)** - new connector for MongoDB
- **[Generic HTTP sink connector](https://github.com/apache/iggy/pull/2925)** - configurable HTTP sink for forwarding messages to any HTTP endpoint
- **[Hot reload](https://github.com/apache/iggy/pull/2781)** - restart a connector with new configuration without restarting the entire runtime

Learn more in the [documentation](https://iggy.apache.org/docs/connectors/introduction).

---

## Benchmark Dashboard

- **[Embeddable chart endpoints with PNG rendering](https://github.com/apache/iggy/pull/2833)** - share benchmark charts via image URLs
- **[Latency distribution chart](https://github.com/apache/iggy/pull/2832)** - log-normal fit visualization for latency analysis
- **[LTTB downsampling](https://github.com/apache/iggy/pull/2831)** - efficient time series chart rendering for large datasets
- **[Auth support](https://github.com/apache/iggy/pull/2778)** - `--username`/`--password` flags for authenticated benchmarks
- **[Iggy brand colors](https://github.com/apache/iggy/pull/2738)** - dark mode updated to match Iggy branding
- **[Prettier benchmark table output](https://github.com/apache/iggy/pull/3090)** - cleaner CLI reporting of benchmark runs

---

## Web UI

- Fixed **[login form Enter key](https://github.com/apache/iggy/pull/2970)** - Enter now submits the form instead of toggling password visibility
- Improved **[message_expiry handling](https://github.com/apache/iggy/pull/2888)**
- **[UI /healthz endpoint](https://github.com/apache/iggy/pull/2983)** - health check for the embedded Web UI
- Frontend dependencies updated
- Web UI bumped to **[0.3.0](https://github.com/apache/iggy/pull/3121)**

---

## Helm Charts

- **[Helm chart validation](https://github.com/apache/iggy/pull/3019)** added to CI
- Fixed **[install guidance and deployment defaults](https://github.com/apache/iggy/pull/2976)**
- **[helm-docs, yamllint, and helmfmt](https://github.com/apache/iggy/pull/3070)** wired into chart quality checks

---

## CI/CD & Infrastructure

- **Parallel Rust CI** - tests **[partitioned across 2 parallel CI machines](https://github.com/apache/iggy/pull/3003)** for faster feedback
- **[DAG-scoped test selection](https://github.com/apache/iggy/pull/3095)** - Rust CI now computes the dependency DAG and runs only the tests reachable from the changed crates, with follow-ups to **[include binary packages for `CARGO_BIN_EXE`](https://github.com/apache/iggy/pull/3113)** and **[fix connector plugin / multi-crate PRs](https://github.com/apache/iggy/pull/3120)**
- **Codecov everywhere** - coverage uploads added for **[Python](https://github.com/apache/iggy/pull/2790)**, **[Go](https://github.com/apache/iggy/pull/2793)**, **[Node.js](https://github.com/apache/iggy/pull/2792)**, and **[C#](https://github.com/apache/iggy/pull/2782)** SDKs alongside existing Rust and Java coverage
- **[Post-merge CI split](https://github.com/apache/iggy/pull/3006)** - monolithic post-merge job broken into focused components with hardened Codecov uploads
- **Publish pipeline hardening** - **[crate publish chain reworked](https://github.com/apache/iggy/pull/3111)**, **[release tags gated on proven registry availability](https://github.com/apache/iggy/pull/3124)**, and **[further publish-pipeline hardening](https://github.com/apache/iggy/pull/3125)** so tag pushes only happen once the corresponding artifacts are actually live
- **[HTTP healthcheck container readiness](https://github.com/apache/iggy/pull/3093)** - integration tests wait for real HTTP health endpoints instead of log-scraping, applied to **[Elasticsearch](https://github.com/apache/iggy/pull/3079)** and **[Iceberg](https://github.com/apache/iggy/pull/3077)** containers
- **[Binary artifact detection](https://github.com/apache/iggy/pull/2875)** - pre-commit and CI checks to prevent accidental binary commits
- **[Typos checks](https://github.com/apache/iggy/pull/2803)** - automated typo detection across the repository
- **[Version bump tooling](https://github.com/apache/iggy/pull/2990)** - automated version bump with consistency checks across all crates
- **[Unified example runner](https://github.com/apache/iggy/pull/2920)** - single entrypoint for running all SDK examples with TLS support
- **[BDD coverage](https://github.com/apache/iggy/pull/2950)** - `--coverage` flag for BDD tests across all SDKs
- **[Docker actions pinned to SHA](https://github.com/apache/iggy/pull/2999)** per ASF GitHub Actions allowlist
- **[Third-party attribution for the bundled Gradle Wrapper](https://github.com/apache/iggy/pull/3109)**
- **[WASM build fix for `comfy-table`](https://github.com/apache/iggy/pull/3107)**
- **Rust bumped to [1.94](https://github.com/apache/iggy/pull/2900)**

---

## What's Next

Our primary focus remains **completing the clustering implementation with VSR consensus**. The `iggy-server-ng` binary introduced in 0.8.0 will become the cluster-ready server, integrating the shard crate, plane abstractions, persistent WAL journal, and namespaced pipeline work into a fully functional replicated cluster.

Other upcoming efforts:
- Server core optimizations: kTLS, DirectIO, and continued NUMA tuning
- SDK evolution with **sans-IO** architecture - the frame codec and wire types shipped in 0.8.0 are the foundation for transport-agnostic, fully testable client implementations
- C++ SDK completing its low-level bindings and reaching feature parity
- More connector integrations and runtime hardening
- Web UI enhancements - building on the embedded dashboard
- **Agentic AI** - building on the initial **A2A protocol** support in 0.8.0

---

Thanks to our amazing community and contributors for making Apache Iggy better with every release.

**Join us on [Discord](https://discord.gg/apache-iggy) and help shape the future of the project!**
