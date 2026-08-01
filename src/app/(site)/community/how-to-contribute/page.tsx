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
  CommunityHeader,
  CommunityLayout,
  ExternalLink,
} from "../_components/community-layout";

export const metadata: Metadata = {
  title: "How to Contribute",
  description: "Start contributing to Apache Iggy.",
};

const contributionAreas = [
  "Fix bugs or improve performance in the server, SDKs, connectors or tooling.",
  "Improve documentation, examples, diagrams and release notes.",
  "Report reproducible issues with version, platform, logs and a minimal test case.",
  "Review pull requests and help validate behavior across supported transports.",
  "Join design discussions and propose changes before starting large work.",
];

export default function HowToContributePage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="How to Contribute"
        description="Apache Iggy welcomes contributions from people using, testing, documenting and building the project."
      />

      <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
        Good Places to Start
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
        {contributionAreas.map((area) => (
          <li key={area}>{area}</li>
        ))}
      </ul>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Project Channels
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-fd-border bg-fd-card p-5">
          <h3 className="mb-2 text-lg font-bold text-fd-foreground">Code</h3>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            Use the{" "}
            <ExternalLink href="https://github.com/apache/iggy">
              Apache Iggy repository
            </ExternalLink>{" "}
            for source code, pull requests and issue tracking.
          </p>
        </section>
        <section className="rounded-xl border border-fd-border bg-fd-card p-5">
          <h3 className="mb-2 text-lg font-bold text-fd-foreground">
            Discussion
          </h3>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            Use <code>dev@iggy.apache.org</code> for project decisions and{" "}
            <ExternalLink href="https://discord.gg/apache-iggy">
              Discord
            </ExternalLink>{" "}
            for informal conversation.
          </p>
        </section>
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Before Opening a Pull Request
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Keep changes focused, explain why the change matters, include tests or
        reproduction notes when possible, and make sure any large design change
        has been discussed publicly first.
      </p>
    </CommunityLayout>
  );
}
