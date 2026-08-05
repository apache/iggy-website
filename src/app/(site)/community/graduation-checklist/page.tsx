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
  title: "Graduation Checklist",
  description:
    "Apache Iggy maturity assessment and graduation checklist for the Apache Incubator.",
};

const checklist = [
  {
    category: "Code",
    items: [
      {
        id: "CD10",
        description:
          "The project produces open source software for distribution to the public at no charge.",
        status:
          "YES. Apache Iggy source code is distributed under the Apache License, Version 2.0.",
      },
      {
        id: "CD20",
        description: "Anyone can easily discover and access the project's code.",
        status:
          "YES. Source code is linked from the website and hosted in Apache repositories mirrored on GitHub.",
      },
      {
        id: "CD30",
        description:
          "Anyone using standard, widely available tools can build the code in a reproducible way.",
        status:
          "YES. All details and instructions are documented in the README.md file of Iggy's Git repo",
      },
      {
        id: "CD40",
        description:
          "The full history of the project's code is available through source control.",
        status:
          "YES. Apache Iggy uses Git, with release tags available for published source releases.",
      },
      {
        id: "CD50",
        description:
          "The source control system establishes reliable code provenance.",
        status:
          "YES. Apache-managed Git repositories and pull request history provide provenance for committed work.",
      },
    ],
  },
  {
    category: "Licenses and Copyright",
    items: [
      {
        id: "LC10",
        description:
          "The Apache License, Version 2.0, covers the released code.",
        status:
          "YES. The project includes license files and Apache license headers.",
      },
      {
        id: "LC20",
        description:
          "Mandatory dependencies do not create restrictions beyond the Apache License.",
        status:
          "YES. All dependencies are listed.",
      },
      {
        id: "LC30",
        description:
          "Mandatory dependencies are available as open source software.",
        status:
          "YES. All dependencies are listed are available as Open Source software",
      },
      {
        id: "LC40",
        description:
          "Committers are bound by an Apache Individual Contributor License Agreement.",
        status:
          "YES. All committers have filed their respecrive ICLAs.",
      },
      {
        id: "LC50",
        description:
          "Copyright ownership of project outputs is clearly defined and documented.",
        status:
          "YES. And all source files are with APLv2 header",
      },
    ],
  },
  {
    category: "Releases",
    items: [
      {
        id: "RE10",
        description:
          "Releases consist of source code distributed using standard archive formats.",
        status:
          "YES. Source releases are distributed via downloads.apache.org and linked from the Downloads page on iggy.apache.org.",
      },
      {
        id: "RE20",
        description:
          "The PPMC and Incubator approve releases as acts of the Foundation.",
        status:
          "YES. All releases have been voted at dev@iggy.apache.org and general@incubator.apache.org, and have at least 3 PPMC member votes.",
      },
      {
        id: "RE30",
        description:
          "Releases are signed or distributed with digests for validation.",
        status:
          "YES. Downloads include signatures, SHA-512 checksums and KEYS guidance.",
      },
      {
        id: "RE40",
        description:
          "Convenience binaries are clearly distinguished from Apache releases.",
        status:
          "YES. The source release is the official Apache release. Convenience binaries are published to Docker Hub, crates.io, npm, PyPI, Maven Central and NuGet, and are not ASF releases.",
      },
      {
        id: "RE50",
        description:
          "The release process is documented and repeatable by a new release manager.",
        status:
          "YES. The How to Release page under Community section on iggy.apache.org website described the steps.",
      },
    ],
  },
  {
    category: "Quality",
    items: [
      {
        id: "QU10",
        description:
          "The project is open and honest about code quality and module maturity.",
        status:
          "YES. We encourage users to report issues on GitHub.",
      },
      {
        id: "QU20",
        description: "The project puts a high priority on secure software.",
        status:
          "YES. Security-sensitive work should continue to be handled with high priority.",
      },
      {
        id: "QU30",
        description:
          "The project provides a documented channel for reporting security issues.",
        status:
          "YES. Security issues are reported privately to security@apache.org, as described at https://www.apache.org/security/ and linked from the website. Public channels such as GitHub issues must not be used for undisclosed vulnerabilities.",
      },
      {
        id: "QU40",
        description:
          "The project prioritizes backward compatibility and documents incompatible changes.",
        status:
          "YES. We follow semantic versions. As long as it's within one major version, it's backward compatible. And when any breaking changes added, we provide clear communication and upgrade guides when applicable.",
      },
      {
        id: "QU50",
        description:
          "The project strives to respond to documented bug reports in a timely manner.",
        status:
          "YES. As of July 31, 2026, The project has resolved ~1000 issues and 2500+ pull requests so far, with very prompt response. The community is very active on the Discord channel as well.",
      },
    ],
  },
  {
    category: "Community",
    items: [
      {
        id: "CO10",
        description:
          "The project homepage points to the information required by the maturity model.",
        status:
          "YES. The official website and README.md file in the Git repo includes all information that the users need to run Apache Iggy.",
      },
      {
        id: "CO20",
        description:
          "The community welcomes good-faith contributions that add value.",
        status:
          "YES. We have 100+ contributors. Contribution paths are documented and public discussion channels are available.",
      },
      {
        id: "CO30",
        description:
          "Contributions include code, documentation, bug reports, discussions and other project value.",
        status:
          "YES. All good contributions including code and non-code are welcomed.",
      },
      {
        id: "CO40",
        description:
          "The community is meritocratic and grants more responsibility over time.",
        status:
          "YES. The community has elected 5 new committers since joining Apache Incubator, with a total of 19 Committers.",
      },
      {
        id: "CO50",
        description:
          "The project documents how contributors can earn commit access or decision power.",
        status:
          "YES. The community has clear docs on nominating committers.",
      },
      {
        id: "CO60",
        description:
          "The community operates by consensus among members with decision power.",
        status:
          "YES. All decisions are made after vote by community members.",
      },
      {
        id: "CO70",
        description: "The project strives to answer user questions promptly.",
        status:
          "YES. We use dev@iggy.apache.org, GitHub issues and GitHub discussions to do this in a timely manner. We're also active on the Discord channel.",
      },
    ],
  },
  {
    category: "Consensus Building",
    items: [
      {
        id: "CS10",
        description:
          "The project maintains a public list of contributors with decision power.",
        status:
          "YES. The Team page links to the canonical Apache roster and lists PPMC members, mentors and committers.",
      },
      {
        id: "CS20",
        description:
          "Decisions are made by consensus and documented on the main communication channel.",
        status:
          "YES. All decisions are made by votes on dev@iggy.apache.org, and with at least 3 +1 votes from PPMC.",
      },
      {
        id: "CS30",
        description:
          "Documented voting rules are used when discussion is not sufficient.",
        status:
          "YES. The project uses the standard ASF voting rules.",
      },
      {
        id: "CS40",
        description:
          "Vetoes are limited to code commits and justified with technical explanations.",
        status:
          "YES. Continue following ASF voting and veto expectations.",
      },
      {
        id: "CS50",
        description:
          "Important discussions happen asynchronously in written form.",
        status:
          "YES. All important discussions and conclusions are recorded in written form on GitHub issues and discussions.",
      },
    ],
  },
  {
    category: "Independence",
    items: [
      {
        id: "IN10",
        description:
          "The project is independent from corporate or organizational influence.",
        status:
          "YES. The current PPMC includes long-time Apache committers and PMC members, along with engineers from LaserData, Inc., the company that donated Iggy to the Apache Software Foundation in February 2025. There are many Committers outside this company, who are on the path to become PPMC/PMC members.",
      },
      {
        id: "IN20",
        description:
          "Contributors act as themselves, not as representatives of employers or organizations.",
        status:
          "YES. Continue reinforcing individual participation in votes, reviews and decisions.",
      },
    ],
  },
  {
    category: "Trademark and Branding",
    items: [
      {
        id: "TB10",
        description:
          "The project uses the Apache project name consistently with trademark attribution.",
        status:
          "YES. Continue using Apache Iggy (Incubating) in formal contexts until graduation.",
      },
      {
        id: "TB20",
        description:
          "The primary homepage is at an apache.org domain and non-apache.org domains are ASF-owned when used.",
        status:
          "YES. The public websites are served from iggy.apache.org and benchmarks.iggy.apache.org. No non-apache.org domain names are used.",
      },
      {
        id: "TB30",
        description:
          "The ASF has trademark rights to the project name, logo and major branding elements.",
        status:
          "YES. As an incubating project, Apache Iggy is not yet on the ASF page https://www.apache.org/foundation/marks/list/, but the ASF holds common law trademark rights through the incubation process. The project name, logo, and all branding assets are hosted exclusively on ASF infrastructure (iggy.apache.org). Formal trademark registration is typically pursued upon graduation.",
      },
      {
        id: "TB40",
        description:
          "The project monitors major brand misuse and reports potential misuse to ASF Brand Management.",
        status:
          "YES. No major misuses of the Apache Iggy brand have been identified to date. The PPMC should continue monitoring public use of Apache Iggy marks.",
      },
    ],
  },
];

const nextSteps = [
  "Create or link an umbrella graduation issue for open checklist items.",
  "Confirm podling status-file tasks are complete and signed off.",
  "Refresh dependency, license, security and release-process checks.",
  "Document community diversity and recent committer or PPMC growth.",
  "Review branding, trademark attribution and website readiness.",
];

export default function GraduationChecklistPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Graduation Checklist"
        description="A working maturity assessment for Apache Iggy as it prepares for eventual graduation from the Apache Incubator."
      />
      <section className="mb-10 rounded-xl border border-fd-border bg-fd-card p-5">

        <h2 className="mb-3 text-2xl font-bold text-fd-foreground">
          Overview
        </h2>
        <p className="text-base leading-relaxed text-fd-muted-foreground">
          This checklist is based on the{" "}
          <ExternalLink href="https://community.apache.org/apache-way/apache-project-maturity-model.html">
            Apache Project Maturity Model
          </ExternalLink>{" "}
          and the{" "}
          <ExternalLink href="https://incubator.apache.org/guides/graduation.html">
            Apache Incubator graduation guide
          </ExternalLink>
          . It is intended to help mentors, the PPMC and the community track the
          remaining work before proposing graduation.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
          Next Steps
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-fd-foreground">
          Maturity Model Assessment
        </h2>
        <p>Last Updated: July 31, 2026.</p><br/>
        <div className="space-y-10">
          {checklist.map((section) => (
            <div key={section.category}>
              <h3 className="mb-4 text-xl font-bold text-fd-foreground">
                {section.category}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-fd-border">
                <table className="w-full text-left text-sm text-fd-foreground">
                  <thead>
                    <tr className="bg-fd-accent/60">
                      <th className="w-24 border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        ID
                      </th>
                      <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        Description
                      </th>
                      <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-fd-border/50 last:border-b-0 hover:bg-fd-accent/30"
                      >
                        <td className="px-5 py-4 font-semibold text-fd-primary">
                          {item.id}
                        </td>
                        <td className="min-w-[18rem] px-5 py-4 text-fd-muted-foreground">
                          {item.description}
                        </td>
                        <td className="min-w-[20rem] px-5 py-4 text-fd-muted-foreground">
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CommunityLayout>
  );
}
