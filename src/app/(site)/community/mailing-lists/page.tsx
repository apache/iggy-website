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
  title: "Mailing Lists",
  description: "Subscribe to the Apache Iggy mailing lists.",
};

const lists = [
  {
    name: "dev@iggy.apache.org",
    purpose:
      "Development discussion, release votes and project decisions. If you only join one list, join this one.",
    subscribe: "dev-subscribe@iggy.apache.org",
    unsubscribe: "dev-unsubscribe@iggy.apache.org",
    archive: "https://lists.apache.org/list.html?dev@iggy.apache.org",
  },
  {
    name: "commits@iggy.apache.org",
    purpose:
      "Commit and build notifications. It's automated and there's a lot of it.",
    subscribe: "commits-subscribe@iggy.apache.org",
    unsubscribe: "commits-unsubscribe@iggy.apache.org",
    archive: "https://lists.apache.org/list.html?commits@iggy.apache.org",
  },
];

export default function MailingListsPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Mailing Lists"
        description="Apache Iggy has two public mailing lists and anyone can join either one. dev@ is where development gets discussed and where releases are announced, and it's the best place to ask a question you want a considered answer to."
      />

      <div className="space-y-6">
        {lists.map((list) => (
          <div
            key={list.name}
            className="rounded-xl border border-fd-border bg-fd-card p-6"
          >
            <h2 className="mb-2 text-base font-bold text-fd-foreground">
              {list.name}
            </h2>
            <p className="mb-4 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
              {list.purpose}
            </p>
            <ul className="space-y-2 text-sm text-fd-muted-foreground">
              <li>
                Subscribe: send an empty email to{" "}
                <ExternalLink href={`mailto:${list.subscribe}`}>
                  {list.subscribe}
                </ExternalLink>
              </li>
              <li>
                Unsubscribe: send an empty email to{" "}
                <ExternalLink href={`mailto:${list.unsubscribe}`}>
                  {list.unsubscribe}
                </ExternalLink>
              </li>
              <li>
                Archive:{" "}
                <ExternalLink href={list.archive}>{list.archive}</ExternalLink>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Where to ask
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Use dev@ if you want a decision made, or a record of one. Use{" "}
        <ExternalLink href="https://github.com/apache/iggy/issues">
          GitHub issues
        </ExternalLink>{" "}
        for bugs and feature requests, and{" "}
        <ExternalLink href="https://discord.gg/apache-iggy">
          Discord
        </ExternalLink>{" "}
        for chat and quick questions. Discord isn't archived, so if something
        gets settled there, put it on dev@ or in an issue as well.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Private list
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        private@iggy.apache.org is a closed list for the small amount of
        project business that can't be discussed in public. For security
        reports, follow the{" "}
        <ExternalLink href="https://www.apache.org/security/">
          ASF security process
        </ExternalLink>
        .
      </p>
    </CommunityLayout>
  );
}
