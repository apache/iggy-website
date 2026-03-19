"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WRITE_PATH =
  "M0,128 L8,155 L16,161 L24,130 L32,125 L40,153 L48,165 L56,129 L64,154 L72,150 L80,118 L88,166 L96,131 L104,128 L112,157 L120,130 L128,131 L136,160 L144,132 L152,135 L160,166 L168,134 L176,137 L184,164 L192,122 L200,146 L208,148 L216,131 L224,130 L232,162 L240,126 L248,124 L256,163 L264,129 L272,135 L280,166 L288,131 L296,128 L304,163 L312,162 L320,131 L328,166 L336,133 L344,152 L352,158 L360,131 L368,128 L376,163 L384,120 L392,157 L400,164 L408,132 L416,115 L424,152 L432,125 L440,114 L448,155 L456,124 L464,132 L472,169 L480,163 L488,129 L496,167 L504,147 L512,152 L520,148 L528,141 L536,157 L544,145 L552,162 L560,113 L568,154 L576,143 L584,116 L592,161 L600,140";

const READ_PATH =
  "M0,151 L8,154 L16,155 L24,154 L32,156 L40,154 L48,155 L56,152 L64,154 L72,154 L80,152 L88,154 L96,153 L104,154 L112,152 L120,156 L128,153 L136,154 L144,153 L152,156 L160,152 L168,153 L176,153 L184,156 L192,155 L200,154 L208,155 L216,153 L224,154 L232,153 L240,154 L248,152 L256,155 L264,152 L272,152 L280,155 L288,154 L296,155 L304,154 L312,153 L320,155 L328,155 L336,152 L344,152 L352,156 L360,154 L368,157 L376,156 L384,157 L392,156 L400,152 L408,153 L416,155 L424,157 L432,155 L440,157 L448,157 L456,156 L464,155 L472,152 L480,155 L488,154 L496,154 L504,156 L512,156 L520,154 L528,156 L536,156 L544,152 L552,155 L560,156 L568,153 L576,156 L584,153 L592,153 L600,154";

const CY = (ms: number) => 200 - ms * 60;
const yTicks = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

export function BenchmarkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wrAvg = CY(1.01);
  const wrP99 = CY(2.05);

  return (
    <div ref={ref}>
      <style>{`
        @keyframes iggy-draw { from { stroke-dashoffset: 2400 } to { stroke-dashoffset: 0 } }
        @keyframes iggy-area-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes iggy-label-in { from { opacity: 0; transform: translateX(8px) } to { opacity: 1; transform: translateX(0) } }
        .iggy-line { stroke-dasharray: 2400; stroke-dashoffset: 2400 }
        .iggy-area-wr, .iggy-area-rd { opacity: 0 }
        .iggy-label { opacity: 0 }
        .iggy-go .iggy-line { animation: iggy-draw 2s cubic-bezier(0.4,0,0.2,1) forwards }
        .iggy-go .iggy-line-rd { animation-delay: 0.3s }
        .iggy-go .iggy-area-wr { animation: iggy-area-in 0.8s ease 1s forwards }
        .iggy-go .iggy-area-rd { animation: iggy-area-in 0.8s ease 1.3s forwards }
        .iggy-go .iggy-label { animation: iggy-label-in 0.4s ease 2s forwards }
      `}</style>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { value: "1M+", unit: "msg/s", label: "Throughput", sub: null },
          { value: "+1 GB/s", unit: "write", label: "Producer throughput", sub: null },
          { value: "+3 GB/s", unit: "read", label: "Consumer throughput", sub: null },
          { value: "1.01", unit: "ms", label: "Avg write latency", sub: null },
          { value: "2.05", unit: "ms", label: "P99 write latency", sub: null },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-5">
            <div className="mb-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white">{s.value}</span>
              <span className="text-sm font-medium text-neutral-400">{s.unit}</span>
            </div>
            <div className="text-sm text-neutral-500">{s.label}</div>
            {s.sub && <div className="mt-1 text-xs text-neutral-600">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#060a12] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-[3px] w-5 rounded-full bg-[#ff9103]" />
              <span className="text-xs text-neutral-400">Write</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-[3px] w-5 rounded-full bg-[#38bdf8]" />
              <span className="text-xs text-neutral-400">Read</span>
            </div>
          </div>
          <span className="text-xs text-neutral-600">Latency (ms) · 40M messages</span>
        </div>

        <div className="flex">
          <div className="flex w-10 shrink-0 flex-col justify-between py-3 pr-1 text-right font-mono text-[9px] text-neutral-600 sm:w-12">
            {[...yTicks].reverse().map((ms) => (
              <div key={ms} className="leading-none">{ms.toFixed(1)}</div>
            ))}
          </div>

          <div className="min-w-0 flex-1 py-3 pr-3">
            <svg
              viewBox="0 0 600 200"
              className={visible ? "iggy-go" : ""}
              preserveAspectRatio="none"
              style={{ width: "100%", height: "auto", aspectRatio: "600 / 200" }}
            >
              <defs>
                <linearGradient id="iggy-wr-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff9103" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ff9103" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="iggy-rd-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {yTicks.map((ms) => (
                <line key={ms} x1="0" y1={CY(ms)} x2="600" y2={CY(ms)} stroke="white" strokeOpacity="0.03" />
              ))}

              <path d={WRITE_PATH + " L600,200 L0,200 Z"} fill="url(#iggy-wr-g)" className="iggy-area-wr" />
              <path d={WRITE_PATH} fill="none" stroke="#ff9103" strokeWidth="2" strokeLinejoin="round" className="iggy-line" />

              <path d={READ_PATH + " L600,200 L0,200 Z"} fill="url(#iggy-rd-g)" className="iggy-area-rd" />
              <path d={READ_PATH} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinejoin="round" className="iggy-line iggy-line-rd" />

              <g className="iggy-label">
                <line x1="0" y1={wrAvg} x2="600" y2={wrAvg} stroke="#ff9103" strokeOpacity="0.25" strokeDasharray="4 3" />
                <rect x="540" y={wrAvg - 11} width="56" height="18" rx="4" fill="#ff9103" fillOpacity="0.12" />
                <text x="568" y={wrAvg + 2} textAnchor="middle" fill="#ff9103" fontSize="10" fontFamily="monospace" fontWeight="600">AVG</text>

                <line x1="0" y1={wrP99} x2="600" y2={wrP99} stroke="#ff9103" strokeOpacity="0.15" strokeDasharray="4 3" />
                <rect x="540" y={wrP99 - 11} width="56" height="18" rx="4" fill="#ff9103" fillOpacity="0.08" />
                <text x="568" y={wrP99 + 2} textAnchor="middle" fill="#ff9103" fontSize="10" fontFamily="monospace" fillOpacity="0.7">P99</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5">
        <span className="font-mono text-sm text-neutral-500">
          <span className="text-neutral-400">Machine:</span> AWS i3en.3xlarge · Intel Xeon 8259CL @ 2.50GHz
        </span>
        <div className="flex gap-5">
          <Link href="https://benchmarks.iggy.apache.org/benchmarks/2c6a0f6a-fb4d-4e84-8ac0-bfca60c75b21" target="_blank" className="font-mono text-sm text-[#ff9103] no-underline hover:underline">
            Producer →
          </Link>
          <Link href="https://benchmarks.iggy.apache.org/benchmarks/63607acc-5861-47c7-9673-5c1ce649ed0c" target="_blank" className="font-mono text-sm text-[#38bdf8] no-underline hover:underline">
            Consumer →
          </Link>
        </div>
      </div>
    </div>
  );
}
