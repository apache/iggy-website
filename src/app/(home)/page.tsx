import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

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
    value: "< 1 ms",
    label: "Latency @ P99",
    gradient: "from-[#5f87fd] to-[#7d44e0]",
  },
  {
    value: "6+",
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
      "Client libraries available for Rust, C#, Java, Go, Python and Node.js with more languages coming for best developer experience.",
  },
  {
    title: "Consumer Groups & Partitioning",
    description:
      "Built-in support for consumer groups, partitioning, and horizontal scaling across connected clients.",
  },
  {
    title: "Security & Authentication",
    description:
      "User authentication and authorization with granular permissions, Personal Access Tokens, and optional data encryption.",
  },
  {
    title: "Built-in Monitoring",
    description:
      "OpenTelemetry logs & traces, Prometheus metrics, and built-in benchmarking tools for performance monitoring.",
  },
  {
    title: "Multi-Tenant Support",
    description:
      "Stream abstraction for multi-tenancy, message retention policies, and S3-compatible backup storage.",
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

      {/* Features Section */}
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
              Apache Iggy (Incubating) is designed from the ground up to deliver{" "}
              <span className="text-[#fffaeb]">
                exceptional performance, reliability, and developer experience
              </span>{" "}
              for modern message streaming workloads. Combined with{" "}
              <span className="text-[#fffaeb]">
                io_uring and thread-per-core, shared nothing architecture
              </span>{" "}
              for maximum speed and efficiency.
            </p>
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
