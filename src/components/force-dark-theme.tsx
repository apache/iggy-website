"use client";

import { useEffect } from "react";

export function ForceDarkTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    const prevScheme = root.style.colorScheme;

    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";

    return () => {
      if (prev) root.setAttribute("data-theme", prev);
      root.style.colorScheme = prevScheme || "";
    };
  }, []);

  return null;
}
