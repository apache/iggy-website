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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404: Page not found",
};

const RECOVERY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Documentation" },
  { href: "/blogs", label: "Blog" },
  { href: "/downloads", label: "Downloads" },
  { href: "/community", label: "Community" },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-[#ff9103]">
        404
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-fd-foreground md:text-4xl">
        This page could not be found
      </h1>
      <p className="max-w-md text-fd-muted-foreground">
        The page you are looking for was moved, renamed, or never existed.
      </p>
      <Link
        href="/docs"
        className="mt-2 inline-flex items-center rounded-lg bg-[#ff9103] px-6 py-3 text-sm font-semibold text-[#0e0f11] transition-colors hover:bg-[#ffa703]"
      >
        Back to documentation
      </Link>
      <nav
        aria-label="Where to go next"
        className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-fd-muted-foreground"
      >
        {RECOVERY_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-fd-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-6 max-w-md text-xs text-fd-muted-foreground">
        Every page on this site is listed in{" "}
        <a href="/sitemap.xml" className="underline hover:text-fd-primary">
          /sitemap.xml
        </a>
        , and{" "}
        <a href="/llms.txt" className="underline hover:text-fd-primary">
          /llms.txt
        </a>{" "}
        summarises the documentation.
      </p>
    </main>
  );
}
