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

// The published latency figures, in milliseconds. Everything on the homepage
// that quotes a latency reads from here: the hero in (home)/page.tsx and the
// table, chart and stat tiles in components/benchmark-chart.tsx.
//
// This lives outside the chart component because that component is a client
// component, and a server component cannot read a value through the client
// boundary - it gets a client reference rather than the data.
//
// The features page reads the stat tiles and the run links from here too.
//
// Update these when a new benchmark run is published.
export const LATENCY_MS = {
  producer: { avg: 0.466, median: 0.349, p95: 0.886, p99: 0.976, p999: 1.114 },
  consumer: { avg: 0.357, median: 0.351, p95: 0.446, p99: 0.495, p999: 0.566 },
};

export const PRODUCER_BENCHMARK_URL =
  "https://benchmarks.iggy.apache.org/runs/4bc63b0e-f0fb-44b5-8c42-6159603a5653";
export const CONSUMER_BENCHMARK_URL =
  "https://benchmarks.iggy.apache.org/runs/6ed70d0a-de98-42da-84a9-16655152d4e8";

export function benchmarkStats(decimals: number) {
  const ms = (value: number) => value.toFixed(decimals);
  return [
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
      value: ms(LATENCY_MS.producer.p99),
      unit: "ms",
      label: "Producer P99",
      detail: `${ms(LATENCY_MS.producer.avg)} ms average`,
    },
    {
      value: ms(LATENCY_MS.consumer.p99),
      unit: "ms",
      label: "Consumer P99",
      detail: `${ms(LATENCY_MS.consumer.avg)} ms average`,
    },
  ];
}

export const BENCHMARK_STATS = benchmarkStats(3);
