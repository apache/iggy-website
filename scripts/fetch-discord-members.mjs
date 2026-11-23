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

// The code of the public invite link that the navbar points at.
const INVITE = "apache-iggy";

// Only used when there is no previously fetched value on disk. Keep it roughly
// current: a stale fallback silently ships a wrong number on the site.
const FALLBACK = "828";

const OUT = new URL("../src/discord-members.json", import.meta.url);

function formatMembers(count) {
  return count >= 1000 ? `${(count / 1000).toFixed(1)}K` : String(count);
}

function existingMembers() {
  if (!existsSync(OUT)) return null;
  try {
    const value = JSON.parse(readFileSync(OUT, "utf8")).members;
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}

async function main() {
  // The invite endpoint needs no token. with_counts=true adds the approximate
  // member count of the server that the invite belongs to.
  let members = null;
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${INVITE}?with_counts=true`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data.approximate_member_count) {
        members = formatMembers(data.approximate_member_count);
      }
    } else {
      console.warn(`Discord members: API returned ${res.status} ${res.statusText}`);
    }
  } catch (e) {
    console.warn("Discord members: fetch failed:", e.message);
  }

  if (members === null) {
    // Never overwrite a good value with a worse one.
    const previous = existingMembers();
    members = previous ?? FALLBACK;
    console.warn(
      previous
        ? `Discord members: keeping previously fetched ${previous}`
        : `Discord members: no previous value, using fallback ${FALLBACK}`,
    );
  }

  writeFileSync(OUT, JSON.stringify({ members }));
  console.log(`Discord members: ${members}`);
}

main();
