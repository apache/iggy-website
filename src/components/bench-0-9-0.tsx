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
 * headline tiles on top, then selected improving workloads with two dots on a log
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
  after: { label: "Next version", color: "#fb4800" },
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

// Keep CSS coordinates stable across server and browser floating-point math.
function positionPercent(value: number): string {
  return `${Number(value.toFixed(3))}%`;
}

function formatMs(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 3 });
}

function formatMbps(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
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

export function Bench090DurabilityChart() {
  const [setupKey, setSetupKey] = useState<SetupKey>("cluster");
  const [percentile, setPercentile] = useState<Percentile>("p50");
  const titleId = useId();
  const setup = findSetup(setupKey);
  const policies = [
    { label: "Replicated", workload: "pinned producer, 20 actors, 800 MB/s", color: "#38bdf8" },
    { label: "Persisted", workload: "pinned producer, 20 actors, persisted, 800 MB/s", color: "#fb4800" },
  ].map((policy) => ({
    ...policy,
    row: setup.rows.find((row) => row.workload === policy.workload)!,
  }));
  const maximum = Math.ceil(Math.max(...policies.flatMap(({ row }) => row[percentile])));

  return (
    <section aria-labelledby={titleId} className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-4 sm:p-6">
      <h3 id={titleId} className="m-0 text-lg font-semibold text-fd-foreground">Replicated vs. Persisted</h3>
      <p className="m-0 mt-2 text-sm font-medium leading-relaxed text-fd-foreground">20 pinned producers · 800 MB/s aggregate rate limit</p>
      <p className="m-0 mt-1 text-xs leading-relaxed text-fd-muted-foreground">Compare both durability policies within each version. Next version is a development snapshot using its own iggy-bench client.</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Segmented label="Durability deployment" value={setupKey} options={SETUPS.map(({ key, label }) => ({ key, label }))} onChange={setSetupKey} />
        <Segmented label="Durability percentile" value={percentile} options={PERCENTILES} onChange={setPercentile} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([0, 1] as const).map((version) => (
          <div key={version} className="min-w-0 rounded-lg border border-fd-border bg-fd-muted/20 p-4">
            <h4 className="m-0 text-sm font-semibold text-fd-foreground">{version === 0 ? "0.9.0" : "Next version"}</h4>
            <div className="mt-5 space-y-5">
              {policies.map(({ label, color, row }) => (
                <div key={label}>
                  <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-fd-foreground">{label}</span>
                    <span className="shrink-0 font-mono tabular-nums text-fd-foreground">{formatMs(row[percentile][version])} ms</span>
                  </div>
                  <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-fd-muted">
                    <div className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300" style={{ width: positionPercent(row[percentile][version] / maximum * 100), backgroundColor: color }} />
                  </div>
                  <p className="m-0 mt-1 text-[11px] leading-relaxed tabular-nums text-fd-muted-foreground">Achieved: {formatMbps(row.mbps[version])} MB/s</p>
                </div>
              ))}
            </div>
            <div aria-hidden="true" className="mt-3 flex justify-between border-t border-fd-border pt-1 text-[10px] tabular-nums text-fd-muted-foreground"><span>0</span><span>{maximum} ms</span></div>
          </div>
        ))}
      </div>

      <p className="m-0 mt-4 text-xs leading-relaxed text-fd-muted-foreground">{setup.label}, {percentile} latency. Both panels use the same linear scale from zero. Lower is better.</p>
      <p className="m-0 mt-2 text-xs leading-relaxed text-fd-muted-foreground"><strong>Replicated:</strong> quorum commit and local application. <strong>Persisted:</strong> also requires recoverable copies on stable storage at the quorum. On a single node, the quorum is one.</p>
    </section>
  );
}

export function Bench090LatencyChart() {
  const [setupKey, setSetupKey] = useState<SetupKey>("cluster");
  const [percentile, setPercentile] = useState<Percentile>("p999");
  const [order, setOrder] = useState<Order>("table");
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const titleId = useId();

  const setup = findSetup(setupKey);
  const improvingRows = setup.rows.filter((row) =>
    PERCENTILES.every(({ key }) => row[key][1] < row[key][0]),
  );
  const values = improvingRows.flatMap((row) => row[percentile]);
  const ticks = axisTicks(values);
  const lo = ticks[0];
  const hi = ticks[ticks.length - 1];
  const x = (value: number) => logPosition(value, lo, hi);

  const rows =
    order === "change"
      ? [...improvingRows].sort((a, b) => Math.abs(deltaPercent(b[percentile])) - Math.abs(deltaPercent(a[percentile])))
      : improvingRows;

  const active = focused ?? hovered ?? pinned;

  const openHighlight = (h: (typeof HIGHLIGHTS)[number]) => {
    setSetupKey(h.setup);
    setPercentile(h.percentile);
    setPinned(h.workload);
  };

  const gridColumns = "grid-cols-[minmax(0,1fr)_3rem] sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_3.25rem]";

  return (
    <div className="not-prose my-8 rounded-xl border border-fd-border bg-fd-card p-4 sm:p-6" aria-labelledby={titleId}>
      <h3 id={titleId} className="m-0 text-lg font-semibold text-fd-foreground">
        Latency improvements: 0.9.0 → next version
      </h3>
      <p className="m-0 mt-2 text-sm font-medium leading-relaxed text-fd-foreground">
        All shown workloads use an aggregate rate limit of 800 MB/s.
      </p>
      <p className="m-0 mt-1 text-xs leading-relaxed text-fd-muted-foreground">
        Selected workloads with lower p50, p99 and p999 latency. Next version is a development snapshot, using its own iggy-bench client. Milliseconds on a log scale, lower is better. Expand “Full benchmark results” below for all measurements, including regressions and achieved throughput.
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
        <div className="col-span-2 mb-2 text-[11px] text-fd-muted-foreground sm:col-span-1 sm:mb-0">
          {setup.label}, {percentile}
        </div>
        <div className="relative h-4">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute bottom-0 -translate-x-1/2 text-[11px] tabular-nums text-fd-muted-foreground"
              style={{ left: positionPercent(x(tick)) }}
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
          const workloadLabel = row.workload.replace(/, 800 MB\/s$/, "");
          const left = Math.min(x(before), x(after));
          const width = Math.abs(x(after) - x(before));

          return (
            <li key={row.workload} className="m-0 p-0">
              <button
                type="button"
                onMouseEnter={() => setHovered(row.workload)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setFocused(row.workload)}
                onBlur={() => setFocused(null)}
                onClick={() => setPinned(pinned === row.workload ? null : row.workload)}
                aria-pressed={pinned === row.workload}
                aria-label={`${row.workload}: ${percentile} ${formatMs(before)} ms on 0.9.0, ${formatMs(after)} ms on development, ${formatDelta(pct)}. Throughput ${formatMbps(row.mbps[0])} to ${formatMbps(row.mbps[1])} MB/s`}
                className={`relative grid ${gridColumns} w-full items-center gap-x-3 rounded-md px-1 py-2 text-left outline-none transition-colors hover:bg-fd-muted/40 focus-visible:bg-fd-muted/40 focus-visible:ring-1 focus-visible:ring-fd-primary/60 sm:py-1 ${
                  isActive ? "bg-fd-muted/40" : ""
                }`}
              >
                <span className="col-span-2 block sm:col-span-1">
                  <span className="block text-xs leading-snug text-fd-foreground/85">{workloadLabel}</span>
                  {row.workload.includes("1 actor") && (
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
                      style={{ left: positionPercent(x(tick)) }}
                    />
                  ))}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-fd-muted-foreground/40 motion-safe:transition-[left,width] motion-safe:duration-300"
                    style={{ left: positionPercent(left), width: positionPercent(width) }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fd-card motion-safe:transition-[left] motion-safe:duration-300"
                    style={{ left: positionPercent(x(before)), backgroundColor: SERIES.before.color }}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-fd-card motion-safe:transition-[left,transform] motion-safe:duration-300 ${
                      isActive ? "scale-125" : ""
                    }`}
                    style={{ left: positionPercent(x(after)), backgroundColor: SERIES.after.color }}
                  />
                </span>

                {isActive && (
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute inset-x-0 bottom-full z-10 mb-2 max-w-full rounded-md border border-fd-border bg-fd-popover px-3 py-2 text-left text-xs shadow-lg sm:left-auto sm:right-12 sm:w-max sm:max-w-[20rem]"
                  >
                    <span className="block font-medium text-fd-foreground">{workloadLabel}</span>
                    <span className="mt-1 flex items-center gap-2 tabular-nums">
                      <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: SERIES.before.color }} aria-hidden="true" />
                      <span className="font-semibold text-fd-foreground">{formatMs(before)} ms</span>
                      <span className="text-fd-muted-foreground">0.9.0, {formatMbps(row.mbps[0])} MB/s</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 tabular-nums">
                      <span className="inline-block h-0.5 w-3 rounded-full" style={{ backgroundColor: SERIES.after.color }} aria-hidden="true" />
                      <span className="font-semibold text-fd-foreground">{formatMs(after)} ms</span>
                      <span className="text-fd-muted-foreground">dev, {formatMbps(row.mbps[1])} MB/s</span>
                    </span>
                  </span>
                )}

                <span className={`text-right text-xs font-medium tabular-nums ${deltaClass(pct)}`}>{formatDelta(pct)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="m-0 mt-4 text-[11px] leading-relaxed text-fd-muted-foreground">
        Change is the {percentile} latency on the development branch relative to 0.9.0. Biggest change sorts by the largest percentage reduction. Click a row to keep its values open. Snapshot of work in progress, not a final result.
      </p>
    </div>
  );
}
