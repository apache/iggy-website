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
  title: "Apache Iggy Team",
  description: "Apache Iggy PMC members, committers and contributors.",
};

const members = [
  { name: "Kranti Parisa", apacheId: "kranti", roles: ["PMC Chair"] },
  { name: "Grzegorz Koszyk", apacheId: "gkoszyk", roles: ["PMC Member"] },
  { name: "Hao Ding", apacheId: "xuanwo", roles: ["PMC Member"] },
  { name: "Hubert Gruszecki", apacheId: "hgruszecki", roles: ["PMC Member"] },
  { name: "Hulk Lin", apacheId: "hulk", roles: ["PMC Member"] },
  { name: "Patryk Huzarski", apacheId: "patryk", roles: ["PMC Member"] },
  { name: "Piotr Gankiewicz", apacheId: "piotr", roles: ["PMC Member", "Iggy Original Creator"] },
  {
    name: "Yonik Seeley",
    apacheId: "yonik",
    roles: ["PMC Member"],
  },
  { name: "Zili Chen", apacheId: "tison", roles: ["PMC Member"] },
  { name: "Atharva Lade", apacheId: "atharva", roles: ["Committer"] },
  {
    name: "Bakytgerey Ashirbekov",
    apacheId: "bashirbekov",
    roles: ["Committer"],
  },
  { name: "Bartosz Ciesla", apacheId: "bciesla", roles: ["Committer"] },
  { name: "Chengxi Luo", apacheId: "chengxi", roles: ["Committer"] },
  { name: "Krishna Vishal", apacheId: "krishna", roles: ["Committer"] },
  { name: "Kyle Downey", apacheId: "kdowney", roles: ["Committer"] },
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
    title: "PMC Chair",
    body: "The PMC Chair is a PMC member appointed by the ASF Board of Directors as an officer of the Foundation and Vice President of Apache Iggy. The Chair serves as the primary point of contact between the Board and the project and is responsible for submitting regular reports on the health of the project. The Chair has no additional authority or decision-making power over other PMC members.",
  },
  {
    title: "PMC Member",
    body: "The Project Management Committee (PMC) is responsible for the management and oversight of the Apache Iggy project. While committers have the ability to update the code, only the PMC as a body has the authority to vote on formal releases of the project's software. The PMC is also responsible for voting in new committers and PMC members, and for the project's legal, IP, trademark, and community affairs following ASF policy.",
  },
  {
    title: "Committer",
    body: "Committers have read-write access to the code repository, signed the CLA, and use an @apache.org email. There's no timeline or specific requirement to become a committer, but active contributors are strong candidates. As a committer, you shape the project's future by reviewing and merging code, testing release candidates, participating in discussions, and contributing in various ways. Active committers may be invited to join the PMC.",
  },
];

export default function TeamPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Team"
        description="We'd like to thank the following members and committers to the Apache Iggy project who have helped get the project to where it is today. "
      />

      <p className="mb-8 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        This page mirrors the public Apache roster for convenience. The canonical
        project roster is maintained by the Apache Software Foundation on{" "}
        <ExternalLink href="https://people.apache.org/committers-by-project.html#iggy">
          people.apache.org
        </ExternalLink>
        .
      </p>

      <h2 className="mb-4 text-2xl font-bold text-fd-foreground">Members</h2>
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Members are grouped by role in the order of PMC Chair, PMC Member, and Committer, and sorted alphabetically by public name within each group.
      </p>
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
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        The Apache Iggy project recognizes the following roles, each representing a distinct type of contribution to the project’s development:
      </p>
      <div className="grid gap-4">
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
