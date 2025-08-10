---
id: introduction-about
slug: /introduction/about
title: About
sidebar_position: 1
---

**Iggy** is the persistent message streaming platform written in Rust, supporting [QUIC](https://www.chromium.org/quic/), TCP (custom binary specification) and HTTP (regular REST API) transport protocols, **capable of processing millions of messages per second at the low latency**.

Iggy provides **exceptionally high throughput and performance** while utilizing minimal computing resources.

This is **not yet another extension** running on top of the existing infrastructure, such as Kafka or SQL database.

Iggy is the persistent message streaming log **built from the ground up** using the low lvl I/O for speed and efficiency.

The name is an abbreviation for the Italian Greyhound - small yet extremely fast dogs, the best in their class. See the lovely [Fabio & Cookie](https://www.instagram.com/fabio.and.cookie/) ❤️

![Iggy Server](/img/iggy_server.png)

---

### Features

- **Highly performant**, persistent append-only log for message streaming
- **Very high throughput** for both writes and reads
- **Low latency and predictable resource usage** thanks to the Rust compiled language (no GC)
- **User authentication and authorization** with granular permissions and Personal Access Tokens (PAT)
- Support for multiple streams, topics and partitions
- Support for **multiple transport protocols** (QUIC, TCP, HTTP)
- Fully operational RESTful API which can be optionally enabled
- Available client SDK in multiple languages
- **Works directly with binary data**, avoiding enforced schema and serialization/deserialization overhead
- Custom **zero-copy (de)serialization**, which greatly improves the performance and reduces memory usage.
- Configurable server features (e.g. caching, segment size, data flush interval, transport protocols etc.)
- Server-side storage of **consumer offsets**
- Multiple ways of polling the messages:
  - By offset (using the indexes)
  - By timestamp (using the time indexes)
  - First/Last N messages
  - Next N messages for the specific consumer
- Possibility of **auto committing the offset** (e.g. to achieve *at-most-once* delivery)
- **Consumer groups** providing the message ordering and horizontal scaling across the connected clients
- **Message expiry** with auto deletion based on the configurable **retention policy**
- Additional features such as **server side message deduplication**
- **Multi-tenant** support via abstraction of **streams** which group **topics**
- **TLS** support for all transport protocols (TCP, QUIC, HTTPS)
- **[Connectors](/docs/connectors/introduction)** - sinks, sources and data transformations based on the **custom Rust plugins**
- **[Model Context Protocol](/docs/ai/mcp)** - provide context to LLM with **MCP server**
- Optional server-side as well as client-side **data encryption** using AES-256-GCM
- Optional metadata support in the form of **message headers**
- Optional **data backups and archiving** to disk or **S3** compatible cloud storage (e.g. AWS S3)
- Support for **OpenTelemetry** logs & traces + Prometheus metrics
- Built-in **CLI** to manage the streaming server installable via `cargo install iggy-cli`
- Built-in **benchmarking app** to test the performance
- **Single binary deployment** (no external dependencies)
- Running as a single node (clustering based on Viewstamped Replication will be implemented in the near future)

## Supported languages SDK

- [Rust](https://crates.io/crates/iggy)
- [C#](https://www.nuget.org/packages/Apache.Iggy/)
- Java
- [Python](https://pypi.org/project/apache-iggy/)
- [Node.js (TypeScript)](https://www.npmjs.com/package/apache-iggy)
- [Go](https://pkg.go.dev/github.com/apache/iggy/foreign/go)

C++ and Elixir are work in progress.

## CLI

The brand new, rich, interactive CLI is implemented under the `cli` project, to provide the best developer experience. This is a great addition to the Web UI, especially for all the developers who prefer using the console tools.

Iggy CLI can be installed with `cargo install iggy-cli` and then simply accessed by typing `iggy` in your terminal.

### Web UI

There's a dedicated Web UI for the server, which allows managing the streams, topics, partitions, browsing the messages and so on. This is an ongoing effort to build a comprehensive dashboard for administrative purposes of the Iggy server. Check the Web UI in the `/web` directory. The [docker image for Web UI](https://hub.docker.com/r/iggyrs/iggy-web-ui) is available, and can be fetched via `docker pull iggyrs/iggy-web-ui`.

## Connectors

The highly performant and modular **[runtime](/docs/connectors/runtime)** for statically typed, yet dynamically loaded connectors. Ingest the data from the external sources and push it further to the Iggy streams, or fetch the data from the Iggy streams and push it further to the external sources. **Create your own Rust plugins** by simply implementing either the `Source` or `Sink` trait and **build custom pipelines for the data processing**.

## Model Context Protocol

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) is an open protocol that standardizes how applications provide context to LLMs. The **[Iggy MCP Server](/docs/ai/mcp)** is an implementation of the MCP protocol for the message streaming infrastructure. It can be used to provide context to LLMs in real-time, allowing for more accurate and relevant responses.

### Docker

The official Apache Iggy images can be found in [Docker Hub](https://hub.docker.com/r/apache/iggy), simply type `docker pull apache/iggy` to pull the image.

You can also find the images for all the different tooling such as Connectors, MCP Server etc. [here](https://hub.docker.com/u/apache?page=1&search=iggy).

Please note that the images tagged as `latest` are based on the official, stable releases, while the `edge` ones are updated directly from latest version of the `master` branch.

You can find the `Dockerfile` and `docker-compose` in the root of the repository. To build and start the server, run: `docker compose up`.

Additionally, you can run the `CLI` which is available in the running container, by executing: `docker exec -it iggy-server /iggy`.

Keep in mind that running the container on the OS other than Linux, where the Docker is running in the VM, might result in the performance degradation.


### Version

The official releases follow the regular semver (`0.5.0`) or have `latest` tag applied (`apache/iggy:latest`).

We do also publish edge/dev/nightly releases (e.g. `0.5.0-edge.1` or `apache/iggy:edge`), for both, SDKs and the Docker images, which are typically compatible with the latest changes, but are not guaranteed to be stable, and as the name states, are not recommended for production use.
