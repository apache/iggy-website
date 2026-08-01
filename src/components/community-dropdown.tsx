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

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export const communityLinks = [
  { text: "Team", url: "/community/team" },
  { text: "How to Contribute", url: "/community/how-to-contribute" },
  { text: "Become a Committer", url: "/community/become-a-committer" },
  { text: "How to Release", url: "/community/how-to-release" },
  { text: "Brand Kit", url: "/community/brand-kit" },
];

export function CommunityDropdown() {
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
        aria-expanded={open}
      >
        Community
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M2 4l3 3 3-3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[190px] rounded-lg border border-fd-border bg-fd-popover py-1 shadow-lg">
          {communityLinks.map((link) => (
            <Link
              key={link.url}
              href={link.url}
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
