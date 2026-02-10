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
      const { renderMermaid } = await import("beautiful-mermaid");
      return renderMermaid(chart, {
        bg,
        fg,
        muted,
        line,
        accent,
        font: "Geist Sans, sans-serif",
        transparent: true,
      });
    }),
  );

  const scaled = svg
    .replaceAll('font-size="13"', 'font-size="15"')
    .replaceAll('font-size="12"', 'font-size="14"')
    .replaceAll('font-size="11"', 'font-size="14"')
    .replaceAll('font-size="10"', 'font-size="13"');

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
