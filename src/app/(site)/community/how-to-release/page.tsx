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
  title: "How to Release",
  description: "Release guidance for Apache Iggy release managers.",
};

const releaseSteps = [
  "Prepare the release candidate from a clean source state and update versioned metadata.",
  "Build source artifacts, checksums and OpenPGP signatures.",
  "Verify licenses, NOTICE files, dependency metadata and source-only release contents.",
  "Call a vote on the dev mailing list and allow the required voting period.",
  "After approval, publish artifacts to Apache distribution infrastructure and update the website.",
  "Announce the release only after mirrors and public metadata have settled.",
];

export default function HowToReleasePage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="How to Release"
        description="Apache releases are source releases voted on by the project community. This page gives release managers a high-level checklist for Apache Iggy."
      />

      <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
        Release Checklist
      </h2>
      <ol className="list-decimal space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
        {releaseSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Required Reading
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
        <li>
          <ExternalLink href="https://www.apache.org/legal/release-policy.html">
            ASF release policy
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://www.apache.org/dev/release-distribution">
            ASF release distribution
          </ExternalLink>
        </li>
      </ul>
    </CommunityLayout>
  );
}
