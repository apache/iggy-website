/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import {
  BenchmarkArt,
  BinaryArt,
  ClientEncryptionArt,
  ClusterArt,
  ConnectionStringArt,
  ConnectorsArt,
  ConsumerGroupArt,
  DeferredPollingArt,
  DurabilityArt,
  FailoverArt,
  HeadersArt,
  HierarchyArt,
  IdempotentArt,
  IdentityArt,
  KafkaGatewayArt,
  KeyRotationArt,
  MetricsArt,
  MultiLeaderArt,
  PartitioningArt,
  PollingArt,
  ReplicationArt,
  RetentionArt,
  SdksArt,
  SecurityArt,
  SegmentsArt,
  ShardsArt,
  SimulationArt,
  ToolingArt,
  ZeroCopyArt,
} from "@/components/feature-illustrations";
import {
  benchmarkStats,
  CONSUMER_BENCHMARK_URL,
  PRODUCER_BENCHMARK_URL,
} from "@/lib/benchmark";

export const metadata: Metadata = {
  title: "Features",
  description:
    "What Apache Iggy provides: a thread-per-core streaming server, built-in clustering, security, SDKs in nine languages, a Kafka gateway, connectors and tooling.",
};

type DocLink = {
  label: string;
  href: string;
};

type Panel = {
  title: string;
  description: string;
  links: DocLink[];
  art: ReactNode;
};

type Feature = {
  title: string;
  description: string;
  href: string;
  art: ReactNode;
};

type FeatureGroup = {
  id: string;
  title: string;
  summary?: string;
  accent: string;
  panels: Panel[];
  features: Feature[];
};

const groups: FeatureGroup[] = [
  {
    id: "performance",
    title: "Performance",
    summary:
      "Iggy is a streaming log written in Rust. It does not run on top of another broker or database.",
    accent: "#ff9103",
    panels: [
      {
        title: "Thread-per-core, shared-nothing server",
        description:
          "Each shard has its own single-threaded io_uring runtime. Shards can be pinned to cores, with NUMA-aware allocation.",
        links: [
          { label: "Architecture", href: "/docs/introduction/architecture" },
        ],
        art: <ShardsArt />,
      },
      {
        title: "Segmented append-only log",
        description:
          "Messages are stored in append-only segment files with offset and timestamp indexes, and each topic sets its own segment size.",
        links: [
          { label: "Storage engine", href: "/docs/server/storage-engine" },
        ],
        art: <SegmentsArt />,
      },
    ],
    features: [
      {
        title: "Zero-copy binary messages",
        description:
          "Iggy works directly with binary payloads and enforces no schema. Custom zero-copy serialization and a pooled buffer allocator reduce copying and memory use.",
        href: "/docs/introduction/architecture",
        art: <ZeroCopyArt />,
      },
      {
        title: "Open benchmarks",
        description:
          "A built-in benchmarking tool measures throughput and latency on your own hardware. Results are published on the public benchmarks dashboard.",
        href: "/docs/server/benchmarking",
        art: <BenchmarkArt />,
      },
    ],
  },
  {
    id: "streaming",
    title: "Streaming model",
    summary:
      "Producers append messages to partitions, and consumers read them from any position.",
    accent: "#5f87fd",
    panels: [
      {
        title: "Streams, topics and partitions",
        description:
          "Streams group topics, and topics split into partitions. A stream can act as a tenant boundary with its own permissions and encryption key.",
        links: [{ label: "Concepts", href: "/docs/introduction/concepts" }],
        art: <HierarchyArt />,
      },
      {
        title: "Consumer groups",
        description:
          "A consumer group distributes the partitions of a topic across its connected clients. Ordering is kept per partition, and rebalancing is cooperative.",
        links: [{ label: "Concepts", href: "/docs/introduction/concepts" }],
        art: <ConsumerGroupArt />,
      },
    ],
    features: [
      {
        title: "Polling from any position",
        description:
          "Read by offset, by timestamp, from the first or last messages, or from the next message for a consumer. The server stores consumer offsets, with optional auto-commit.",
        href: "/docs/sdk/introduction",
        art: <PollingArt />,
      },
      {
        title: "Deferred polling",
        description:
          "The server can hold a read until enough messages are available or the wait ends. Clients do not have to keep polling an empty partition.",
        href: "/docs/sdk/deferred-polling",
        art: <DeferredPollingArt />,
      },
      {
        title: "Retention per topic",
        description:
          "Each topic sets its own message expiry and maximum size. The server can delete the oldest sealed segments once either limit is passed.",
        href: "/docs/server/topic-options",
        art: <RetentionArt />,
      },
      {
        title: "Partitioning strategies",
        description:
          "A producer sends to an explicit partition, balances messages across partitions, or routes by message key.",
        href: "/docs/sdk/introduction",
        art: <PartitioningArt />,
      },
      {
        title: "Message headers",
        description:
          "Each message can carry optional headers that hold metadata.",
        href: "/docs/introduction/concepts",
        art: <HeadersArt />,
      },
    ],
  },
  {
    id: "clustering",
    title: "Clustering and durability",
    summary:
      "Replication is part of the server. A single node is the default, and a cluster is enabled in the configuration.",
    accent: "#14b8a6",
    panels: [
      {
        title: "Built-in VSR clustering",
        description:
          "Iggy replicates with Viewstamped Replication Revisited. Writes commit on a quorum, and the cluster elects a new primary when the current one fails.",
        links: [
          { label: "Viewstamped Replication", href: "/docs/clustering/vsr" },
        ],
        art: <ClusterArt />,
      },
      {
        title: "Multi-leader partitions",
        description:
          "Each partition has its own consensus group. Partition primaries are spread across the nodes, so different nodes lead different partitions at the same time.",
        links: [
          {
            label: "Multi-leader partitions",
            href: "/docs/clustering/multi-leader",
          },
        ],
        art: <MultiLeaderArt />,
      },
    ],
    features: [
      {
        title: "Replication factor per topic",
        description:
          "When a topic is created, it chooses how many nodes store each of its partitions.",
        href: "/docs/clustering/multi-leader",
        art: <ReplicationArt />,
      },
      {
        title: "Durability per topic",
        description:
          "A topic selects what an acknowledged write guarantees: replicated waits for the consensus commit, and persisted also requires copies on stable storage at the quorum.",
        href: "/docs/server/durability",
        art: <DurabilityArt />,
      },
      {
        title: "Idempotent producers",
        description:
          "Opt-in for the Rust high-level producer and the Kafka gateway. A partition recognizes a retried batch it has already accepted and does not append it again.",
        href: "/docs/sdk/idempotent-producers",
        art: <IdempotentArt />,
      },
      {
        title: "Client failover",
        description:
          "The SDKs discover the metadata primary and each partition primary, route requests to them, and reconnect after a failure.",
        href: "/docs/clustering/client-failover",
        art: <FailoverArt />,
      },
      {
        title: "Deterministic simulation testing",
        description:
          "A deterministic simulator tests consensus under failures, delays and network partitions.",
        href: "/docs/clustering/vsr",
        art: <SimulationArt />,
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    summary:
      "Authentication, authorization and encryption are built into the server.",
    accent: "#9d44e0",
    panels: [
      {
        title: "Users, permissions and encryption",
        description:
          "Clients log in with a username and password or a personal access token. Permissions are granted globally, per stream or per topic. TCP, QUIC, WebSocket and HTTP all support TLS, and each encrypted stream has its own AES-256-GCM-SIV key.",
        links: [{ label: "Security", href: "/docs/server/security" }],
        art: <SecurityArt />,
      },
    ],
    features: [
      {
        title: "External identity",
        description:
          "An authentication callout delegates unknown-user logins to your own HTTP service. The HTTP API can also accept JWTs from trusted external issuers.",
        href: "/docs/server/external-authentication",
        art: <IdentityArt />,
      },
      {
        title: "Encryption key rotation",
        description:
          "The server key that wraps the stream keys can be rotated without re-encrypting messages.",
        href: "/docs/server/stream-options",
        art: <KeyRotationArt />,
      },
      {
        title: "Client-side encryption",
        description:
          "A client can encrypt message payloads with AES-256-GCM before they are sent.",
        href: "/docs/introduction/about",
        art: <ClientEncryptionArt />,
      },
    ],
  },
  {
    id: "clients",
    title: "Clients and protocols",
    accent: "#fa5e8a",
    panels: [
      {
        title: "Nine SDKs, four transports",
        description:
          "Client SDKs are available for Rust, C#, Java, Python, Node.js, Go, PHP, C++ and Swift. The server accepts QUIC, TCP and WebSocket connections on its binary protocol, and offers a REST API over HTTP.",
        links: [
          { label: "SDKs", href: "/docs/sdk/introduction" },
          { label: "Networking", href: "/docs/server/networking" },
        ],
        art: <SdksArt />,
      },
      {
        title: "Kafka gateway",
        description:
          "A separate gateway service accepts Kafka producers, consumers and admin clients and stores their data in Iggy. It is not a complete Kafka broker, and transactions are unsupported.",
        links: [{ label: "Kafka gateway", href: "/docs/gateways/kafka" }],
        art: <KafkaGatewayArt />,
      },
    ],
    features: [
      {
        title: "Connection strings",
        description:
          "A connection string sets the transport, credentials, server address and options in a single URL, and every SDK accepts one.",
        href: "/docs/sdk/connection-strings",
        art: <ConnectionStringArt />,
      },
    ],
  },
  {
    id: "ecosystem",
    title: "Ecosystem and operations",
    summary: "Tools for moving data in and out of Iggy and for running it.",
    accent: "#ff9103",
    panels: [
      {
        title: "Connectors",
        description:
          "The connector runtime loads sinks and sources as Rust plugins, with built-in transforms. Sinks include PostgreSQL, Elasticsearch, Apache Iceberg and S3, and sources include PostgreSQL, MQTT and HTTP.",
        links: [{ label: "Connectors", href: "/docs/connectors/introduction" }],
        art: <ConnectorsArt />,
      },
      {
        title: "MCP server, CLI and Web UI",
        description:
          "A Model Context Protocol server exposes more than 40 tools for streams, topics, messages, consumer groups and users. The iggy command manages a server from the terminal, and the Web UI dashboard manages streams, topics and partitions and browses messages.",
        links: [
          { label: "MCP server", href: "/docs/ai/mcp" },
          { label: "CLI", href: "/docs/cli/start" },
          { label: "Web UI", href: "/docs/web_ui/start" },
        ],
        art: <ToolingArt />,
      },
    ],
    features: [
      {
        title: "Prometheus metrics",
        description:
          "The server exports Prometheus metrics on its HTTP API. Prometheus or an OpenTelemetry collector can scrape them.",
        href: "/docs/server/monitoring",
        art: <MetricsArt />,
      },
      {
        title: "Single binary",
        description:
          "The server is a single binary with no external broker or database. Docker images and Helm charts are provided.",
        href: "/docs/server/docker",
        art: <BinaryArt />,
      },
    ],
  },
];

const linkClass = "text-sm font-semibold text-fd-primary hover:underline";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
            Features
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
            Apache Iggy&trade; is a persistent message streaming platform
            written in Rust. It supports the QUIC, TCP, WebSocket and HTTP
            transports and can process millions of messages per second.
          </p>
          <nav
            aria-label="Feature groups"
            className="mt-8 flex flex-wrap gap-2"
          >
            {groups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="inline-flex items-center rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
              >
                {group.title}
              </a>
            ))}
          </nav>
        </header>

        <section
          aria-label="Benchmark results"
          className="mb-20 rounded-3xl border border-fd-border bg-fd-card p-6 md:p-8"
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-5">
            {benchmarkStats(2).map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-2">
                  <span className="text-3xl font-extrabold tracking-tight text-fd-foreground md:text-4xl">
                    {stat.value}
                  </span>{" "}
                  <span className="text-sm font-semibold text-fd-muted-foreground">
                    {stat.unit}
                  </span>
                  <span className="mt-1 block text-xs text-fd-muted-foreground">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-fd-border pt-5 text-sm text-fd-muted-foreground">
            <span>From the published benchmark runs.</span>
            <Link
              href={PRODUCER_BENCHMARK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Producer result →
            </Link>
            <Link
              href={CONSUMER_BENCHMARK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Consumer result →
            </Link>
          </p>
        </section>

        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="mb-20 scroll-mt-24"
            style={{ "--fi": group.accent } as CSSProperties}
          >
            <h2 className="text-3xl font-bold tracking-tight text-fd-foreground">
              {group.title}
            </h2>
            {group.summary && (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
                {group.summary}
              </p>
            )}

            <div className="mt-8 space-y-6">
              {group.panels.map((panel, index) => (
                <article
                  key={panel.title}
                  className="grid items-center gap-8 rounded-3xl border p-8 md:grid-cols-2 md:gap-12 md:p-12"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--fi) 9%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--fi) 28%, transparent)",
                  }}
                >
                  <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                    <h3 className="text-2xl font-bold tracking-tight text-fd-foreground">
                      {panel.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-fd-muted-foreground">
                      {panel.description}
                    </p>
                    <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                      {panel.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={linkClass}
                        >
                          {link.label} docs →
                        </Link>
                      ))}
                    </p>
                  </div>
                  <div className="mx-auto w-full max-w-md">{panel.art}</div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.features.map((feature) => (
                <article
                  key={feature.title}
                  className="flex flex-col rounded-3xl border border-fd-border bg-fd-card p-6"
                >
                  <div className="mx-auto w-full max-w-xs">{feature.art}</div>
                  <h3 className="mt-5 text-lg font-semibold text-fd-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-fd-muted-foreground">
                    {feature.description}
                  </p>
                  <Link
                    href={feature.href}
                    aria-label={`${feature.title} docs`}
                    className={`mt-4 ${linkClass}`}
                  >
                    Docs →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl border border-fd-border bg-fd-card p-8 md:p-10">
          <h2 className="text-2xl font-bold text-fd-foreground">
            Ready to start?
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/docs/introduction/quickstart"
              className="inline-flex items-center rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/powered-by"
              className="inline-flex items-center rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
            >
              See who uses Iggy
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
