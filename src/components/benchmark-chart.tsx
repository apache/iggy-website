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

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const PRODUCER_BENCHMARK_URL =
  "https://benchmarks.iggy.apache.org/benchmarks/4bc63b0e-f0fb-44b5-8c42-6159603a5653";
const CONSUMER_BENCHMARK_URL =
  "https://benchmarks.iggy.apache.org/benchmarks/6ed70d0a-de98-42da-84a9-16655152d4e8";

const Y_MAX_MS = 1;
const Y_TOP_PAD = 20;
const Y_TICKS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const X_MAX = 800;
const SAMPLES = 160;

const PRODUCER_AVG_MS = 0.466;
const CONSUMER_AVG_MS = 0.357;

const latencyRows = [
  { label: "Avg", producer: "0.466", consumer: "0.357" },
  { label: "Median", producer: "0.349", consumer: "0.351" },
  { label: "P95", producer: "0.886", consumer: "0.446" },
  { label: "P99", producer: "0.976", consumer: "0.495" },
  { label: "P99.9", producer: "1.114", consumer: "0.566" },
];

const stats = [
  {
    value: "2M+",
    unit: "msg/s",
    label: "Throughput",
    detail: "Single node",
  },
  {
    value: "1",
    unit: "GB/s",
    label: "Producer throughput",
    detail: "Persisted writes",
  },
  {
    value: "2",
    unit: "GB/s",
    label: "Consumer throughput",
    detail: "Persistent log reads",
  },
  {
    value: "0.976",
    unit: "ms",
    label: "Producer P99",
    detail: "0.466 ms average",
  },
  {
    value: "0.495",
    unit: "ms",
    label: "Consumer P99",
    detail: "0.357 ms average",
  },
];

const CY = (ms: number) =>
  Y_TOP_PAD +
  (1 - Math.min(ms, Y_MAX_MS) / Y_MAX_MS) * (200 - Y_TOP_PAD);

function mulberry32(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

type Trace = {
  line: string;
  area: string;
};

function buildTrace(
  seed: number,
  centerMs: number,
  jitterMs: number,
  spikeMs: number,
): Trace {
  const random = mulberry32(seed);
  const points: string[] = [];

  for (let index = 0; index < SAMPLES; index += 1) {
    const x = (index / (SAMPLES - 1)) * X_MAX;
    const wander =
      Math.sin(index * 0.18 + seed * 0.31) * jitterMs * 0.55 +
      Math.sin(index * 0.62 + seed * 0.11) * jitterMs * 0.4;
    const noise = (random() - 0.5) * jitterMs * 0.6;
    const spike = random() > 0.93 ? random() * spikeMs : 0;
    const ms = Math.max(0, centerMs + wander + noise + spike);
    points.push(`${x.toFixed(1)},${CY(ms).toFixed(1)}`);
  }

  return {
    line: `M${points.join(" L")}`,
    area: `M${points.join(" L")} L${X_MAX},200 L0,200 Z`,
  };
}

export function BenchmarkSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { producer, consumer } = useMemo(
    () => ({
      producer: buildTrace(11, PRODUCER_AVG_MS, 0.09, 0.4),
      consumer: buildTrace(1, CONSUMER_AVG_MS, 0.04, 0.1),
    }),
    [],
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-w-0 max-w-full">
      <style>{`
        @keyframes iggy-chart-reveal {
          from { width: 0; }
          to { width: 800px; }
        }
        @keyframes iggy-reference-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .iggy-chart-clip {
          width: 0;
        }
        .iggy-chart-visible .iggy-chart-clip {
          animation: iggy-chart-reveal 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .iggy-chart-reference {
          opacity: 0;
        }
        .iggy-chart-visible .iggy-chart-reference {
          animation: iggy-reference-in 0.5s ease 2.1s forwards;
        }
      `}</style>

      <div className="mb-6 grid min-w-0 grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-5 sm:px-5"
          >
            <div className="mb-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-white sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-neutral-300 sm:text-sm">
                {stat.unit}
              </span>
            </div>
            <div className="text-sm text-neutral-300">{stat.label}</div>
            <div className="mt-1 text-xs text-neutral-400">{stat.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 max-w-full gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#060a12]">
          <div className="flex flex-col gap-2 border-b border-white/[0.06] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-5 rounded-full bg-[#ff9103]" />
                <span className="text-xs text-neutral-300">
                  Producer{" "}
                  <span className="text-neutral-100">0.466 ms avg</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[3px] w-5 rounded-full bg-[#38bdf8]" />
                <span className="text-xs text-neutral-300">
                  Consumer{" "}
                  <span className="text-neutral-100">0.357 ms avg</span>
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              Apache Iggy 0.8.0 · 40M messages
            </span>
          </div>

          <div className="flex">
            <div className="flex w-12 shrink-0 flex-col justify-between py-4 pr-2 text-right font-mono text-[10px] text-neutral-400 sm:w-14 sm:text-xs">
              <div className="text-neutral-300">ms</div>
              {[...Y_TICKS].reverse().map((ms) => (
                <div key={ms} className="leading-none">
                  {ms.toFixed(1)}
                </div>
              ))}
            </div>

            <div className="min-w-0 flex-1 pt-4 pr-3 pb-3">
              <svg
                viewBox="0 0 800 200"
                className={visible ? "iggy-chart-visible w-full" : "w-full"}
                preserveAspectRatio="none"
                style={{ aspectRatio: "800 / 200" }}
                role="img"
                aria-label="Producer and consumer latency traces for the Apache Iggy 0.8.0 benchmark"
              >
                <defs>
                  <linearGradient
                    id="iggy-producer-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ff9103"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="#ff9103"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="iggy-consumer-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#38bdf8"
                      stopOpacity="0.14"
                    />
                    <stop
                      offset="100%"
                      stopColor="#38bdf8"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <clipPath id="iggy-chart-reveal">
                    <rect
                      className="iggy-chart-clip"
                      x="0"
                      y="0"
                      height="200"
                    />
                  </clipPath>
                </defs>

                {Y_TICKS.map((ms) => (
                  <line
                    key={ms}
                    x1="0"
                    y1={CY(ms)}
                    x2={X_MAX}
                    y2={CY(ms)}
                    stroke="white"
                    strokeOpacity="0.05"
                  />
                ))}

                <g clipPath="url(#iggy-chart-reveal)">
                  <path d={producer.area} fill="url(#iggy-producer-fill)" />
                  <path
                    d={producer.line}
                    fill="none"
                    stroke="#ff9103"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path d={consumer.area} fill="url(#iggy-consumer-fill)" />
                  <path
                    d={consumer.line}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </g>

                <g className="iggy-chart-reference">
                  <line
                    x1="0"
                    y1={CY(PRODUCER_AVG_MS)}
                    x2={X_MAX}
                    y2={CY(PRODUCER_AVG_MS)}
                    stroke="#ff9103"
                    strokeOpacity="0.3"
                    strokeDasharray="6 6"
                  />
                  <line
                    x1="0"
                    y1={CY(CONSUMER_AVG_MS)}
                    x2={X_MAX}
                    y2={CY(CONSUMER_AVG_MS)}
                    stroke="#38bdf8"
                    strokeOpacity="0.3"
                    strokeDasharray="6 6"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5">
          <div className="mb-4 font-mono text-sm text-neutral-300">
            Latency breakdown <span className="text-neutral-400">(ms)</span>
          </div>
          <table className="w-full table-fixed font-mono text-xs sm:text-sm">
            <thead>
              <tr className="text-neutral-400">
                <th className="w-[36%] pb-3 text-left font-normal">
                  Percentile
                </th>
                <th className="pb-3 text-right font-normal">Producer</th>
                <th className="pb-3 text-right font-normal">Consumer</th>
              </tr>
            </thead>
            <tbody>
              {latencyRows.map((row) => (
                <tr key={row.label} className="border-t border-white/[0.06]">
                  <td className="py-2.5 text-neutral-300">{row.label}</td>
                  <td className="py-2.5 text-right text-white">
                    {row.producer}
                  </td>
                  <td className="py-2.5 text-right text-white">
                    {row.consumer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.08] px-1 py-4">
        <span className="min-w-0 break-words font-mono text-sm text-neutral-300">
          <span className="text-neutral-200">Machine:</span> AWS i4i.4xlarge ·
          persistent log workload
        </span>
        <div className="flex flex-wrap gap-5">
          <Link
            href={PRODUCER_BENCHMARK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#ff9f22] no-underline hover:underline"
          >
            Producer result →
          </Link>
          <Link
            href={CONSUMER_BENCHMARK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-[#38bdf8] no-underline hover:underline"
          >
            Consumer result →
          </Link>
        </div>
      </div>
    </div>
  );
}
