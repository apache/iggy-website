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

"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";

export function MessageFlowDiagram() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSteps = 7;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % totalSteps);
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    { label: "Client", desc: "Client sends messages via TCP/QUIC/WS/HTTP", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z" },
    { label: "Listener", desc: "Transport listener receives the request on a shard thread", icon: "M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" },
    { label: "Router", desc: "Request routed to owning shard via IggyNamespace hash", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
    { label: "Stream", desc: "Stream lookup by ID (metadata read from left-right)", icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" },
    { label: "Topic", desc: "Topic lookup within stream, compression applied", icon: "M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" },
    { label: "Partition", desc: "Messages buffered in MemoryMessageJournal", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" },
    { label: "Segment", desc: "Flushed to .log file via vectored I/O (io_uring)", icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-fd-foreground m-0">Message Flow</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1 rounded-md text-xs font-medium bg-fd-accent text-fd-accent-foreground hover:opacity-80 transition-opacity"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="space-y-2 mb-6">
        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => { setStep(i); setIsPlaying(false); }}
            className={`
              relative flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-500 cursor-pointer
              ${i <= step
                ? "bg-fd-primary/10 border border-fd-primary/30"
                : "bg-fd-muted/30 border border-transparent"
              }
              ${i === step ? "ring-2 ring-fd-primary/50 shadow-lg shadow-fd-primary/10" : ""}
            `}
          >
            <div className={`
              relative flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-all duration-500
              ${i <= step ? "bg-fd-primary text-fd-primary-foreground" : "bg-fd-muted text-fd-muted-foreground"}
            `}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d={s.icon} />
              </svg>
              {i === step && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-fd-primary animate-ping" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-mono font-bold transition-colors duration-500 ${
                  i <= step ? "text-fd-foreground" : "text-fd-muted-foreground"
                }`}>
                  {i + 1}. {s.label}
                </span>
              </div>
              <p className={`text-sm m-0 mt-0.5 transition-colors duration-500 ${
                i <= step ? "text-fd-foreground/80" : "text-fd-muted-foreground/60"
              }`}>
                {s.desc}
              </p>
            </div>
            {i < steps.length - 1 && i <= step && (
              <div className="absolute left-[1.4rem] -bottom-2 w-px h-2 bg-fd-primary/30" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { setStep(i); setIsPlaying(false); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? "bg-fd-primary w-6" : "bg-fd-muted-foreground/30 hover:bg-fd-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function ShardDiagram() {
  const [activeShard, setActiveShard] = useState(0);

  const shards = [
    {
      id: 0,
      label: "Shard 0 (Primary)",
      color: "var(--color-fd-primary)",
      features: ["MetadataWriter", "HTTP Server (axum)", "QUIC Server", "VSR Primary", "Config Writer"],
      partitions: ["P1", "P4", "P7"],
    },
    {
      id: 1,
      label: "Shard 1",
      color: "#3b82f6",
      features: ["MetadataReader", "TCP Server", "WebSocket Server"],
      partitions: ["P2", "P5", "P8"],
    },
    {
      id: 2,
      label: "Shard 2",
      color: "#8b5cf6",
      features: ["MetadataReader", "TCP Server", "WebSocket Server"],
      partitions: ["P3", "P6", "P9"],
    },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-6">Thread-per-Core Shard Architecture</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {shards.map((shard) => (
          <button
            key={shard.id}
            onClick={() => setActiveShard(shard.id)}
            className={`
              relative rounded-xl border-2 p-4 text-left transition-all duration-300
              ${activeShard === shard.id
                ? "border-fd-primary bg-fd-primary/5 shadow-lg shadow-fd-primary/10"
                : "border-fd-border bg-fd-card hover:border-fd-muted-foreground/30"
              }
            `}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full shard-pulse"
                style={{ backgroundColor: shard.color }}
              />
              <span className="text-xs font-mono font-bold text-fd-foreground">{shard.label}</span>
            </div>

            <div className="rounded-md bg-fd-muted/50 p-2 mb-2">
              <span className="text-[10px] font-mono text-fd-muted-foreground block mb-1">compio runtime</span>
              <div className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ring-glow" />
                <span className="text-[10px] text-fd-foreground">io_uring (4096 ops)</span>
              </div>
            </div>

            <div className="space-y-1">
              {shard.features.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-fd-muted-foreground/50" />
                  <span className="text-[11px] text-fd-muted-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-1.5">
              {shard.partitions.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-fd-accent text-fd-accent-foreground"
                >
                  {p}
                </span>
              ))}
            </div>

            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-fd-secondary text-fd-secondary-foreground border border-fd-border">
              CPU {shard.id}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-fd-muted/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-fd-muted-foreground">
            <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
          <span className="text-xs font-medium text-fd-muted-foreground">Inter-shard communication</span>
        </div>
        <p className="text-xs text-fd-muted-foreground m-0">
          Shards communicate via <code className="text-[11px]">crossfire</code> bounded mpsc channels. Metadata mutations route to Shard 0.
          Partition ops route to the owning shard via <code className="text-[11px]">DashMap&lt;IggyNamespace, PartitionLocation&gt;</code>.
        </p>
      </div>
    </div>
  );
}

export function IoUringComparison() {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-fd-border bg-fd-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <h4 className="text-sm font-semibold text-fd-foreground m-0">epoll (readiness-based)</h4>
        </div>
        <div className="space-y-3">
          {["App asks: \"Is FD ready?\"", "Kernel: \"Yes, it's ready\"", "App performs the I/O itself"].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-xs font-mono text-fd-muted-foreground w-4 shrink-0">{i + 1}.</span>
              <div className="rounded-md bg-fd-muted/50 p-2 flex-1">
                <span className="text-[11px] text-fd-foreground block">{text}</span>
              </div>
            </div>
          ))}
          <div className="rounded-md bg-red-500/10 border border-red-500/20 p-2 mt-2">
            <span className="text-[11px] text-red-400 block">Files are &quot;always ready&quot; for epoll. Tokio uses a blocking thread pool (up to 512 threads) for file I/O.</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-fd-primary/30 bg-fd-card p-5 shadow-lg shadow-fd-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-fd-primary shard-pulse" />
          <h4 className="text-sm font-semibold text-fd-foreground m-0">io_uring (completion-based)</h4>
        </div>
        <div className="space-y-3">
          {["App submits I/O to Submission Queue (SQ)", "Kernel completes the I/O asynchronously", "Result placed in Completion Queue (CQ)"].map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-xs font-mono text-fd-muted-foreground w-4 shrink-0">{i + 1}.</span>
              <div className="rounded-md bg-fd-primary/10 p-2 flex-1">
                <span className="text-[11px] text-fd-foreground block">{text}</span>
              </div>
            </div>
          ))}
          <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2 mt-2">
            <span className="text-[11px] text-emerald-400 block">Both SQ and CQ are lock-free ring buffers shared between user space and kernel. No syscall per I/O in the hot path.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SegmentVisualization() {
  const [expanded, setExpanded] = useState<number | null>(0);

  const segments = [
    { offset: 0, size: "1 GiB", messages: "~16M msgs", status: "sealed", startOffset: 0, endOffset: 15999999 },
    { offset: 16000000, size: "1 GiB", messages: "~16M msgs", status: "sealed", startOffset: 16000000, endOffset: 31999999 },
    { offset: 32000000, size: "412 MiB", messages: "~6.5M msgs", status: "active", startOffset: 32000000, endOffset: 38500000 },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Partition Storage Layout</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">
        Each partition contains a segmented log. Segments are sealed at 1 GiB and new ones created automatically. Click a segment to inspect its files.
      </p>

      <div className="space-y-3">
        {segments.map((seg, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`
              w-full text-left rounded-lg border p-4 transition-all duration-300
              ${seg.status === "active"
                ? "border-fd-primary/50 bg-fd-primary/5"
                : "border-fd-border bg-fd-muted/20 hover:border-fd-muted-foreground/30"
              }
              ${expanded === i ? "shadow-lg" : ""}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-32 h-3 rounded-full bg-fd-muted/50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      seg.status === "active"
                        ? "bg-fd-primary segment-fill-active"
                        : "bg-fd-muted-foreground/40"
                    }`}
                    style={{ width: seg.status === "active" ? "40%" : "100%" }}
                  />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-fd-foreground block">
                    {String(seg.offset).padStart(20, "0")}
                  </span>
                  <span className="text-[10px] text-fd-muted-foreground">
                    {seg.size} / {seg.messages}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    seg.status === "active"
                      ? "bg-fd-primary/20 text-fd-primary"
                      : "bg-fd-muted text-fd-muted-foreground"
                  }`}
                >
                  {seg.status === "active" ? "writing" : "sealed"}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" className={`text-fd-muted-foreground transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}>
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {expanded === i && (
              <div className="mt-4 pt-3 border-t border-fd-border/50 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-lg bg-fd-accent/30 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded bg-fd-primary/60" />
                      <span className="text-[11px] font-mono font-bold text-fd-foreground">.log</span>
                    </div>
                    <span className="text-[10px] text-fd-muted-foreground block">Message data (headers + payloads)</span>
                    <span className="text-[10px] text-fd-muted-foreground block">64-byte header per message</span>
                  </div>
                  <div className="rounded-lg bg-fd-accent/30 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded bg-blue-500/60" />
                      <span className="text-[11px] font-mono font-bold text-fd-foreground">.index</span>
                    </div>
                    <span className="text-[10px] text-fd-muted-foreground block">Positional + time indexes</span>
                    <span className="text-[10px] text-fd-muted-foreground block">Fast offset and timestamp lookups</span>
                  </div>
                </div>
                <div className="flex gap-4 text-[10px] text-fd-muted-foreground">
                  <span>Offsets: <code className="text-fd-foreground">{seg.startOffset.toLocaleString()}</code> .. <code className="text-fd-foreground">{seg.endOffset.toLocaleString()}</code></span>
                  {seg.status === "sealed" && <span>Read-only, safe to archive</span>}
                  {seg.status === "active" && <span>Accepting writes via vectored I/O</span>}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MessageHeaderDiagram() {
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const fields = [
    { name: "checksum", bytes: "0-8", size: 8, type: "u64", desc: "xxHash3 integrity checksum", color: "#ef4444" },
    { name: "id", bytes: "8-24", size: 16, type: "u128", desc: "Unique message ID (UUIDv4)", color: "#f59e0b" },
    { name: "offset", bytes: "24-32", size: 8, type: "u64", desc: "Sequential offset in partition", color: "#10b981" },
    { name: "timestamp", bytes: "32-40", size: 8, type: "u64", desc: "Server-assigned timestamp", color: "#3b82f6" },
    { name: "origin_ts", bytes: "40-48", size: 8, type: "u64", desc: "Client-provided timestamp", color: "#6366f1" },
    { name: "hdrs_len", bytes: "48-52", size: 4, type: "u32", desc: "User headers length", color: "#8b5cf6" },
    { name: "pay_len", bytes: "52-56", size: 4, type: "u32", desc: "Payload length", color: "#a855f7" },
    { name: "reserved", bytes: "56-64", size: 8, type: "u64", desc: "Reserved (must be 0)", color: "#6b7280" },
  ];

  const totalSize = 64;

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Message Header (64 bytes, little-endian)</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">
        Every message starts with this fixed-size header for efficient aligned reads.
      </p>

      <div className="flex rounded-lg overflow-hidden mb-4 h-10">
        {fields.map((f) => (
          <div
            key={f.name}
            onMouseEnter={() => setHoveredField(f.name)}
            onMouseLeave={() => setHoveredField(null)}
            className="relative flex items-center justify-center transition-all duration-200 cursor-default border-r border-fd-card last:border-r-0"
            style={{
              width: `${(f.size / totalSize) * 100}%`,
              backgroundColor: hoveredField === f.name ? f.color : `${f.color}66`,
              opacity: hoveredField && hoveredField !== f.name ? 0.4 : 1,
            }}
          >
            <span className="text-[9px] font-mono font-bold text-white truncate px-1">
              {f.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex mb-4 text-[8px] font-mono text-fd-muted-foreground">
        {fields.map((f) => (
          <div key={f.name} style={{ width: `${(f.size / totalSize) * 100}%` }} className="text-center">
            {f.bytes}
          </div>
        ))}
      </div>

      {hoveredField && (
        <div className="rounded-lg bg-fd-accent/50 p-3 animate-fade-in">
          {(() => {
            const f = fields.find((x) => x.name === hoveredField)!;
            return (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: f.color }} />
                <div>
                  <span className="text-xs font-mono font-bold text-fd-foreground">{f.name}</span>
                  <span className="text-xs text-fd-muted-foreground ml-2">({f.type}, {f.size} bytes)</span>
                  <p className="text-xs text-fd-muted-foreground m-0 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export function BenchmarkChart() {
  const metrics = [
    { label: "8 partitions P9999", tokio: 100, tpc: 19, improvement: "81%" },
    { label: "16 partitions P95", tokio: 100, tpc: 72, improvement: "28%" },
    { label: "16 partitions P99", tokio: 100, tpc: 68, improvement: "32%" },
    { label: "16 partitions P9999", tokio: 100, tpc: 8, improvement: "92%" },
    { label: "32 partitions P95", tokio: 100, tpc: 43, improvement: "57%" },
    { label: "32 partitions P99", tokio: 100, tpc: 40, improvement: "60%" },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Latency Improvements: Tokio vs Thread-per-Core</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">
        Relative latency comparison (lower is better). Thread-per-core with io_uring vs Tokio work-stealing.
      </p>

      <div className="space-y-4">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono text-fd-muted-foreground">{m.label}</span>
              <span className="text-[11px] font-bold text-emerald-400">-{m.improvement}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="flex-1 h-5 rounded bg-fd-muted/50 relative overflow-hidden">
                <div className="h-full rounded bg-red-500/40 bench-bar" style={{ width: `${m.tokio}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-fd-muted-foreground">tokio</span>
              </div>
              <div className="flex-1 h-5 rounded bg-fd-muted/50 relative overflow-hidden">
                <div className="h-full rounded bg-fd-primary/60 bench-bar" style={{ width: `${m.tpc}%` }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-fd-foreground">thread-per-core</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NamespacePacking() {
  const bitGroups = [
    { label: "unused (20 bits)", bits: 20, color: undefined, range: "63..44" },
    { label: "stream", bits: 12, color: "#f59e0b88", range: "43..32", sub: "12 bits" },
    { label: "topic", bits: 12, color: "#3b82f688", range: "31..20", sub: "12 bits" },
    { label: "partition", bits: 20, color: "#10b98188", range: "19..0", sub: "20 bits" },
  ];

  const limits = [
    { label: "Max Streams", value: "4,096", color: "#f59e0b" },
    { label: "Max Topics", value: "4,096", color: "#3b82f6" },
    { label: "Max Partitions", value: "1,000,000", color: "#10b981" },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">IggyNamespace Bit Packing (u64)</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">
        Stream, topic, and partition IDs are packed into a single u64 for efficient hashing and shard routing.
      </p>

      <div className="flex rounded-lg overflow-hidden h-12 mb-3">
        {bitGroups.map((g, i) => (
          <div
            key={i}
            className={`flex items-center justify-center ${i < bitGroups.length - 1 ? "border-r border-fd-card" : ""} ${!g.color ? "bg-fd-muted/30" : ""}`}
            style={{ width: `${(g.bits / 64) * 100}%`, ...(g.color ? { backgroundColor: g.color } : {}) }}
          >
            <div className="text-center">
              <span className={`text-[10px] font-mono ${g.color ? "font-bold text-white" : "text-fd-muted-foreground"} block`}>{g.label}</span>
              {g.sub && <span className="text-[8px] font-mono text-white/70">{g.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex text-[8px] font-mono text-fd-muted-foreground mb-4">
        {bitGroups.map((g, i) => (
          <div key={i} style={{ width: `${(g.bits / 64) * 100}%` }} className="text-center">{g.range}</div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {limits.map((item) => (
          <div key={item.label} className="rounded-lg bg-fd-muted/30 p-3 text-center">
            <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-mono font-bold text-fd-foreground block">{item.value}</span>
            <span className="text-[10px] text-fd-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StreamHierarchy() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    stream: true,
    "topic-user": true,
    "topic-order": true,
    "partition-user-1": false,
    "partition-user-2": false,
    "partition-user-3": false,
    "partition-order-1": false,
    "partition-order-2": false,
    "partition-order-3": false,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  const SegmentBadge = ({ label, active }: { label: string; active?: boolean }) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono ${
        active
          ? "bg-fd-primary/10 border border-fd-primary/30 text-fd-primary"
          : "bg-fd-muted/40 border border-fd-border text-fd-muted-foreground"
      }`}
    >
      {active && <span className="w-1.5 h-1.5 rounded-full bg-fd-primary animate-pulse" />}
      {label}
    </span>
  );

  const partitions = (topicKey: string) =>
    [1, 2, 3].map((p) => {
      const pKey = `partition-${topicKey}-${p}`;
      return (
        <div key={pKey} className="ml-8 mt-1.5">
          <button
            onClick={() => toggle(pKey)}
            className="flex items-center gap-2 w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-[#10b981]/10 border border-transparent hover:border-[#10b981]/20"
          >
            <Chevron open={!!expanded[pKey]} />
            <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
            <span className="text-xs font-mono font-medium text-fd-foreground">Partition {p}</span>
            <span className="text-[10px] text-fd-muted-foreground ml-auto">append-only log</span>
          </button>
          {expanded[pKey] && (
            <div className="ml-10 mt-1.5 flex flex-wrap gap-1.5">
              <SegmentBadge label="seg-0 (sealed)" />
              <SegmentBadge label="seg-1 (sealed)" />
              <SegmentBadge label={`seg-2 (active)`} active />
            </div>
          )}
        </div>
      );
    });

  const topics = [
    { key: "user", name: "user-events", partitionCount: 3, messageRate: "~2.4M msg/s" },
    { key: "order", name: "order-events", partitionCount: 3, messageRate: "~1.8M msg/s" },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-5">Stream Hierarchy</h3>

      <div className="rounded-xl border-2 border-fd-primary/40 bg-fd-primary/5 p-4">
        <button
          onClick={() => toggle("stream")}
          className="flex items-center gap-2 w-full text-left"
        >
          <Chevron open={expanded.stream} />
          <span className="w-3 h-3 rounded bg-fd-primary shrink-0" />
          <span className="text-sm font-mono font-bold text-fd-foreground">Stream: orders</span>
          <span className="text-[10px] text-fd-muted-foreground ml-auto">ID: 1</span>
        </button>

        {expanded.stream && (
          <div className="mt-3 space-y-2">
            {topics.map((topic) => (
              <div
                key={topic.key}
                className="ml-4 rounded-lg border border-[#3b82f6]/30 bg-[#3b82f6]/5 p-3"
              >
                <button
                  onClick={() => toggle(`topic-${topic.key}`)}
                  className="flex items-center gap-2 w-full text-left"
                >
                  <Chevron open={!!expanded[`topic-${topic.key}`]} />
                  <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] shrink-0" />
                  <span className="text-xs font-mono font-bold text-fd-foreground">Topic: {topic.name}</span>
                  <span className="text-[10px] text-fd-muted-foreground ml-auto">{topic.partitionCount} partitions / {topic.messageRate}</span>
                </button>

                {expanded[`topic-${topic.key}`] && (
                  <div className="mt-1">
                    {partitions(topic.key)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4 text-[11px] text-fd-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-fd-primary" /> Stream</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#3b82f6]" /> Topic</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Partition</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-fd-muted-foreground/40" /> Segment</span>
      </div>
    </div>
  );
}

export function AppendOnlyLogViz() {
  const [offsets, setOffsets] = useState([0, 1, 2, 3, 4, 5]);
  const [consumerOffset, setConsumerOffset] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setOffsets((prev) => {
        const next = prev[prev.length - 1] + 1;
        const updated = [...prev, next];
        return updated.length > 12 ? updated.slice(1) : updated;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Append-Only Log</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">
        Messages are appended sequentially. Consumers track their position independently via offsets.
      </p>

      <div className="relative">
        <div className="flex items-end gap-1 overflow-hidden pb-8 pt-6">
          {offsets.map((offset, i) => {
            const isLast = i === offsets.length - 1;
            const isAtConsumer = offset === consumerOffset;
            return (
              <button
                key={offset}
                onClick={() => setConsumerOffset(offset)}
                className={`
                  relative flex-shrink-0 w-14 h-16 rounded-md border flex flex-col items-center justify-center transition-all duration-500
                  ${isLast
                    ? "border-fd-primary/60 bg-fd-primary/15 shadow-lg shadow-fd-primary/20 animate-pulse"
                    : isAtConsumer
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : offset < consumerOffset
                        ? "border-fd-border/50 bg-fd-muted/20 opacity-50"
                        : "border-fd-border bg-fd-muted/30"
                  }
                `}
              >
                <span className="text-[10px] font-mono text-fd-muted-foreground">msg</span>
                <span className="text-sm font-mono font-bold text-fd-foreground">{offset}</span>
              </button>
            );
          })}

          <div className="flex-shrink-0 w-14 h-16 rounded-md border-2 border-dashed border-fd-primary/40 flex flex-col items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fd-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-fd-primary" />
            </span>
            <span className="text-[9px] font-mono text-fd-primary mt-1">write</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex gap-1 px-0">
          {offsets.map((offset) => {
            const isAtConsumer = offset === consumerOffset;
            return (
              <div key={offset} className="flex-shrink-0 w-14 flex flex-col items-center">
                {isAtConsumer && (
                  <>
                    <svg width="12" height="8" viewBox="0 0 12 8" className="text-emerald-500">
                      <path d="M6 0L12 8H0z" fill="currentColor" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold text-emerald-500">consumer</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[11px] text-fd-muted-foreground m-0 mt-4">
        Click any message block to move the consumer pointer. New messages appear from the right.
      </p>
    </div>
  );
}

export function ConsumerGroupViz() {
  const consumers = [
    { id: "A", color: "#f59e0b", partitions: ["P1", "P4"] },
    { id: "B", color: "#3b82f6", partitions: ["P2", "P5"] },
    { id: "C", color: "#10b981", partitions: ["P3", "P6"] },
  ];

  const allPartitions = ["P1", "P2", "P3", "P4", "P5", "P6"];

  const getConsumerForPartition = (p: string) =>
    consumers.find((c) => c.partitions.includes(p))!;

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Consumer Group</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-6">
        Each partition is assigned to exactly one consumer. When a consumer joins or leaves, partitions are rebalanced.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
        <div className="space-y-3">
          <span className="text-[11px] font-mono text-fd-muted-foreground uppercase tracking-wider">Consumers</span>
          {consumers.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg border border-fd-border p-3 bg-fd-muted/10"
              style={{ borderLeftColor: c.color, borderLeftWidth: 3 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: c.color }}
              >
                {c.id}
              </div>
              <div>
                <span className="text-xs font-mono font-medium text-fd-foreground block">Consumer {c.id}</span>
                <span className="text-[10px] text-fd-muted-foreground">{c.partitions.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const consumer = consumers[i % 3];
            return (
              <div key={i} className="flex items-center gap-0">
                <div className="w-12 h-px" style={{ backgroundColor: consumer.color + "80" }} />
                <svg width="8" height="8" viewBox="0 0 8 8" style={{ color: consumer.color }}>
                  <path d="M0 0L8 4L0 8z" fill="currentColor" opacity="0.6" />
                </svg>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-mono text-fd-muted-foreground uppercase tracking-wider">Partitions</span>
          <div className="grid grid-cols-2 gap-2">
            {allPartitions.map((p) => {
              const consumer = getConsumerForPartition(p);
              return (
                <div
                  key={p}
                  className="flex items-center gap-2 rounded-lg border border-fd-border p-2.5 bg-fd-muted/10"
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: consumer.color }}
                  />
                  <span className="text-xs font-mono font-bold text-fd-foreground">{p}</span>
                  <span
                    className="text-[9px] font-mono ml-auto px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: consumer.color + "20", color: consumer.color }}
                  >
                    {consumer.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServerEcosystem() {
  const ring = [
    { label: "Producers", sub: "Send messages", color: "#f59e0b", pos: "top" },
    { label: "Consumers", sub: "Poll messages", color: "#10b981", pos: "top" },
    { label: "Consumer Groups", sub: "Horizontal scaling", color: "#3b82f6", pos: "top" },
    { label: "Web UI", sub: "Dashboard", color: "#a855f7", pos: "bottom", href: "/docs/web_ui/start" },
    { label: "CLI", sub: "Terminal management", color: "#6366f1", pos: "bottom", href: "/docs/cli/start" },
    { label: "MCP Server", sub: "LLM integration", color: "#ec4899", pos: "bottom", href: "/docs/ai/mcp" },
    { label: "Connectors", sub: "Sources & Sinks", color: "#14b8a6", pos: "bottom", href: "/docs/connectors/introduction" },
    { label: "Benchmarks", sub: "iggy-bench", color: "#f97316", pos: "bottom", href: "/docs/server/benchmarking" },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative rounded-2xl border-2 border-fd-primary/40 bg-gradient-to-br from-fd-primary/10 to-fd-primary/5 px-8 py-5 text-center shadow-lg shadow-fd-primary/10">
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-fd-primary shard-pulse" />
          <span className="text-lg font-bold text-fd-primary block">Iggy Server</span>
          <span className="text-xs text-fd-muted-foreground block mt-1">Thread-per-core + io_uring</span>
          <div className="flex justify-center gap-1.5 mt-2">
            {["TCP :8090", "QUIC :8080", "HTTP :3000", "WS :8092"].map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded text-[8px] font-mono font-medium bg-fd-primary/15 text-fd-primary">{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ring.map((item) => {
          const inner = (
            <>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">{item.label}</span>
              </div>
              <span className="text-[10px] text-fd-muted-foreground pl-3.5">{item.sub}</span>
            </>
          );
          const cls = "rounded-lg border border-fd-border bg-fd-muted/10 p-3 transition-all hover:border-fd-primary/30 hover:shadow-md hover:shadow-fd-primary/5 group";
          if ("href" in item && item.href) {
            return <a key={item.label} href={item.href} className={`${cls} no-underline`}>{inner}</a>;
          }
          return <div key={item.label} className={cls}>{inner}</div>;
        })}
      </div>

      <div className="mt-4 rounded-lg bg-fd-muted/20 p-3">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[10px] text-fd-muted-foreground">
          <span><strong className="text-fd-foreground">SDKs:</strong> Rust, Python, Java, Go, Node.js, C#, C++</span>
          <span><strong className="text-fd-foreground">Security:</strong> TLS, Argon2id, AES-256-GCM, RBAC</span>
          <span><strong className="text-fd-foreground">Observability:</strong> Prometheus, OpenTelemetry</span>
        </div>
      </div>
    </div>
  );
}

export function ConnectorPipeline() {
  const sources = [
    { name: "PostgreSQL", color: "#336791" },
    { name: "Elasticsearch", color: "#00bfb3" },
    { name: "Random", color: "#6b7280" },
  ];
  const sinks = [
    { name: "PostgreSQL", color: "#336791" },
    { name: "MongoDB", color: "#47a248" },
    { name: "Elasticsearch", color: "#00bfb3" },
    { name: "Iceberg", color: "#4a90d9" },
    { name: "Quickwit", color: "#a855f7" },
    { name: "Stdout", color: "#6b7280" },
  ];
  const transforms = ["add_fields", "delete_fields", "filter_fields", "update_fields"];

  const Arrow = () => (
    <>
      <svg width="40" height="16" viewBox="0 0 40 16" className="text-fd-primary hidden md:block shrink-0">
        <path d="M0 8h32l-5-5M32 8l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      <svg width="16" height="32" viewBox="0 0 16 32" className="text-fd-primary md:hidden shrink-0 mx-auto">
        <path d="M8 0v24l-5-5M8 24l5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </>
  );

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Source Flow (Ingest)</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-4">External systems push data into Iggy streams via source plugins</p>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
        <div className="flex-1 w-full rounded-lg border border-fd-border bg-fd-muted/20 p-4">
          <span className="text-xs font-semibold text-fd-muted-foreground block mb-2">External System</span>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-fd-card text-fd-foreground border border-fd-border">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        <Arrow />

        <div className="flex-1 w-full rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <span className="text-xs font-semibold text-emerald-400 block mb-1">Source Plugin</span>
          <span className="text-[10px] text-fd-muted-foreground block mb-2">poll() via FFI/postcard</span>
          <div className="rounded bg-fd-muted/30 px-2 py-1">
            <span className="text-[10px] text-fd-muted-foreground">Transforms: </span>
            {transforms.map((t, i) => (
              <span key={t}>
                <code className="text-[9px] text-fd-foreground">{t}</code>
                {i < transforms.length - 1 && <span className="text-[10px] text-fd-muted-foreground">, </span>}
              </span>
            ))}
          </div>
        </div>

        <Arrow />

        <div className="shrink-0 rounded-lg border-2 border-fd-primary/40 bg-fd-primary/5 px-5 py-3 text-center">
          <span className="text-sm font-bold text-fd-primary block">Iggy</span>
          <span className="text-[10px] text-fd-muted-foreground">Stream / Topic</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Sink Flow (Egress)</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-4">Iggy streams forward data to external systems via sink plugins</p>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="shrink-0 rounded-lg border-2 border-fd-primary/40 bg-fd-primary/5 px-5 py-3 text-center">
          <span className="text-sm font-bold text-fd-primary block">Iggy</span>
          <span className="text-[10px] text-fd-muted-foreground">Consumer Group</span>
        </div>

        <Arrow />

        <div className="flex-1 w-full rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <span className="text-xs font-semibold text-blue-400 block mb-1">Sink Plugin</span>
          <span className="text-[10px] text-fd-muted-foreground block mb-2">consume() via FFI/postcard</span>
          <div className="rounded bg-fd-muted/30 px-2 py-1">
            <span className="text-[10px] text-fd-muted-foreground">Transforms: </span>
            {transforms.map((t, i) => (
              <span key={t}>
                <code className="text-[9px] text-fd-foreground">{t}</code>
                {i < transforms.length - 1 && <span className="text-[10px] text-fd-muted-foreground">, </span>}
              </span>
            ))}
          </div>
        </div>

        <Arrow />

        <div className="flex-1 w-full rounded-lg border border-fd-border bg-fd-muted/20 p-4">
          <span className="text-xs font-semibold text-fd-muted-foreground block mb-2">External System</span>
          <div className="flex flex-wrap gap-1.5">
            {sinks.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-fd-card text-fd-foreground border border-fd-border">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhyIggy() {
  const comparisons = [
    {
      label: "Runtime",
      traditional: "JVM / Go runtime with GC pauses",
      iggy: "Native Rust, zero GC, predictable latency",
      iggyColor: "#10b981",
    },
    {
      label: "I/O model",
      traditional: "epoll + blocking thread pool for disk",
      iggy: "io_uring completion-based, kernel does the I/O",
      iggyColor: "#f59e0b",
    },
    {
      label: "Threading",
      traditional: "Work-stealing across shared threads",
      iggy: "Thread-per-core, CPU-pinned, NUMA-aware",
      iggyColor: "#3b82f6",
    },
    {
      label: "Serialization",
      traditional: "Full deserialization on every read",
      iggy: "Zero-copy views into raw buffers",
      iggyColor: "#8b5cf6",
    },
    {
      label: "Memory",
      traditional: "Heap allocations on hot path",
      iggy: "Pre-allocated 4 GiB pool, 32 bucket sizes",
      iggyColor: "#ec4899",
    },
    {
      label: "Binary",
      traditional: "JVM + Zookeeper / KRaft + dependencies",
      iggy: "Single ~20 MB binary, no dependencies",
      iggyColor: "#14b8a6",
    },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-border bg-fd-card p-6">
      <h3 className="text-lg font-semibold text-fd-foreground m-0 mb-2">Why Iggy?</h3>
      <p className="text-xs text-fd-muted-foreground m-0 mb-5">How Iggy compares to traditional message streaming platforms</p>

      <div className="space-y-2">
        <div className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-2 mb-1">
          <span className="text-[10px] font-semibold text-fd-muted-foreground" />
          <span className="text-[10px] font-semibold text-fd-muted-foreground text-center">Traditional</span>
          <span className="text-[10px] font-semibold text-fd-primary text-center">Iggy</span>
        </div>
        {comparisons.map((c) => (
          <div key={c.label} className="grid grid-cols-[100px_1fr_1fr] md:grid-cols-[120px_1fr_1fr] gap-2 items-center">
            <span className="text-[11px] font-semibold text-fd-foreground">{c.label}</span>
            <div className="rounded-md bg-fd-muted/30 px-3 py-2 text-center">
              <span className="text-[10px] text-fd-muted-foreground">{c.traditional}</span>
            </div>
            <div className="rounded-md border px-3 py-2 text-center" style={{ borderColor: `${c.iggyColor}40`, backgroundColor: `${c.iggyColor}08` }}>
              <span className="text-[10px] text-fd-foreground">{c.iggy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuickStartSnippet() {
  const steps = [
    { n: "1", label: "Start the server", code: "docker run --cap-add=SYS_NICE --security-opt seccomp=unconfined --ulimit memlock=-1:-1 -p 8090:8090 apache/iggy" },
    { n: "2", label: "Add the SDK", code: "cargo add iggy" },
    { n: "3", label: "Connect and send", code: 'let client = IggyClient::from_connection_string("iggy://iggy:iggy@localhost:8090")?;\nclient.connect().await?;' },
  ];

  return (
    <div className="my-8 rounded-xl border border-fd-primary/20 bg-gradient-to-br from-fd-card to-fd-primary/3 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-fd-foreground m-0">Quick start</h3>
        <a href="/docs/introduction/getting-started" className="text-xs text-fd-primary no-underline hover:underline">Full tutorial →</a>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-fd-primary text-fd-primary-foreground text-xs font-bold shrink-0 mt-1">{s.n}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-fd-foreground block mb-1.5">{s.label}</span>
              <pre className="text-[12px] font-mono text-fd-muted-foreground bg-fd-muted/30 rounded-lg px-3 py-2 m-0 overflow-x-auto whitespace-pre"><code>{s.code}</code></pre>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4 pl-9">
        <span className="text-[10px] text-fd-muted-foreground mr-1">SDKs:</span>
        {["Rust", "Python", "Java", "Go", "Node.js", "C#", "C++"].map((l) => (
          <span key={l} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-fd-muted/50 text-fd-muted-foreground">{l}</span>
        ))}
      </div>
    </div>
  );
}

export function DocsHero() {
  const stats = [
    { stat: "Sub-ms latency", accent: "Tail latency under 1ms at P99" },
    { stat: "Millions msgs/sec", accent: "Multi GB/s throughput on a single node" },
    { stat: "Zero-copy I/O", accent: "io_uring + vectored writes to disk" },
  ];

  const sources = [
    { name: "PostgreSQL", color: "#336791" },
    { name: "Elasticsearch", color: "#00bfb3" },
    { name: "Random", color: "#6b7280" },
  ];

  const sinks = [
    { name: "PostgreSQL", color: "#336791" },
    { name: "MongoDB", color: "#47a248" },
    { name: "Elasticsearch", color: "#00bfb3" },
    { name: "Iceberg", color: "#4a90d9" },
    { name: "Quickwit", color: "#a855f7" },
  ];

  const links = [
    { title: "Getting Started", href: "/docs/introduction/getting-started", desc: "Install, configure, send your first messages", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { title: "Architecture", href: "/docs/introduction/architecture", desc: "Thread-per-core, io_uring, shared-nothing design", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" },
    { title: "Connectors", href: "/docs/connectors/introduction", desc: "Source & sink plugins for data integration", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
    { title: "SDKs", href: "/docs/sdk/introduction", desc: "Rust, Python, Java, Go, Node.js, C#, C++", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { title: "Server Config", href: "/docs/server/configuration", desc: "Tune performance, storage, and security", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { title: "CLI & Web UI", href: "/docs/cli/start", desc: "Manage streams, topics, users from terminal or browser", icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  ];

  return (
    <div className="relative my-8 rounded-2xl border border-fd-primary/20 bg-gradient-to-br from-fd-card via-fd-card to-fd-primary/5 p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-fd-primary)_0%,transparent_60%)] opacity-[0.07]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-fd-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <Logo className="mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground m-0 mb-2">
            <span className="text-fd-primary">Hyper-Efficient</span> Message Streaming
          </h2>
          <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground m-0 mb-3">
            at <span className="text-fd-primary">Laser Speed</span>
          </h2>
          <p className="text-sm md:text-base text-fd-muted-foreground max-w-2xl m-0 mb-1">
            High-performance, persistent message streaming platform written in Rust, capable of processing millions of messages per second with ultra-low latency.
          </p>
          <p className="text-xs text-fd-muted-foreground/60 m-0 italic">
            Named after the Italian Greyhound - small yet extremely fast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((item) => (
            <div key={item.stat} className="relative rounded-xl border border-fd-primary/20 bg-fd-card/80 backdrop-blur p-5 text-center group hover:border-fd-primary/40 transition-colors">
              <div className="absolute inset-0 rounded-xl bg-fd-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-fd-primary mx-auto mb-3 shadow-[0_0_8px_var(--color-fd-primary)]" />
                <span className="text-base font-bold text-fd-foreground block">{item.stat}</span>
                <span className="text-xs text-fd-muted-foreground mt-1 block">{item.accent}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {links.map((link) => (
            <a key={link.title} href={link.href} className="group rounded-xl border border-fd-border bg-fd-card/60 backdrop-blur p-4 no-underline transition-all hover:border-fd-primary/40 hover:shadow-lg hover:shadow-fd-primary/5">
              <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" className="text-fd-muted-foreground group-hover:text-fd-primary transition-colors shrink-0" fill="none" strokeWidth="1.5" stroke="currentColor">
                  <path d={link.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">{link.title}</span>
              </div>
              <span className="text-xs text-fd-muted-foreground">{link.desc}</span>
            </a>
          ))}
        </div>

        <div className="rounded-xl border border-fd-border bg-fd-card/60 backdrop-blur p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-fd-primary shard-pulse" />
            <a href="/docs/connectors/introduction" className="text-sm font-semibold text-fd-foreground no-underline hover:text-fd-primary transition-colors">Connectors: Data Integration Pipeline</a>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <a href="/docs/connectors/introduction" className="text-xs font-semibold text-emerald-400 block mb-2 no-underline hover:underline">Sources</a>
              <div className="flex flex-wrap gap-1.5">
                {sources.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-fd-muted/50 text-fd-foreground">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center px-2">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-fd-primary hidden md:block">
                <path d="M0 8h24l-5-5M24 8l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <svg width="16" height="24" viewBox="0 0 16 24" className="text-fd-primary md:hidden">
                <path d="M8 0v18l-5-5M8 18l5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            <a href="/docs/introduction/architecture" className="flex-1 rounded-lg border-2 border-fd-primary/30 bg-fd-primary/5 p-3 text-center no-underline group hover:border-fd-primary/50 transition-colors">
              <span className="text-sm font-bold text-fd-primary block">Iggy Server</span>
              <span className="text-[10px] text-fd-muted-foreground block mt-1">Thread-per-core + io_uring</span>
              <div className="flex justify-center gap-1 mt-2">
                {["TCP", "QUIC", "WS", "HTTP"].map((p) => (
                  <span key={p} className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-fd-primary/15 text-fd-primary">{p}</span>
                ))}
              </div>
            </a>

            <div className="flex items-center justify-center px-2">
              <svg width="32" height="16" viewBox="0 0 32 16" className="text-fd-primary hidden md:block">
                <path d="M0 8h24l-5-5M24 8l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <svg width="16" height="24" viewBox="0 0 16 24" className="text-fd-primary md:hidden">
                <path d="M8 0v18l-5-5M8 18l5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            <div className="flex-1 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <a href="/docs/connectors/introduction" className="text-xs font-semibold text-blue-400 block mb-2 no-underline hover:underline">Sinks</a>
              <div className="flex flex-wrap gap-1.5">
                {sinks.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-fd-muted/50 text-fd-foreground">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-5 mt-4 pt-3 border-t border-fd-border/50">
            {[
              { label: "MCP Server", href: "/docs/ai/mcp", sub: "40+ LLM tools" },
              { label: "Web UI", href: "/docs/web_ui/start", sub: "Dashboard" },
              { label: "CLI", href: "/docs/cli/start", sub: "Terminal" },
              { label: "7 SDKs", href: "/docs/sdk/introduction", sub: "All languages" },
            ].map((t) => (
              <a key={t.label} href={t.href} className="text-center no-underline group">
                <span className="text-[10px] font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors block">{t.label}</span>
                <span className="text-[8px] text-fd-muted-foreground">{t.sub}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
