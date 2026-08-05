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
  title: "Become a Committer",
  description: "How contributors become Apache Iggy committers.",
};

const practices = [
  "Contribute useful changes over time: code, tests, documentation, examples, benchmarks, reviews or release help.",
  "Discuss decisions in public on issues, pull requests and the dev mailing list.",
  "Review other contributors' work and help keep conversations constructive.",
  "Show good judgment around compatibility, licensing, security and release quality.",
];

export default function BecomeACommitterPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Become a Committer"
        description="Committership is granted by the project when someone has earned trust through sustained, constructive contributions."
      />

      <p className="mb-8 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        There is no application form, checklist or required timeline. The PPMC
        looks for contributors who make the project healthier and who can be
        trusted with repository write access.
      </p>

      <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
        What Helps
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
        {practices.map((practice) => (
          <li key={practice}>{practice}</li>
        ))}
      </ul>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        How It Works
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Existing PPMC members privately discuss and vote on new committers. If
        the vote passes and the contributor accepts, Apache account setup and
        project access follow the ASF process.
      </p>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-fd-muted-foreground">
        For broader ASF guidance, read Apache Community Development&apos;s{" "}
        <ExternalLink href="https://community.apache.org/contributors/becomingacommitter.html">
          Becoming a Committer
        </ExternalLink>{" "}
        page.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Path to PMC Membership
      </h2>
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-fd-muted-foreground">
        <p>
          The Project Management Committee (PMC or PPMC during incubation) is the official controlling body of the project. PMC members “must” be able to perform the official responsibilities of the PMC (verify releases and growth of committers/PMC). We “want” them to be people that have a vision for Iggy, technology and community wise.
        </p>
        <p>
          For the avoidance of doubt, not every PMC member needs to know all details of how exactly Iggy’s release process works (it is okay to understand the gist and how to find the details). Likewise, not every PMC member needs to be a visionary. We strive to build a PMC that covers all parts well, understanding that each member brings different strengths.
        </p>
        <p>
          Ideally, we find candidates among active community members that have shown initiative to shape the direction of Iggy (technology and community) and have shown willingness to learn the official processes, such as how to create or verify for releases.
        </p>
        <p>
          For more details on PMC roles and responsibilities, see <ExternalLink href="https://www.apache.org/foundation/how-it-works/#pmc">Apache PMC Guide</ExternalLink>.
        </p>
      </div>
    </CommunityLayout>
  );
}
