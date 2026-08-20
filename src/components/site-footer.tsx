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

const footerSections = [
  {
    title: "Docs",
    links: [{ text: "Documentation", url: "/docs" }],
  },
  {
    title: "Community",
    links: [
      { text: "Team", url: "/community/team" },
      { text: "Contribute", url: "/community/how-to-contribute" },
      { text: "Discord", url: "https://discord.gg/apache-iggy" },
      { text: "LinkedIn", url: "https://www.linkedin.com/company/apache-iggy/" },
    ],
  },
  {
    title: "More",
    links: [
      { text: "Blogs", url: "/blogs" },
      { text: "Downloads", url: "/downloads" },
      { text: "GitHub", url: "https://github.com/apache/iggy" },
      { text: "Benchmarks", url: "https://benchmarks.iggy.apache.org" },
    ],
  },
  {
    title: "Apache",
    links: [
      { text: "Foundation", url: "https://www.apache.org/" },
      { text: "License", url: "https://www.apache.org/licenses/" },
      { text: "Events", url: "https://events.apache.org/" },
      {
        text: "Donate",
        url: "https://www.apache.org/foundation/contributing.html",
      },
      {
        text: "Sponsors",
        url: "https://www.apache.org/foundation/sponsorship.html",
      },
      { text: "Security", url: "https://www.apache.org/security/" },
      {
        text: "Privacy",
        url: "https://privacy.apache.org/policies/privacy-policy-public.html",
      },
    ],
  },
];

function isExternal(url: string) {
  return url.startsWith("https://");
}

export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border bg-fd-background px-6 py-14 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-fd-primary">
                {section.title}
              </h2>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => {
                  const external = isExternal(link.url);

                  return (
                    <li key={link.url}>
                      <Link
                        href={link.url}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                      >
                        {link.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-fd-border pt-8 text-xs leading-relaxed text-fd-muted-foreground/70">
          <p className="mt-4">
            Copyright &copy; {new Date().getFullYear()} The Apache Software
            Foundation, Licensed under the Apache License, Version 2.0.
          </p>
          <p className="mt-4">
            Apache, Apache Iggy, the Apache feather logo, and related marks are
            trademarks of the Apache Software Foundation. All other marks
            mentioned may be trademarks or registered trademarks of their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
