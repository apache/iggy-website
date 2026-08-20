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

import { use, useEffect, useState } from "react";
import { useTheme } from "next-themes";

const cache = new Map<string, Promise<string>>();

function cacheRender(key: string, fn: () => Promise<string>): Promise<string> {
  const cached = cache.get(key);
  if (cached) return cached;
  const promise = fn();
  cache.set(key, promise);
  return promise;
}

function MermaidSVG({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const bg = isDark ? "#070c17" : "#ffffff";
  const fg = isDark ? "#fffaeb" : "#09090b";
  const muted = isDark ? "#aaafb6" : "#404040";
  const line = isDark ? "#3d4450" : "#909090";
  const accent = isDark ? "#ff9103" : "#e07d00";

  const svg = use(
    cacheRender(`${chart}-${resolvedTheme}`, async () => {
      const { renderMermaidSVGAsync } = await import("beautiful-mermaid");
      return renderMermaidSVGAsync(chart, {
        bg,
        fg,
        muted,
        line,
        accent,
        font: "sans-serif",
        transparent: true,
      });
    }),
  );

  // Zoom the whole SVG for readability. Bumping font-size attributes instead
  // would grow text after layout, overflowing node boxes sized for the
  // original metrics and colliding adjacent nodes.
  const scaled = svg.replace(
    / width="([0-9.]+)" height="([0-9.]+)"/,
    (_, width, height) =>
      ` width="${Math.round(Number(width) * 1.15)}" height="${Math.round(Number(height) * 1.15)}"`,
  );

  return (
    <div
      className="my-6 flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: scaled }}
    />
  );
}

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <MermaidSVG chart={chart} />;
}
