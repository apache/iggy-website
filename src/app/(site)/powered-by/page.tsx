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

import {
  OrganizationWall,
  UseCaseCard,
} from "@/components/organization-showcase";
import {
  organizationSlug,
  organizationsWithUseCase,
  publishedOrganizations,
  SUBMIT_GUIDE_URL,
  SUBMIT_ISSUE_URL,
} from "@/lib/organizations";
import { absoluteUrl, serializeJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Powered By Iggy",
  description:
    "Organizations, developers and open source projects building with Apache Iggy, and what they use it for.",
};

export default function PoweredByPage() {
  const allOrganizations = publishedOrganizations();
  const useCases = organizationsWithUseCase();

  /**
   * Structured data, following the pattern in the root layout: it restates
   * only what the page already says in HTML, so an answer engine reading the
   * markup and one reading the graph arrive at the same claims.
   */
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Organizations building with Apache Iggy",
    url: absoluteUrl("/powered-by"),
    numberOfItems: allOrganizations.length,
    itemListElement: allOrganizations.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        name: entry.name,
        ...(entry.website ? { url: entry.website } : {}),
        ...(entry.description ? { description: entry.description } : {}),
      },
    })),
  };

  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16">
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
            Powered By Apache Iggy™
          </h1>
          <p className="text-lg leading-relaxed text-fd-muted-foreground">
            From first experiments to production systems, teams are using Apache Iggy to power real-time data across AI and agents, financial services, observability, cybersecurity, IoT and edge, gaming, communications, analytics and big data infrastructure. Iggy is built for workloads where latency, throughput and efficiency matter.
          </p>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
            See how organizations, developers and open source projects are
            building with Iggy.
          </p>
          <a
            href={SUBMIT_ISSUE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-block rounded-lg bg-[#ff9103] px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Add your organization
          </a>
        </header>

        {useCases.length > 0 && (
          <section id="use-cases" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-fd-foreground">
              How Iggy is being used
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
              Workloads the community has shared in their own words.
            </p>
            <div
              className={`mt-6 grid gap-4 ${useCases.length > 1 ? "md:grid-cols-2" : ""}`}
            >
              {useCases.map((entry) => (
                <UseCaseCard key={organizationSlug(entry)} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {allOrganizations.length > 0 && (
          <section id="organizations" className="scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-fd-foreground">
              Organizations building &amp; integrating with Iggy
            </h2>
            <p className="mt-2 max-w-4xl text-pretty text-sm leading-relaxed text-fd-muted-foreground">
              Companies, projects and teams that have told the community they
              are using or building with Apache&nbsp;Iggy.
            </p>
            <div className="mt-6">
              <OrganizationWall entries={allOrganizations} />
            </div>
          </section>
        )}

        <section className="mt-16 rounded-2xl border border-fd-border bg-fd-card p-8">
          <h2 className="text-2xl font-bold tracking-tight text-fd-foreground">
            Evaluating or Building with Iggy? Tell the community.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
            Exploring Iggy, running a POC, building an integration, or already in production? You’re part of the story. We’d love to hear what you’re building.
          </p>
          <a
            href={SUBMIT_ISSUE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-block rounded-lg bg-[#ff9103] px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Share your use case on GitHub
          </a>
          <p className="mt-4 text-xs text-fd-muted-foreground">
            Prefer to send the pull request yourself? See the{" "}
            <a
              href={SUBMIT_GUIDE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-fd-primary hover:underline"
            >
              submission guide
            </a>
            .
          </p>
        </section>

        <footer className="mt-16 border-t border-fd-border pt-8">
          <p className="text-xs leading-relaxed text-fd-muted-foreground">
            Usage information on this page comes from community submissions as well as publicly available sources, including project documentation, GitHub issues and pull requests, blog posts, conference talks, and public social media posts. Where possible, Apache Iggy committers review entries and link to the original source. Usage, deployment stage, and other details may change over time and should be understood in the context of the cited source. Company names, product names, trademarks, and logos are the property of their respective owners. Inclusion on this page is for informational and community purposes and does not imply endorsement by the Apache Software Foundation or by the organizations listed.
          </p>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
        />
      </div>
    </main>
  );
}
