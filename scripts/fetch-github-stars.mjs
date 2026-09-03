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

import { writeFileSync, readFileSync, existsSync } from "fs";

// Only used when there is no previously fetched value on disk. Keep it roughly
// current: a stale fallback silently ships a wrong number on the site.
const FALLBACK = "4.7K";

const OUT = new URL("../src/github-stars.json", import.meta.url);

function formatStars(count) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}

function existingStars() {
  if (!existsSync(OUT)) return null;
  try {
    const value = JSON.parse(readFileSync(OUT, "utf8")).stars;
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

async function main() {
  // The anonymous GitHub API limit is per IP, and shared CI runners hit it
  // routinely. Actions exposes GITHUB_TOKEN, which raises the limit a long way.
  const token = process.env.GITHUB_TOKEN;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  let stars = null;
  try {
    const res = await fetch("https://api.github.com/repos/apache/iggy", { headers });
    if (res.ok) {
      const data = await res.json();
      if (data.stargazers_count) {
        stars = formatStars(data.stargazers_count);
      }
    } else {
      console.warn(`GitHub stars: API returned ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.warn("GitHub stars: fetch failed:", e.message);
  }

  if (stars === null) {
    // Never overwrite a good value with a worse one.
    const previous = existingStars();
    stars = previous ?? FALLBACK;
    console.warn(
      previous
        ? `GitHub stars: keeping previously fetched ${previous}`
        : `GitHub stars: no previous value, using fallback ${FALLBACK}`,
    );
  }

  writeFileSync(OUT, JSON.stringify({ stars }));
  console.log(`GitHub stars: ${stars}`);
}

main();
