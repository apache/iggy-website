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

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

// The one bar shown site-wide, above the header. Edit this to change what it
// says, or set `enabled: false` to take it down. It is deliberately generic:
// the same slot carries a release, an event or a call for contributors.
const ANNOUNCEMENT = {
  enabled: true,
  text: "If Apache Iggy is useful to you, give it a star on GitHub",
  linkText: "Star apache/iggy",
  href: "https://github.com/apache/iggy",
};

// The docs layouts pass `sticky`. Fumadocs sizes the docs sidebar and table of
// contents from --fd-banner-height, so on desktop the bar stays at the top with
// a fixed one-line height and sets that variable. Without it, the sidebar is
// as tall as the window but starts below the bar, so its bottom is off screen.
// On mobile the sidebar is a drawer, and the bar scrolls away as on other pages.
const STICKY_HEIGHT = "2.5rem";

export function AnnouncementBar({ sticky = false }: { sticky?: boolean }) {
  if (!ANNOUNCEMENT.enabled) return null;

  return (
    <div
      className={`relative border-b border-white/[0.08] bg-gradient-to-r from-[#f9923f]/15 via-[#5f87fd]/15 to-[#fa5e8a]/15 ${
        sticky ? "bg-fd-background md:sticky md:top-0 md:z-40 md:h-10" : ""
      }`}
    >
      {sticky && (
        <style>{`@media (width >= 48rem) { :root { --fd-banner-height: ${STICKY_HEIGHT}; } }`}</style>
      )}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#f9923f] via-[#5f87fd] to-[#fa5e8a]"
      />
      <Link
        href={ANNOUNCEMENT.href}
        className={`group flex items-center justify-center gap-2 px-4 py-2.5 text-center text-[13px] text-fd-muted-foreground transition-colors hover:text-fd-foreground ${
          sticky ? "md:h-full md:py-0" : ""
        }`}
      >
        <Star
          className="hidden size-3.5 shrink-0 text-[#f9923f] sm:block"
          aria-hidden
        />
        <span>{ANNOUNCEMENT.text}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-fd-foreground">
          {ANNOUNCEMENT.linkText}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>
    </div>
  );
}
