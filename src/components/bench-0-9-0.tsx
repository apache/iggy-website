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

import { useId, useState } from "react";

/**
 * Latency comparison for the 0.9.0 release post: the 0.9.0 release against
 * the development branch that follows it, per iggy-bench workload. Three
 * headline tiles on top, then one row per workload with two dots on a log
 * axis joined by a line. The tables in the post carry the same numbers, so
 * the chart never gates a value.
 */

type Pair = [before: number, after: number];

type Row = {
  workload: string;
  mbps: Pair;
  p50: Pair;
  p99: Pair;
  p999: Pair;
};

type Percentile = "p50" | "p99" | "p999";
type SetupKey = "single" | "cluster";
type Order = "table" | "change";

type Setup = {
  key: SetupKey;
  label: string;
  rows: Row[];
};

const SERIES = {
  before: { label: "0.9.0", color: "#8b93a1" },
  after: { label: "next", color: "#fb4800" },
} as const;

const PERCENTILES: { key: Percentile; label: string }[] = [
  { key: "p50", label: "p50" },
  { key: "p99", label: "p99" },
  { key: "p999", label: "p999" },
];

const ORDERS: { key: Order; label: string }[] = [
  { key: "table", label: "Table order" },
  { key: "change", label: "Biggest change" },
];

const SETUPS: Setup[] = [
  {
    key: "single",
    label: "Single node",
    rows: [
      { workload: "pinned producer, 20 actors, 800 MB/s", mbps: [800.1, 800.1], p50: [0.65, 0.588], p99: [1.313, 1.145], p999: [11.087, 2.956] },
      { workload: "pinned producer, 20 actors, persisted, 800 MB/s", mbps: [800.0, 800.1], p50: [1.232, 1.098], p99: [1.601, 1.424], p999: [2.249, 1.967] },
      { workload: "pinned consumer, 20 actors, cold, 800 MB/s", mbps: [800.1, 800.1], p50: [0.498, 0.447], p99: [4.698, 3.313], p999: [5.156, 3.777] },
      { workload: "pinned consumer, 20 actors, warm, 800 MB/s", mbps: [800.1, 800.1], p50: [0.521, 0.544], p99: [1.022, 0.923], p999: [1.573, 3.92] },
      { workload: "pinned producer, 1 actor, 500 MB/s", mbps: [500, 500], p50: [0.347, 0.352], p99: [0.679, 0.683], p999: [1.356, 1.046] },
      { workload: "pinned consumer, 1 actor, warm, 500 MB/s", mbps: [500, 500], p50: [0.272, 0.296], p99: [0.468, 0.478], p999: [0.491, 0.502] },
      { workload: "pinned producer, 20 actors, no rate limit", mbps: [2062.1, 2096.5], p50: [1.086, 0.792], p99: [26.597, 46.431], p999: [40.869, 78.082] },
      { workload: "pinned consumer, 20 actors, no rate limit", mbps: [2713.4, 2532.5], p50: [0.679, 0.619], p99: [6.151, 5.869], p999: [6.476, 23.418] },
      { workload: "pinned producer, 1 actor, persisted, 500 MB/s", mbps: [372.1, 335.8], p50: [0.665, 0.733], p99: [0.825, 0.901], p999: [0.995, 1.151] },
    ],
  },
  {
    key: "cluster",
    label: "3-node cluster",
    rows: [
      { workload: "pinned producer, 20 actors, persisted, 800 MB/s", mbps: [800.0, 800.0], p50: [2.905, 2.243], p99: [7.073, 2.938], p999: [12.403, 3.889] },
      { workload: "pinned producer, 1 actor, persisted, 500 MB/s", mbps: [234.4, 233.6], p50: [1.047, 1.062], p99: [1.2, 1.223], p999: [10.857, 1.759] },
      { workload: "pinned consumer, 20 actors, cold, 800 MB/s", mbps: [800.1, 800.0], p50: [0.477, 0.436], p99: [3.831, 2.346], p999: [4.241, 2.675] },
      { workload: "pinned consumer, 20 actors, warm, 800 MB/s", mbps: [800.1, 797.9], p50: [0.484, 0.451], p99: [0.933, 0.812], p999: [1.233, 1.216] },
      { workload: "pinned producer, 20 actors, 800 MB/s", mbps: [800.0, 800.0], p50: [1.782, 1.679], p99: [3.186, 3.25], p999: [3.683, 3.66] },
      { workload: "pinned producer, 20 actors, no rate limit", mbps: [1134.5, 1132.5], p50: [4.366, 4.357], p99: [5.159, 5.296], p999: [6.299, 5.929] },
      { workload: "pinned consumer, 20 actors, no rate limit", mbps: [2710.1, 2594.3], p50: [0.682, 0.657], p99: [6.12, 5.758], p999: [6.445, 23.362] },
      { workload: "pinned producer, 1 actor, 500 MB/s", mbps: [337.2, 325.4], p50: [0.716, 0.735], p99: [0.973, 1.016], p999: [1.057, 1.13] },
      { workload: "pinned consumer, 1 actor, warm, 500 MB/s", mbps: [500.0, 500.3], p50: [0.297, 0.326], p99: [0.493, 0.536], p999: [0.533, 0.574] },
    ],
  },
];

/** The three results the post leads with. Clicking a tile opens that row in the chart. */
const HIGHLIGHTS: { setup: SetupKey; workload: string; percentile: Percentile; label: string }[] = [
  { setup: "cluster", workload: "pinned producer, 20 actors, persisted, 800 MB/s", percentile: "p999", label: "3-node cluster, persisted, 20 producers, p999" },
  { setup: "cluster", workload: "pinned producer, 20 actors, persisted, 800 MB/s", percentile: "p99", label: "3-node cluster, persisted, 20 producers, p99" },
  { setup: "single", workload: "pinned producer, 20 actors, 800 MB/s", percentile: "p999", label: "Single node, 20 producers, p999" },
];

/** Candidate tick positions for the log axis, in milliseconds. */
const TICKS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];

function axisTicks(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  let lo = 0;
  let hi = TICKS.length - 1;
  for (let i = 0; i < TICKS.length; i++) {
    if (TICKS[i] <= min) lo = i;
  }
  for (let i = TICKS.length - 1; i >= 0; i--) {
    if (TICKS[i] >= max) hi = i;
  }
  return TICKS.slice(lo, hi + 1);
}

function logPosition(value: number, lo: number, hi: number): number {
  const a = Math.log10(lo);
  const b = Math.log10(hi);
  return ((Math.log10(value) - a) / (b - a)) * 100;
}

function formatMs(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

function formatMbps(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function deltaPercent([before, after]: Pair): number {
  return ((after - before) / before) * 100;
}

function formatDelta(pct: number): string {
  const rounded = Math.round(pct);
  if (rounded === 0) return "0%";
  return `${rounded > 0 ? "+" : "-"}${Math.abs(rounded)}%`;
}

function deltaClass(pct: number): string {
  const rounded = Math.round(pct);
  if (rounded < 0) return "text-emerald-700 dark:text-emerald-400";
  if (rounded > 0) return "text-red-700 dark:text-red-400";
  return "text-fd-muted-foreground";
}

function findSetup(key: SetupKey): Setup {
  return SETUPS.find((s) => s.key === key) ?? SETUPS[0];
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (key: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md border border-fd-border p-0.5">
      {options.map((option) => {
        const active = option.key === value;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.key)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-fd-primary/15 text-fd-foreground"
                : "text-fd-muted-foreground hover:text-fd-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Bench090LatencyChart() {
  const [setupKey, setSetupKey] = useState<SetupKey>("cluster");
  const [percentile, setPercentile] = useState<Percentile>("p999");
  const [order, setOrder] = useState<Order>("table");
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const titleId = useId();

  const setup = findSetup(setupKey);
  const values = setup.rows.flatMap((row) => row[percentile]);
  const ticks = axisTicks(values);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const x = (value: number) => logPosition(value, lo, hi);

  const rows =
    order === "change"
      ? [...setup.rows].sort((a, b) => deltaPercent(a[percentile]) - deltaPercent(b[percentile]))
      : setup.rows;

  const active = hovered ?? pinned;

  const openHighlight = (h: (typeof HIGHLIGHTS)[number]) => {
    setSetupKey(h.setup);
    setPercentile(h.percentile);
    setPinned(h.workload);
  };

  const gridColumns = "grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_3rem] sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_3.25rem]";

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-4 sm:p-6" aria-labelledby={titleId}>
      <h3 id={titleId} className="m-0 text-lg font-semibold text-fd-foreground">
        Latency, 0.9.0 to the next version
      </h3>
      <p className="m-0 mt-1 text-xs text-fd-muted-foreground">
        Milliseconds on a log scale, lower is better. One row per iggy-bench workload, both arms on the same host with the same parameters. The tables below carry the same numbers.
      </p>

      {/* Headline tiles */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => {
          const row = findSetup(h.setup).rows.find((r) => r.workload === h.workload);
          if (!row) return null;
          const [before, after] = row[h.percentile];
          const pct = deltaPercent(row[h.percentile]);
          const selected = setupKey === h.setup && percentile === h.percentile && pinned === h.workload;
          return (
            <button
              key={h.label}
              type="button"
              onClick={() => openHighlight(h)}
              aria-pressed={selected}
              className={`rounded-lg border p-3 text-left transition-colors hover:border-fd-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-primary/60 ${
                selected ? "border-fd-primary/50 bg-fd-primary/5" : "border-fd-border bg-fd-muted/30"
              }`}
            >
              <span className="block text-[11px] leading-snug text-fd-muted-foreground">{h.label}</span>
              <span className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-fd-foreground">{formatMs(after)}</span>
                <span className="text-xs text-fd-muted-foreground">ms</span>
                <span className={`ml-auto text-sm font-semibold tabular-nums ${deltaClass(pct)}`}>{formatDelta(pct)}</span>
              </span>
              <span className="mt-0.5 block text-[11px] text-fd-muted-foreground">from {formatMs(before)} ms on 0.9.0</span>
            </button>
          );
        })}
      </div>

      {/* Filters and legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Segmented
          label="Deployment"
          value={setupKey}
          options={SETUPS.map((s) => ({ key: s.key, label: s.label }))}
          onChange={(key) => {
            setSetupKey(key);
            setPinned(null);
          }}
        />
        <Segmented label="Percentile" value={percentile} options={PERCENTILES} onChange={setPercentile} />
        <Segmented label="Order" value={order} options={ORDERS} onChange={setOrder} />
        <ul className="m-0 ml-auto flex list-none items-center gap-4 p-0 text-xs text-fd-muted-foreground">
          {(["before", "after"] as const).map((key) => (
            <li key={key} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SERIES[key].color }} aria-hidden="true" />
              {SERIES[key].label}
            </li>
          ))}
        </ul>
      </div>

      {/* Axis */}
      <div className={`mt-5 grid ${gridColumns} items-end gap-x-3 px-1`}>
        <div className="text-[11px] text-fd-muted-foreground">
          {setup.label}, {percentile}
        </div>
        <div className="relative h-4">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute bottom-0 -translate-x-1/2 text-[11px] tabular-nums text-fd-muted-foreground"
              style={{ left: `${x(tick)}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div className="text-right text-[11px] text-fd-muted-foreground">change</div>
      </div>

      {/* Rows */}
      <ul className="m-0 mt-1 list-none p-0">
        {rows.map((row) => {
          const [before, after] = row[percentile];
          const pct = deltaPercent(row[percentile]);
          const isActive = active === row.workload;
          const unthrottled = row.workload.endsWith("no rate limit");
          const left = Math.min(x(before), x(after));
          const width = Math.abs(x(after) - x(before));
          const tooltipLeft = Math.min(Math.max(x(after), 18), 82);

          return (
            <li key={row.workload} className="m-0 p-0">
              <button
                type="button"
                onMouseEnter={() => setHovered(row.workload)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(row.workload)}
                onBlur={() => setHovered(null)}
                onClick={() => setPinned(pinned === row.workload ? null : row.workload)}
                aria-pressed={pinned === row.workload}
                aria-label={`${row.workload}: ${percentile} ${formatMs(before)} ms on 0.9.0, ${formatMs(after)} ms on next, ${formatDelta(pct)}`}
                className={`grid ${gridColumns} w-full items-center gap-x-3 rounded-md px-1 py-1 text-left outline-none transition-colors hover:bg-fd-muted/40 focus-visible:bg-fd-muted/40 focus-visible:ring-1 focus-visible:ring-fd-primary/60 ${
                  isActive ? "bg-fd-muted/40" : ""
                }`}
              >
                <span className="block">
                  <span className="block text-xs leading-snug text-fd-foreground/85">{row.workload}</span>
                  {unthrottled && (
                    <span className="block text-[10px] leading-snug tabular-nums text-fd-muted-foreground">
                      {formatMbps(row.mbps[0])} to {formatMbps(row.mbps[1])} MB/s
                    </span>
                  )}
                </span>

                <span className="relative block h-7">
                  {ticks.map((tick) => (
                    <span
                      key={tick}
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-fd-border"
                      style={{ left: `${x(tick)}%` }}
                    />
                  ))}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-fd-muted-foreground/40 motion-safe:transition-[left,width] motion-safe:duration-300"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fd-card motion-safe:transition-[left] motion-safe:duration-300"
                    style={{ left: `${x(before)}%`, backgroundColor: SERIES.before.color }}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fd-card motion-safe:transition-[left,transform] motion-safe:duration-300 ${
                      isActive ? "scale-125" : ""
                    }`}
                    style={{ left: `${x(after)}%`, backgroundColor: SERIES.after.color }}
                  />

                  {isActive && (
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full z-10 mb-2 w-max max-w-[16rem] -translate-x-1/2 rounded-md border border-fd-border bg-fd-popover px-3 py-2 text-left text-xs shadow-lg"
                      style={{ left: `${tooltipLeft}%` }}
                    >
                      <span className="block font-medium text-fd-foreground">{row.workload}</span>
                      <span className="mt-1 flex items-center gap-2 tabular-nums">
                        <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: SERIES.before.color }} aria-hidden="true" />
                        <span className="font-semibold text-fd-foreground">{formatMs(before)} ms</span>
                        <span className="text-fd-muted-foreground">0.9.0, {formatMbps(row.mbps[0])} MB/s</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 tabular-nums">
                        <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: SERIES.after.color }} aria-hidden="true" />
                        <span className="font-semibold text-fd-foreground">{formatMs(after)} ms</span>
                        <span className="text-fd-muted-foreground">next, {formatMbps(row.mbps[1])} MB/s</span>
                      </span>
                    </span>
                  )}
                </span>

                <span className={`text-right text-xs font-medium tabular-nums ${deltaClass(pct)}`}>{formatDelta(pct)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="m-0 mt-4 text-[11px] text-fd-muted-foreground">
        Change is the {percentile} latency on the development branch relative to 0.9.0. Green is lower, red is higher. Click a row to keep its values open. Snapshot of work in progress, not a final result.
      </p>
    </div>
  );
}
