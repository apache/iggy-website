"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const asfLinks = [
  { text: "Foundation", url: "https://www.apache.org/" },
  { text: "License", url: "https://www.apache.org/licenses/" },
  { text: "Events", url: "https://www.apache.org/events/current-event" },
  { text: "Security", url: "https://www.apache.org/security/" },
  { text: "Sponsorship", url: "https://www.apache.org/foundation/sponsorship.html" },
  { text: "Privacy", url: "https://privacy.apache.org/policies/privacy-policy-public.html" },
  { text: "Thanks", url: "https://www.apache.org/foundation/thanks.html" },
];

export function ASFDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        ASF
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-fd-border bg-fd-popover py-1 shadow-lg">
          {asfLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              className="block px-3.5 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
              onClick={() => setOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
