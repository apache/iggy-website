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

import Link from "next/link";

export const communityPages = [
  {
    title: "Team",
    href: "/community/team",
    description: "Meet the people stewarding Apache Iggy.",
  },
  {
    title: "Brand Kit",
    href: "/community/brand-kit",
    description: "Use Apache Iggy names and marks correctly.",
  },
  {
    title: "Become a Committer",
    href: "/community/become-a-committer",
    description: "Understand the path from contributor to committer.",
  },
  {
    title: "How to Contribute",
    href: "/community/how-to-contribute",
    description: "Find the right first issue, discussion or doc task.",
  },
  {
    title: "How to Release",
    href: "/community/how-to-release",
    description: "Follow the release-manager checklist.",
  },
];

export function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Link
            href="/community"
            className="mb-5 block text-sm font-semibold uppercase tracking-wide text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Community
          </Link>
          <nav className="space-y-1">
            {communityPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block rounded-lg px-3 py-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/60 hover:text-fd-foreground"
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}

export function CommunityHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-12">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
        {title}
      </h1>
      <p className="max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
        {description}
      </p>
    </header>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-fd-primary hover:underline">
      {children}
    </Link>
  );
}
