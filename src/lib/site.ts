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

/** Canonical origin of the published site. Used for canonical URLs, Open Graph, sitemap and llms.txt. */
export const SITE_URL = "https://iggy.apache.org";

/** Short description reused across metadata, structured data and llms.txt. */
export const SITE_DESCRIPTION =
  "Apache Iggy is a persistent message streaming platform written in Rust, supporting QUIC, TCP and HTTP transport protocols, capable of processing millions of messages per second.";

/**
 * Pages outside the docs and blog collections.
 *
 * Static export means these are the only hand-written routes, so they are listed
 * here rather than discovered. Add a route here when you add a page under
 * `src/app/(site)/`, or it will be missing from the sitemap.
 */
export const STATIC_ROUTES = [
  "/",
  "/blogs",
  "/downloads",
  "/community",
  "/community/become-a-committer",
  "/community/brand-kit",
  "/community/graduation-checklist",
  "/community/how-to-contribute",
  "/community/how-to-release",
  "/community/team",
] as const;

/** `trailingSlash: true` in next.config.mjs, so every emitted URL ends in a slash. */
export function absoluteUrl(path: string): string {
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  const withTrailing = withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
  return `${SITE_URL}${withTrailing}`;
}
