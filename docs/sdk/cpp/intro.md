# C++ SDK (WIP)

> The C++ SDK, a CXX bridge over the Rust SDK, and how to build it from source with Bazel.

Rendered page: https://iggy.apache.org/docs/sdk/cpp/intro/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/cpp/intro.mdx

The Iggy C++ SDK wraps the Rust SDK through a [CXX](https://cxx.rs) FFI bridge, so it can use all transport protocols (TCP, QUIC, HTTP, WebSocket) via connection strings. The source code is available at [github.com/apache/iggy/tree/master/foreign/cpp](https://github.com/apache/iggy/tree/master/foreign/cpp).

This SDK isn't published to any package registry. Consume it from the monorepo and build it from source with Bazel.

## Building from source

The project builds with Bazel (`BUILD.bazel` / `MODULE.bazel`). The build drives the system-provided cargo toolchain to compile the Rust bridge, so concurrent runs can race. Run builds serially.

```bash
cd foreign/cpp

# Build the library
bazel build //:iggy-cpp

# Unit tests
bazel test //:unit

# Low-level integration tests (require a running server)
bazel test //:e2e
```

## Quick start

The snippet below mirrors the SDK's own end-to-end tests in `foreign/cpp/tests/e2e`:

```cpp
#include "lib.rs.h"

#include <cstdint>
#include <iostream>
#include <string>

iggy::ffi::Identifier id(const std::string &name) {
    iggy::ffi::Identifier identifier;
    identifier.set_string(name);
    return identifier;
}

iggy::ffi::Identifier numeric_id(const std::uint32_t value) {
    iggy::ffi::Identifier identifier;
    identifier.set_numeric(value);
    return identifier;
}

rust::Vec<std::uint8_t> payload(const std::string &text) {
    rust::Vec<std::uint8_t> bytes;
    for (const char c : text) {
        bytes.push_back(static_cast<std::uint8_t>(c));
    }
    return bytes;
}

int main() {
    // Empty string = TCP to the default local address. Connection strings
    // (iggy://..., iggy+quic://..., ...) are also accepted.
    iggy::ffi::Client *client = iggy::ffi::new_connection("");
    client->connect();
    client->login_user("iggy", "iggy");

    client->create_stream("my-stream");

    // (stream, name, partitions, compression, expiry kind, expiry value,
    //  max topic size, extra options)
    client->create_topic(id("my-stream"), "my-topic", 1, "none",
                         "server_default", 0, "server_default", {});

    rust::Vec<iggy::ffi::IggyMessageToSend> messages;
    for (int i = 0; i < 10; i++) {
        messages.push_back(iggy::ffi::make_message(
            payload("message-" + std::to_string(i)), {}));
    }
    client->send_messages(id("my-stream"), id("my-topic"), "balanced", {},
                          std::move(messages));

    // Partition ids are 0-based: 0 is the first partition.
    auto polled = client->poll_messages(id("my-stream"), id("my-topic"), 0,
                                        "consumer", numeric_id(1),
                                        "offset", 0, 10, false);
    for (const auto &message : polled.messages) {
        std::string text(message.payload.begin(), message.payload.end());
        std::cout << "Offset: " << message.offset << ", Payload: " << text
                  << std::endl;
    }

    iggy::ffi::delete_client(client);
    return 0;
}
```

Polling strategies are selected by kind string: `offset`, `timestamp`, `first`, `last`, or `next`. Partitioning kinds for sending are `balanced`, `partition_id`, and `messages_key`.

## Connection strings

The C++ SDK supports the same connection string format as the Rust SDK:

```
iggy://user:pass@host:port           (TCP, default)
iggy+quic://user:pass@host:port      (QUIC)
iggy+http://user:pass@host:port      (HTTP)
iggy+ws://user:pass@host:port        (WebSocket)
```

When an empty string or plain address is passed to `new_connection()`, it defaults to TCP.

## Helper types

Beyond the generated `lib.rs.h` FFI surface, `foreign/cpp/include/iggy.hpp` ships typed C++ helpers: `CompressionAlgorithm`, `MaxTopicSize`, `Expiry`, `PollingStrategy`, `IdKind`, `TopicOption`, `SnapshotCompression`, and `SystemSnapshotType`, plus the `IggyException` error type. They construct and validate the kind strings and values the raw FFI calls expect.

## Current status

The FFI bridge exposes the full command-level client: streams, topics, partitions, and segments; message sending and polling with user headers; consumer groups and consumer offsets; stats, client info, and cluster metadata; snapshots; permission updates and password changes; topic option discovery (`describe_options`); and raw binary requests (`send_binary_request`).

Not yet exposed: the high-level `Producer`/`Consumer` wrappers and user management (create/get/update/delete users, personal access tokens). Contributions are welcome.
