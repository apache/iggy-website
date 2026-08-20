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
import type { Metadata } from "next";
import {
  CommunityHeader,
  CommunityLayout,
  communityPages,
} from "./_components/community-layout";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Apache Iggy community and learn how to contribute, release and use project brand resources.",
};

export default function CommunityPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Community"
        description="Apache Iggy is built in the open by contributors, committers, and users. These pages collect the people, practices and resources that keep the project moving."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {communityPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/60"
          >
            <h2 className="mb-2 text-xl font-bold text-fd-foreground">
              {page.title}
            </h2>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </CommunityLayout>
  );
}
