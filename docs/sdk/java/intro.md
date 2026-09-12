# Java SDK

> The Java SDK, with blocking and CompletableFuture clients over TCP, and which servers they pair with.

Rendered page: https://iggy.apache.org/docs/sdk/java/intro/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/java/intro.mdx

The Iggy Java SDK is a client library for interacting with the Iggy server from Java applications. It provides a blocking client and an async client (based on `CompletableFuture`) over TCP, plus a blocking HTTP client. The artifact is published to [Maven Central](https://central.sonatype.com/artifact/org.apache.iggy/iggy) and the source code lives in [foreign/java](https://github.com/apache/iggy/tree/master/foreign/java).

## Server compatibility

The TCP transport speaks the VSR (Viewstamped Replication) wire protocol. The SDK and the server must speak the same protocol: the latest published artifact (`0.6.0`) predates VSR and only pairs with servers of the same era, while the SDK on `master` requires a current server. When working from source, build the SDK and the server from the same repository checkout. The code on this page tracks `master`.

## Installation

### Maven

```xml
<dependency>
    <groupId>org.apache.iggy</groupId>
    <artifactId>iggy</artifactId>
    <version>0.6.0</version>
</dependency>
```

### Gradle

```groovy
implementation 'org.apache.iggy:iggy:0.6.0'
```

Check [Maven Central](https://central.sonatype.com/artifact/org.apache.iggy/iggy) for the latest published version. Snapshot builds are available from the [ASF snapshot repository](https://repository.apache.org/content/repositories/snapshots/).

## Quick start

The snippets below follow the [getting-started example](https://github.com/apache/iggy/tree/master/examples/java/src/main/java/org/apache/iggy/examples/gettingstarted). Stream, topic, and partition IDs are **0-based**: the first partition of a topic is partition `0`.

### Producer

```java
import org.apache.iggy.client.blocking.tcp.IggyTcpClient;
import org.apache.iggy.identifier.StreamId;
import org.apache.iggy.identifier.TopicId;
import org.apache.iggy.message.Message;
import org.apache.iggy.message.Partitioning;
import org.apache.iggy.topic.CompressionAlgorithm;
import java.math.BigInteger;
import java.util.List;

public class Producer {

    static final String STREAM_NAME = "sample-stream";
    static final StreamId STREAM_ID = StreamId.of(STREAM_NAME);
    static final String TOPIC_NAME = "sample-topic";
    static final TopicId TOPIC_ID = TopicId.of(TOPIC_NAME);

    public static void main(String[] args) {
        try (var client = IggyTcpClient.builder()
                .host("127.0.0.1")
                .port(8090)
                .credentials("iggy", "iggy")
                .buildAndLogin()) {

            // Re-running this example is fine: only create what is missing.
            if (client.streams().getStream(STREAM_ID).isEmpty()) {
                client.streams().createStream(STREAM_NAME);
            }
            if (client.topics().getTopic(STREAM_ID, TOPIC_ID).isEmpty()) {
                client.topics().createTopic(
                        STREAM_ID,
                        1L,
                        CompressionAlgorithm.None,
                        BigInteger.ZERO,
                        BigInteger.ZERO,
                        TOPIC_NAME);
            }

            Partitioning partitioning = Partitioning.partitionId(0L);
            for (int i = 0; i < 10; i++) {
                String payload = "message-" + i;
                client.messages().sendMessages(
                        STREAM_ID,
                        TOPIC_ID,
                        partitioning,
                        List.of(Message.of(payload)));
                System.out.println("Sent: " + payload);
            }
        }
    }
}
```

`createTopic` also has an overload with a trailing `Map<String, HeaderValue>` of named topic options, for option keys the server catalog gained after the SDK build shipped.

### Consumer

```java
import org.apache.iggy.client.blocking.tcp.IggyTcpClient;
import org.apache.iggy.consumergroup.Consumer;
import org.apache.iggy.identifier.StreamId;
import org.apache.iggy.identifier.TopicId;
import org.apache.iggy.message.Message;
import org.apache.iggy.message.PolledMessages;
import org.apache.iggy.message.PollingStrategy;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

public class SampleConsumer {

    static final StreamId STREAM_ID = StreamId.of("sample-stream");
    static final TopicId TOPIC_ID = TopicId.of("sample-topic");

    public static void main(String[] args) {
        try (var client = IggyTcpClient.builder()
                .host("127.0.0.1")
                .port(8090)
                .credentials("iggy", "iggy")
                .buildAndLogin()) {

            BigInteger offset = BigInteger.ZERO;
            Consumer consumer = Consumer.of(0L);

            while (true) {
                PolledMessages polledMessages = client.messages().pollMessages(
                        STREAM_ID,
                        TOPIC_ID,
                        Optional.of(0L),
                        consumer,
                        PollingStrategy.offset(offset),
                        10L,
                        false);

                if (polledMessages.messages().isEmpty()) {
                    break;
                }
                for (Message message : polledMessages.messages()) {
                    String payload = new String(message.payload(), StandardCharsets.UTF_8);
                    System.out.printf("Offset: %d, Payload: %s%n", message.header().offset(), payload);
                }
                offset = offset.add(BigInteger.valueOf(polledMessages.messages().size()));
            }
        }
    }
}
```

## Client types and configuration

`org.apache.iggy.Iggy` is the unified entrypoint for building clients. `Iggy.tcpClientBuilder().blocking()` returns the same builder as `IggyTcpClient.builder()` used above.

```java
import org.apache.iggy.Iggy;

// Blocking TCP client
var client = Iggy.tcpClientBuilder()
    .blocking()
    .host("localhost")
    .port(8090)
    .credentials("iggy", "iggy")
    .buildAndLogin();

// Async TCP client (CompletableFuture-based)
var asyncClient = Iggy.tcpClientBuilder()
    .async()
    .host("localhost")
    .port(8090)
    .credentials("iggy", "iggy")
    .buildAndLogin()
    .join();

// Blocking HTTP client
var httpClient = Iggy.httpClientBuilder()
    .blocking()
    .url("http://localhost:3000")
    .credentials("iggy", "iggy")
    .buildAndLogin();
```

The TCP builder also accepts TLS and resilience options:

```java
import java.time.Duration;
import org.apache.iggy.config.RetryPolicy;

var client = Iggy.tcpClientBuilder()
    .blocking()
    .host("iggy.example.com")
    .port(8090)
    .enableTls()
    .tlsCertificate("/path/to/ca.pem")   // optional custom CA
    .connectionTimeout(Duration.ofSeconds(10))
    .requestTimeout(Duration.ofSeconds(30))
    .retryPolicy(RetryPolicy.exponentialBackoff())
    .credentials("iggy", "iggy")
    .buildAndLogin();
```

Beyond streams, topics, and messages, the client exposes consumer groups, partitions, users, and personal access tokens through `client.consumerGroups()`, `client.partitions()`, `client.users()`, and `client.personalAccessTokens()`. All SDK exceptions inherit from `IggyException`.

## Examples

Runnable examples covering the async client, message headers and envelopes, multi-tenant setups, and TLS live in [examples/java](https://github.com/apache/iggy/tree/master/examples/java). See the [examples page](/docs/sdk/java/examples) for how to run them.
