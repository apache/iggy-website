"use client";

import { useState } from "react";
import Link from "next/link";

const asfLinks = [
  { text: "Foundation", url: "https://www.apache.org/" },
  { text: "License", url: "https://www.apache.org/licenses/" },
  { text: "Events", url: "https://www.apache.org/events/current-event" },
  { text: "Security", url: "https://www.apache.org/security/" },
  {
    text: "Sponsorship",
    url: "https://www.apache.org/foundation/sponsorship.html",
  },
  {
    text: "Privacy",
    url: "https://privacy.apache.org/policies/privacy-policy-public.html",
  },
  { text: "Thanks", url: "https://www.apache.org/foundation/thanks.html" },
];

export function ASFMobileLinks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-fd-border pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        ASF
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2 4l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 pl-2 pt-1">
          {asfLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              className="rounded-md px-2 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
