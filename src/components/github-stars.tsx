"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatStars(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

export function GitHubStars() {
  const [stars, setStars] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/apache/iggy")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(formatStars(data.stargazers_count));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Link
      href="https://github.com/apache/iggy"
      target="_blank"
      className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/60 px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
    >
      GitHub{" "}
      {stars && (
        <span className="inline-flex items-center gap-1 text-fd-primary">
          &#9733; {stars}
        </span>
      )}
    </Link>
  );
}
