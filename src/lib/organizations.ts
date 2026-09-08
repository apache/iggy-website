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

import fs from "node:fs";
import path from "node:path";

import { organizations } from "@/lib/source";

export type Organization = (typeof organizations)[number];

export const WEBSITE_REPO = "https://github.com/apache/iggy-website";

export const SUBMIT_ISSUE_URL = `${WEBSITE_REPO}/issues/new?template=organization-submission.yml`;
export const SUBMIT_GUIDE_URL = `${WEBSITE_REPO}/blob/main/content/organizations/README.md`;

/** Derive the anchor slug for an entry from its file name. */
export function organizationSlug(entry: Organization): string {
  return (
    entry.info.path
      .replace(/\.mdx?$/, "")
      .split("/")
      .pop() ?? entry.name
  );
}

/**
 * Entries stay hidden until a committer flips `draft` to false, which is the
 * gate for verifying that a submission is genuine and, where a logo is
 * supplied, that permission to display it was granted.
 *
 * Ordered alphabetically on purpose. The wall carries no ranking: it is a
 * list of who is building with Iggy, not a leaderboard.
 */
export function publishedOrganizations(): Organization[] {
  return [...organizations]
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function hasUseCase(entry: Organization): boolean {
  return Boolean(entry.description?.trim());
}

/**
 * An entry earns a place in "How Iggy is being used" by having something
 * substantive to say. No description means logo wall only: a generated
 * one-liner would be filler, and filler is what makes an adoption page read
 * as marketing rather than as a record.
 */
export function organizationsWithUseCase(): Organization[] {
  return publishedOrganizations()
    .filter(hasUseCase)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Resolved at build time only. This module is imported by server components
 * and must never be pulled into a client bundle.
 *
 * A frontmatter entry may name artwork that has not been committed yet, and
 * a static export would happily ship the broken image.
 */
function logoExists(publicPath?: string): boolean {
  if (!publicPath) return false;
  const relative = publicPath.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

/**
 * A logo renders only once the submitter has confirmed they are authorized
 * to grant the ASF permission to display the mark, and once the artwork is
 * actually in the repository. Failing either, the tile shows the name set as
 * text, which is a normal outcome rather than a degraded one.
 */
export function logoFor(entry: Organization): {
  light?: string;
  dark?: string;
} {
  if (!entry.permissionConfirmed) return {};
  return {
    light: logoExists(entry.logo) ? entry.logo : undefined,
    dark: logoExists(entry.logoDark) ? entry.logoDark : undefined,
  };
}
