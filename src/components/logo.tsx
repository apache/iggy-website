"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const src =
    mounted && resolvedTheme === "light"
      ? "/img/apache-iggy-color-lightbg0.5x.png"
      : "/img/apache-iggy-color-darkbg0.5x.png";

  return (
    <Image
      src={src}
      alt="Apache Iggy"
      width={220}
      height={44}
      className={className}
      unoptimized
    />
  );
}
