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
  title: "Team",
  description: "Apache Iggy PPMC members, mentors and committers.",
};

const members = [
  { name: "Grzegorz Koszyk", apacheId: "gkoszyk", roles: ["PPMC Member"] },
  { name: "Hubert Gruszecki", apacheId: "hgruszecki", roles: ["PPMC Member"] },
  { name: "Hulk Lin", apacheId: "hulk", roles: ["Mentor", "PPMC Member"] },
  { name: "Kranti Parisa", apacheId: "kranti", roles: ["PPMC Member"] },
  { name: "Patryk Huzarski", apacheId: "patryk", roles: ["PPMC Member"] },
  { name: "Piotr Gankiewicz", apacheId: "piotr", roles: ["PPMC Member"] },
  { name: "Zili Chen", apacheId: "tison", roles: ["Mentor", "PPMC Member"] },
  { name: "Hao Ding", apacheId: "xuanwo", roles: ["Mentor", "PPMC Member"] },
  {
    name: "Yonik Seeley",
    apacheId: "yonik",
    roles: ["Champion", "Mentor", "PPMC Member"],
  },
  { name: "Atharva Lade", apacheId: "atharva", roles: ["Committer"] },
  {
    name: "Bakytgerey Ashirbekov",
    apacheId: "bashirbekov",
    roles: ["Committer"],
  },
  { name: "Bartosz Ciesla", apacheId: "bciesla", roles: ["Committer"] },
  { name: "Kyle Downey", apacheId: "kdowney", roles: ["Committer"] },
  { name: "Krishna Vishal", apacheId: "krishna", roles: ["Committer"] },
  { name: "Lukasz Zborek", apacheId: "lzborek", roles: ["Committer"] },
  { name: "Maciej Modzelewski", apacheId: "maciej", roles: ["Committer"] },
  {
    name: "Raveendra Yerraguntla",
    apacheId: "raviyerraguntla",
    roles: ["Committer"],
  },
  { name: "Rimuksh Kansal", apacheId: "rimuksh", roles: ["Committer"] },
  { name: "Thibaut Lambert", apacheId: "t1b0", roles: ["Committer"] },
];

const roleDescriptions = [
  {
    title: "Champion",
    body: "The champion helps introduce the podling to the Apache Incubator and supports the project through incubation.",
  },
  {
    title: "Mentor",
    body: "Mentors are experienced Apache members who guide the podling on Apache governance, releases, community health and ASF policy.",
  },
  {
    title: "PPMC Member",
    body: "The Podling Project Management Committee stewards the project while it is in incubation, including community growth, releases and project oversight.",
  },
  {
    title: "Committer",
    body: "Committers have write access to project repositories and help review, merge, test, document and discuss project work in public.",
  },
];

export default function TeamPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Team"
        description="We would like to thank the members, mentors and committers who help build Apache Iggy and guide the project through incubation."
      />

      <p className="mb-8 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        This page mirrors the public Apache roster for convenience. The canonical
        project roster is maintained by the Apache Software Foundation on{" "}
        <ExternalLink href="https://people.apache.org/phonebook.html?podling=iggy">
          people.apache.org
        </ExternalLink>
        .
      </p>

      <h2 className="mb-4 text-2xl font-bold text-fd-foreground">Members</h2>
      <div className="overflow-x-auto rounded-xl border border-fd-border">
        <table className="w-full text-left text-sm text-fd-foreground">
          <thead>
            <tr className="bg-fd-accent/60">
              <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                Public Name
              </th>
              <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                Apache ID
              </th>
              <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                Role(s)
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.apacheId}
                className="border-b border-fd-border/50 transition-colors last:border-b-0 hover:bg-fd-accent/30"
              >
                <td className="px-5 py-4 font-semibold">{member.name}</td>
                <td className="px-5 py-4">
                  <ExternalLink
                    href={`https://people.apache.org/committer-index.html#${member.apacheId}`}
                  >
                    {member.apacheId}
                  </ExternalLink>
                </td>
                <td className="px-5 py-4 text-fd-muted-foreground">
                  {member.roles.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Roles
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {roleDescriptions.map((role) => (
          <section
            key={role.title}
            className="rounded-xl border border-fd-border bg-fd-card p-5"
          >
            <h3 className="mb-2 text-lg font-bold text-fd-foreground">
              {role.title}
            </h3>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              {role.body}
            </p>
          </section>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Contributors
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Many more people contribute through issues, pull requests, discussions,
        testing, documentation and community support. You can find a broader
        contributor list in the{" "}
        <ExternalLink href="https://github.com/apache/iggy/graphs/contributors">
          Apache Iggy GitHub repository
        </ExternalLink>
        .
      </p>
    </CommunityLayout>
  );
}
