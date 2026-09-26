# Introduction

> What the Iggy server does, and where its releases and Docker images are published.

Rendered page: https://iggy.apache.org/docs/server/introduction/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/server/introduction.mdx

Docs version: server 0.9.0, Rust SDK 0.11.0, CLI 0.14.0, Node.js SDK 0.10.0, and the Python, Java, Go and C# SDKs at 0.9.0

Iggy server is the most important part of the system as it's responsible for handling all the incoming connections, managing the data and providing the API for the clients. The server is written in Rust. It uses `io_uring` on Linux and a polling backend on macOS.

**Diagram: The Iggy server and what connects to it.** The Iggy server uses thread-per-core with io_uring on Linux, and listens on TCP port 8090, QUIC port 8080, HTTP port 3000 and WebSocket port 8092. Around it are producers (send messages), consumers (poll messages), consumer groups (horizontal scaling), the [Web UI](https://iggy.apache.org/docs/web_ui/start), the [CLI](https://iggy.apache.org/docs/cli/start), the [MCP server](https://iggy.apache.org/docs/ai/mcp) for LLM integration, [connectors](https://iggy.apache.org/docs/connectors/introduction) (sources and sinks) and [benchmarks](https://iggy.apache.org/docs/server/benchmarking) (iggy-bench). SDKs: Rust, Python, Java, Go, Node.js, C#, C++ and PHP. Security: TLS, Argon2id, AES-256-GCM and role-based access control. Observability: Prometheus and OpenTelemetry.

The releases are published to GitHub and can be found [here](https://github.com/apache/iggy/tags). The official Docker images can be found [here](https://hub.docker.com/r/apache/iggy), use `docker pull apache/iggy:0.9.0`, or `apache/iggy:latest` for the newest stable release.

If you compile the source code in release mode, linking takes longer because [LTO](https://doc.rust-lang.org/cargo/reference/profiles.html#lto) is enabled in the `[profile.release]` section of the workspace [Cargo.toml](https://github.com/apache/iggy/blob/master/Cargo.toml).

## System requirements

The server uses `io_uring` on Linux, which sets a minimum kernel version.

- **Linux kernel 5.19 or newer is required.** The shard executors create their rings with `IORING_SETUP_COOP_TASKRUN` and `IORING_SETUP_TASKRUN_FLAG`, which older kernels reject, and the server refuses to start rather than run without them. Check yours with `uname -r`.
- **Kernel 6.1 or newer is worth having.** It is the first version with the `kernel.io_uring_disabled` sysctl, so the startup diagnostics can tell you io_uring was disabled by policy instead of failing obscurely. See [Linux tuning](https://iggy.apache.org/docs/server/linux-tuning#runtime-access-and-process-limits).
- **Ubuntu 22.04 LTS ships 5.15 and will not run the server.** Its hardware enablement kernel is new enough, and so are Ubuntu 24.04 LTS and Debian 12 as they ship.
- **WSL2 often ships incomplete `io_uring`**, missing setup flags or operations even on a kernel that reports 5.19 or newer. Run `wsl --update` first.
- **macOS uses a polling backend** rather than `io_uring`, so this requirement does not apply there.

Containers use the host's kernel, so it is the host that has to meet this requirement. See [Docker & Helm](https://iggy.apache.org/docs/server/docker#why-these-capabilities).

## Running the server

One `iggy-server` binary serves both the single-node and the clustered deployment. The loaded configuration decides which one you get. The server accepts these startup flags, plus `--help` and `--version`:

| Flag | Purpose |
|------|---------|
| `--fresh` | Delete the data directory before starting. **This wipes all data** on that node. |
| `--with-default-root-credentials` | Set the root credentials to `iggy`/`iggy` on first start, unless `IGGY_ROOT_USERNAME`/`IGGY_ROOT_PASSWORD` are already set. Development only. |
| `--replica-id <N>` | Select this node's entry in `cluster.nodes`. Required when `cluster.enabled = true`. See [Clustering](https://iggy.apache.org/docs/clustering/vsr). |

Configuration comes from the TOML file named by `IGGY_CONFIG_PATH`, or `core/server/config.toml` relative to the working directory. If that file is missing, the server uses the defaults embedded in the binary. Any key can be overridden with an `IGGY_`-prefixed environment variable, and a `.env` file in the working directory or its parents (or the file named by `IGGY_ENV_PATH`) is loaded at startup. See [Configuration](https://iggy.apache.org/docs/server/configuration) for the full reference.

When no root credentials are provided on the first single-node start, the server generates a random root password and prints it to the log. That's the *only* time it can be read.

The HTTP API endpoints can be found in [server.http](https://github.com/apache/iggy/blob/master/core/server/server.http) file, which can be used with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension for VS Code.

In order to see the detailed logs from the server, run it with `RUST_LOG=trace` environment variable.

To seed the example data, start a development server with known credentials from the root of the repository:

```bash
cargo run --bin iggy-server -- --fresh --with-default-root-credentials
```

In another terminal at the repository root:

```bash
cargo run --bin data-seeder-tool
```

The seeder logs in as `iggy`/`iggy` by default. Pass `--username` and `--password` to use other credentials.

## Authentication

For broker API commands, only the ping liveness probe and the login handshake itself (username/password, personal access token, or HTTP token refresh, all of which prove a credential) are served without an authenticated session. Every other request requires one and is subject to [permissions](https://iggy.apache.org/docs/server/security): fetching server stats, for example, needs the `read_servers` permission (the root user has it), and even the Prometheus `/metrics` scrape **must present a bearer credential**. A stateful connection authenticates by logging in with the user's credentials or personal access token. Logout, disconnection, or heartbeat eviction releases its session. Over the HTTP API, authentication is done by providing the `Authorization` header with a `Bearer` JWT or personal access token. HTTP CORS preflight responses and embedded `/ui` static assets are public; the UI's broker API calls still require authentication.
