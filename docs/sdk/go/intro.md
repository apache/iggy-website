# Go SDK

> The Go SDK, a blocking client speaking the VSR wire protocol over TCP, and which servers it pairs with.

Rendered page: https://iggy.apache.org/docs/sdk/go/intro/

Source: https://github.com/apache/iggy-website/blob/main/content/docs/sdk/go/intro.mdx

The Iggy Go SDK is a client library for interacting with the Iggy server from Go applications. It is a blocking client that speaks the VSR (Viewstamped Replication) wire protocol over TCP, with or without TLS. The package is available on [pkg.go.dev](https://pkg.go.dev/github.com/apache/iggy/foreign/go) and the source code lives in [foreign/go](https://github.com/apache/iggy/tree/master/foreign/go).

## Server compatibility

The SDK and the server must speak the same wire protocol. Tagged releases up to `v0.8.0` predate VSR (and the current API) and pair only with servers of the same era. The module on `master` speaks VSR only and requires a current server. When working from source, build the SDK and the server from the same repository checkout. The code on this page tracks `master`.

## Installation

```bash
go get github.com/apache/iggy/foreign/go
```

`go get` resolves to the latest tagged release. Until a post-VSR release is tagged, track `master` to talk to a current server:

```bash
go get github.com/apache/iggy/foreign/go@master
```

## Quick start

The snippets below follow the [getting-started example](https://github.com/apache/iggy/tree/master/examples/go/getting-started). Stream, topic, and partition IDs are **0-based**: the first partition of a topic is partition `0`.

### Producer

```go
package main

import (
	"context"
	"errors"
	"log"

	"github.com/apache/iggy/foreign/go/client"
	"github.com/apache/iggy/foreign/go/client/tcp"
	iggcon "github.com/apache/iggy/foreign/go/contracts"
	ierror "github.com/apache/iggy/foreign/go/errors"
)

func main() {
	cli, err := client.NewIggyClient(
		client.WithTcp(tcp.WithServerAddress("127.0.0.1:8090")),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := cli.Close(); err != nil {
			log.Printf("Error closing client: %v", err)
		}
	}()

	ctx := context.Background()
	if err := cli.Connect(ctx); err != nil {
		log.Fatal(err)
	}

	if _, err := cli.LoginUser(ctx, "iggy", "iggy"); err != nil {
		log.Fatal(err)
	}

	// Re-running this example is fine: an existing stream or topic is not an error.
	if _, err := cli.CreateStream(ctx, "sample-stream"); err != nil &&
		!errors.Is(err, ierror.ErrStreamNameAlreadyExists) {
		log.Fatal(err)
	}

	streamId, err := iggcon.NewIdentifier("sample-stream")
	if err != nil {
		log.Fatal(err)
	}

	if _, err := cli.CreateTopic(
		ctx,
		streamId,
		"sample-topic",
		1,
		iggcon.CompressionAlgorithmNone,
		iggcon.IggyExpiryNeverExpire,
		0,
	); err != nil && !errors.Is(err, ierror.ErrTopicNameAlreadyExists) {
		log.Fatal(err)
	}

	topicId, err := iggcon.NewIdentifier("sample-topic")
	if err != nil {
		log.Fatal(err)
	}

	message, err := iggcon.NewIggyMessage([]byte("Hello from Go!"))
	if err != nil {
		log.Fatal(err)
	}

	if _, err := cli.SendMessages(
		ctx,
		streamId,
		topicId,
		iggcon.None(),
		[]iggcon.IggyMessage{message},
	); err != nil {
		log.Fatal(err)
	}

	log.Println("Message sent")
}
```

`CreateTopic` accepts optional trailing `iggcon.HeaderEntry` values carrying named topic options, for option keys the server catalog gained after the SDK build shipped. `DescribeOptions` lists the keys a server accepts.

### Consumer

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/apache/iggy/foreign/go/client"
	"github.com/apache/iggy/foreign/go/client/tcp"
	iggcon "github.com/apache/iggy/foreign/go/contracts"
)

func main() {
	cli, err := client.NewIggyClient(
		client.WithTcp(tcp.WithServerAddress("127.0.0.1:8090")),
	)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := cli.Close(); err != nil {
			log.Printf("Error closing client: %v", err)
		}
	}()

	ctx := context.Background()
	if err := cli.Connect(ctx); err != nil {
		log.Fatal(err)
	}

	if _, err := cli.LoginUser(ctx, "iggy", "iggy"); err != nil {
		log.Fatal(err)
	}

	streamId, err := iggcon.NewIdentifier("sample-stream")
	if err != nil {
		log.Fatal(err)
	}
	topicId, err := iggcon.NewIdentifier("sample-topic")
	if err != nil {
		log.Fatal(err)
	}

	offset := uint64(0)
	partitionId := uint32(0)
	consumer := iggcon.DefaultConsumer()

	for {
		polled, err := cli.PollMessages(
			ctx,
			streamId,
			topicId,
			consumer,
			iggcon.OffsetPollingStrategy(offset),
			10,    // messages per batch
			false, // auto-commit
			&partitionId,
		)
		if err != nil {
			log.Fatal(err)
		}

		if len(polled.Messages) == 0 {
			time.Sleep(500 * time.Millisecond)
			continue
		}

		offset += uint64(len(polled.Messages))
		for _, message := range polled.Messages {
			fmt.Printf("Offset: %d, Payload: %s\n",
				message.Header.Offset, string(message.Payload))
		}
	}
}
```

Polled message payloads and user headers alias the reply buffer, so retaining one message pins the whole reply. Copy the bytes out when they outlive the poll.

## TLS

Wrap the TCP options with `tcp.WithTLS`:

```go
cli, err := client.NewIggyClient(
	client.WithTcp(
		tcp.WithServerAddress("iggy.example.com:8090"),
		tcp.WithTLS(
			tcp.WithTLSCAFile("/path/to/ca.pem"),
			tcp.WithTLSDomain("iggy.example.com"),
		),
	),
)
```

`tcp.WithTLSValidateCertificate` controls certificate validation. The client also accepts `client.WithLogger` for a custom `*slog.Logger` and runs a built-in heartbeat loop (every 5 seconds by default) once connected.

## Delivery semantics

`SendMessages` returns the placements the server committed. Delivery is at-least-once. A send whose reply is lost to a dropped connection returns `ErrDisconnected` without a replay: a reconnect registers a fresh client identity, so the server could not deduplicate the replay against a batch that may have already committed. Retrying such a send is the caller's decision and may write the batch twice. Consumers that need exactly-once handling deduplicate on the message id. A confirmation reports an in-memory commit, not a flush to disk, and an empty confirmation list is a valid success.

## Consumer groups

The client exposes the full consumer group API: `CreateConsumerGroup`, `JoinConsumerGroup`, `LeaveConsumerGroup`, `GetConsumerGroups`, and `SyncConsumerGroup` (which returns the partitions this client currently owns together with the group generation). To poll as a group member, build the consumer with `iggcon.NewGroupConsumer` and pass a `nil` partition id to `PollMessages`. The client orchestrates the group poll. An empty batch with no assigned partition means nothing to read right now (a member that owns no partition, or a rebalance still settling): poll again. `ErrConsumerGroupMemberNotFound` means the client is not a member, for example after an explicit `LeaveConsumerGroup`. `JoinConsumerGroup` restores membership.

## Examples

A runnable getting-started example with producer, consumer, and TLS flags lives in [examples/go](https://github.com/apache/iggy/tree/master/examples/go). See the [examples page](/docs/sdk/go/examples) for how to run it.
