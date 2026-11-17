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

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const DASHBOARD_URL = "https://benchmarks.iggy.apache.org";

interface BenchChartProps {
  /** The run to show: an iggy-bench run UUID, or an OMB run id when `omb` is set. */
  run: string;
  /** True for an OpenMessaging Benchmark run, false for an iggy-bench run. */
  omb?: boolean;
  /**
   * The chart of the run. iggy-bench: latency, throughput or distribution.
   * OMB: latency, end_to_end_latency, throughput, ladder or quantiles.
   */
  type?: string;
  /** Names the chart for screen readers. */
  title: string;
}

/**
 * A live chart of one run on the benchmark dashboard, in an iframe that follows the site theme.
 * Put an ordinary Markdown link to the run under it: the Markdown copy of a page keeps this
 * component as raw MDX, and the link still works when the dashboard is down.
 */
export function BenchChart({ run, omb = false, type = "latency", title }: BenchChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = resolvedTheme === "light" ? "light" : "dark";
  const path = omb ? `embed/omb/${run}` : `embed/${run}`;
  const params = new URLSearchParams({ type, theme });
  const src = `${DASHBOARD_URL}/${path}?${params}`;

  return (
    <div className="not-prose mt-6 mb-2 aspect-[3/2] min-h-80 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      {mounted && (
        <iframe
          key={src}
          src={src}
          title={title}
          loading="lazy"
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
