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
// Update these when a new benchmark run is published.
export const LATENCY_MS = {
  producer: { avg: 0.466, median: 0.349, p95: 0.886, p99: 0.976, p999: 1.114 },
  consumer: { avg: 0.357, median: 0.351, p95: 0.446, p99: 0.495, p999: 0.566 },
};
