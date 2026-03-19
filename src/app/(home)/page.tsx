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
import Image from "next/image";
import type { Metadata } from "next";
import { LandingCodeTabs } from "@/components/code-tabs";
import { BenchmarkSection } from "@/components/benchmark-chart";

export const metadata: Metadata = {
  title: "Apache Iggy (Incubating) — Hyper-Efficient Message Streaming",
  description:
    "Apache Iggy (Incubating) is a high-performance, persistent message streaming platform written in Rust, capable of processing millions of messages per second with ultra-low latency.",
};

const heroStats = [
  {
    value: "Millions",
    label: "Messages/Second/Node",
    gradient: "from-[#f9923f] via-[#5f87fd] to-[#fa5e8a]",
  },
  {
    value: "~1 ms",
    label: "Avg Write Latency",
    gradient: "from-[#5f87fd] to-[#7d44e0]",
  },
  {
    value: "6",
    label: "Language SDKs",
    gradient: "from-[#9d44e0] to-[#e55efa]",
  },
  {
    value: "100%",
    label: "Free & Open Source",
    gradient: "from-[#9d44e0] via-[#9d44e0] to-[#fa5e8a]",
  },
];

const features = [
  {
    title: "Ultra-High Performance",
    description:
      "Process millions of messages per second with predictable low latency thanks to Rust, combined with io_uring and thread-per-core, shared nothing architecture.",
  },
  {
    title: "Zero-Copy Serialization",
    description:
      "Custom zero-copy (de)serialization for improved performance and reduced memory usage, working directly with binary data.",
  },
  {
    title: "Multiple Transport Protocols",
    description:
      "Support for QUIC, TCP, WebSocket, and HTTP protocols with TLS encryption, giving you flexibility in how clients connect.",
  },
  {
    title: "Multi-Language SDKs",
    description:
      "Client libraries available for Rust, C#, Java, Go, Python, Node.js and C++ with more languages coming for best developer experience.",
  },
  {
    title: "Consumer Groups & Partitioning",
    description:
      "Built-in support for consumer groups with cooperative rebalancing, partitioning, and horizontal scaling across connected clients.",
  },
  {
    title: "Security & Access Control",
    description:
      "TLS on all transports, per-stream and per-topic permissions, Personal Access Tokens for programmatic access, optional AES-256-GCM encryption at rest.",
  },
  {
    title: "Built-in Monitoring",
    description:
      "OpenTelemetry logs & traces, Prometheus metrics, and built-in benchmarking tools for performance monitoring.",
  },
  {
    title: "Multi-Tenant Support",
    description:
      "Stream abstraction for multi-tenancy, configurable message retention policies, and tiered storage coming in the future.",
  },
];

const ecosystem = [
  {
    title: "Connectors",
    description: "Dynamically loaded Rust plugins for data integration. Source from PostgreSQL, Elasticsearch, or sink to MongoDB, Elasticsearch, Apache Iceberg, Quickwit. Built-in data transforms.",
    href: "/docs/connectors/introduction",
    color: "#14b8a6",
    tags: ["PostgreSQL", "MongoDB", "Elasticsearch", "Iceberg", "Quickwit"],
  },
  {
    title: "MCP Server",
    description: "Model Context Protocol server exposing 40+ tools for LLM integration. Works with Claude Desktop and other MCP clients via stdio and HTTP transports.",
    href: "/docs/ai/mcp",
    color: "#ec4899",
    tags: ["Claude", "LLM", "40+ tools", "stdio", "HTTP"],
  },
  {
    title: "Web UI",
    description: "SvelteKit dashboard for stream/topic management, message browsing with JSON/string/XML decoders, user management, server logs, and real-time terminal.",
    href: "/docs/web_ui/start",
    color: "#a855f7",
    tags: ["Dashboard", "Message browser", "User mgmt"],
  },
  {
    title: "CLI",
    description: "Full-featured command-line interface with named connection contexts, session-based login, and shell completions for bash/zsh/fish/powershell.",
    href: "/docs/cli/start",
    color: "#6366f1",
    tags: ["Contexts", "Completions", "Login sessions"],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden px-6 pt-8 pb-20"
        style={{
          backgroundImage: `url(/img/hero-main.webp), radial-gradient(circle closest-side at 35% 48%, #ff910314, #070c1700 60%), radial-gradient(circle closest-side at 68% 52%, #111d35, #070c1700 63%), radial-gradient(circle farthest-side at 20% 0%, #0e1f42, #070c17 21%)`,
          backgroundPosition: "50% 29%, 0 0, 0 0, 0 0",
          backgroundRepeat: "no-repeat, repeat, repeat, repeat",
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="mb-6 text-5xl leading-[1.05] font-bold tracking-tight text-[#fffaeb] md:text-7xl lg:text-[clamp(5rem,6vw,7rem)]">
            Hyper-Efficient
            <br />
            <span className="bg-gradient-to-r from-[#f9923f] via-[#5f87fd] to-[#fa5e8a] bg-clip-text text-transparent">
              Message Streaming
            </span>
            <br />
            at Laser Speed
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg font-normal leading-relaxed text-[#aaafb6] md:text-xl">
            Apache Iggy (Incubating) is a high-performance, persistent message
            streaming platform written in Rust, capable of processing{" "}
            <span className="font-medium text-[#ff9103]">
              millions of messages per second
            </span>{" "}
            with ultra-low latency.
          </p>

          {/* Stats Grid */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="p-4 text-center">
                <div
                  className={`bg-gradient-to-r ${stat.gradient} mb-2 bg-clip-text text-3xl font-bold text-transparent md:text-4xl`}
                >
                  {stat.value}
                </div>
                <p className="text-sm text-[#838d95]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mx-auto mt-14 flex max-w-lg flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              href="/docs/introduction/getting-started"
              className="inline-flex items-center rounded-lg bg-[#ff9103] px-8 py-3.5 text-lg font-semibold text-[#0e0f11] transition-colors hover:bg-[#ffa703]"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/apache/iggy"
              target="_blank"
              className="inline-flex items-center gap-2.5 rounded-lg border border-[#ff9103] px-8 py-3.5 text-lg font-light text-[#ff9103] transition-all hover:shadow-[0_0_20px_-3px_#ffa7038a]"
            >
              <Image
                src="/img/gh-icon-orange.svg"
                alt=""
                width={22}
                height={22}
                unoptimized
              />
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Built for performance - with architecture visualization */}
      <section
        className="px-6 py-20"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-side at 50% 10%, #0e1930, #070c17 65%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-[#fffaeb] md:text-5xl">
              Built for <span className="text-[#ff9103]">performance</span>
            </h2>
            <p className="text-lg font-light leading-relaxed text-[#838d95]">
              Designed from the ground up with{" "}
              <span className="text-[#fffaeb]">
                io_uring and thread-per-core, shared nothing architecture
              </span>
              . Each CPU core runs its own shard, pinned and NUMA-aware.
              No locks on the hot path, no GC pauses, no thread contention.
            </p>
          </div>

          {/* Architecture visualization */}
          <div className="mb-14">
            <BenchmarkSection />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#ff9103]/30 hover:bg-[#18213a]/50"
              >
                <h3 className="mb-3 text-lg font-semibold text-[#d6d7d7] transition-colors group-hover:text-[#fffaeb]">
                  {feature.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[#838d95]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + code examples */}
      <section
        className="px-6 py-20"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-side at 30% 80%, #1a100820, #070c17 50%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-[#fffaeb] md:text-5xl">
              How it <span className="text-[#ff9103]">works</span>
            </h2>
            <p className="text-lg font-light leading-relaxed text-[#838d95]">
              Messages flow from producers through streams and topics into
              partitioned, append-only segment files on disk. Pick your language
              and start streaming in minutes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Producers send messages",
                  desc: "Connect via TCP, QUIC, WebSocket or HTTP. Messages are routed to the target partition using balanced, key-based or explicit partitioning.",
                },
                {
                  step: "2",
                  title: "Shard receives and buffers",
                  desc: "Each partition is owned by exactly one CPU-pinned shard. Messages are buffered in a memory journal, then flushed to disk via vectored I/O through io_uring.",
                },
                {
                  step: "3",
                  title: "Segments store on disk",
                  desc: "Data lands in append-only .log files with .index files for offset and timestamp lookups. Segments are sealed at 1 GiB and rotated automatically.",
                },
                {
                  step: "4",
                  title: "Consumers poll at any offset",
                  desc: "Read from the beginning, a specific offset, a timestamp, or continue from the last committed position. Consumer groups distribute partitions for horizontal scaling.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff9103]/10 text-[#ff9103] text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#fffaeb] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm font-light leading-relaxed text-[#838d95] m-0">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <LandingCodeTabs />
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section
        className="px-6 py-20"
        style={{
          backgroundImage:
            "radial-gradient(circle farthest-side at 50% 90%, #1a1008, #070c17 65%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-5 text-4xl font-bold tracking-tight text-[#fffaeb] md:text-5xl">
              Complete <span className="text-[#ff9103]">ecosystem</span>
            </h2>
            <p className="text-lg font-light leading-relaxed text-[#838d95]">
              Iggy is more than a server. Integrate with external systems, manage
              everything from your browser or terminal, and connect LLMs to your
              streaming infrastructure.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {ecosystem.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#ff9103]/30 hover:bg-[#18213a]/50 no-underline"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <h3 className="text-xl font-semibold text-[#fffaeb] m-0">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm font-light leading-relaxed text-[#838d95] mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#aaafb6] border border-white/[0.08]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-[#3d4450] px-6 py-14"
        style={{ backgroundColor: "#070c17" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#ff9103] uppercase">
                Docs
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/docs"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#ff9103] uppercase">
                Community
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="https://www.linkedin.com/company/apache-iggy/"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.gg/apache-iggy"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://x.com/ApacheIggy"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    X
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bsky.app/profile/iggy.rs"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    Bluesky
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-[#ff9103] uppercase">
                More
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/blogs"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/apache/iggy"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://benchmarks.iggy.apache.org"
                    className="text-[#838d95] transition-colors hover:text-[#fffaeb]"
                  >
                    Benchmarks
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-[#3d4450] pt-8 text-xs leading-relaxed text-[#636b75]">
            <p>
              Apache Iggy is an effort undergoing incubation at The Apache
              Software Foundation (ASF), sponsored by the Apache Incubator.
              Incubation is required of all newly accepted projects until a
              further review indicates that the infrastructure, communications,
              and decision making process have stabilized in a manner consistent
              with other successful ASF projects. While incubation status is not
              necessarily a reflection of the completeness or stability of the
              code, it does indicate that the project has yet to be fully
              endorsed by the ASF.
            </p>
            <p className="mt-4">
              Copyright &copy; {new Date().getFullYear()} The Apache Software
              Foundation, Licensed under the Apache License, Version 2.0.
            </p>
            <p className="mt-4">
              Apache&reg;, the names of Apache projects, and the feather logo
              are either registered trademarks or trademarks of the Apache
              Software Foundation in the United States and/or other countries.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
