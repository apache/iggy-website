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

/**
 * Fails if an internal /docs link points at a page that does not exist, if an
 * .mdx page is missing from its directory's meta.json, or if a local asset
 * referenced from content/ is not present under public/.
 *
 * All three are clean as of this commit, so this locks in a good state rather
 * than fixing a broken one. No dependencies: plain Node.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

const ROOT = "content/docs";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(ROOT).filter((f) => f.endsWith(".mdx"));

const routes = new Set();
for (const f of files) {
  const rel = relative(ROOT, f).slice(0, -4);
  routes.add("/docs/" + rel.replace(/\/index$/, ""));
  if (rel.endsWith("index")) routes.add("/docs/" + rel.slice(0, -6));
}

const problems = [];

const linkPattern = /\]\((\/docs\/[^)#\s]*)/g;
const links = new Map();
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(linkPattern)) {
    const target = m[1].replace(/\/$/, "");
    if (!links.has(target)) links.set(target, new Set());
    links.get(target).add(f);
  }
}
for (const [target, sources] of links) {
  if (!routes.has(target)) {
    problems.push(`unresolved link ${target} (in ${[...sources].sort().join(", ")})`);
  }
}

const dirs = new Set(files.map((f) => f.slice(0, f.lastIndexOf("/"))));
for (const dir of dirs) {
  const metaPath = join(dir, "meta.json");
  if (!existsSync(metaPath)) continue;
  let listed;
  try {
    listed = new Set(JSON.parse(readFileSync(metaPath, "utf8")).pages ?? []);
  } catch (e) {
    problems.push(`unparseable ${metaPath}: ${e.message}`);
    continue;
  }
  for (const f of files.filter((f) => f.startsWith(dir + "/") && !f.slice(dir.length + 1).includes("/"))) {
    const stem = f.slice(dir.length + 1, -4);
    if (stem !== "index" && !listed.has(stem)) {
      problems.push(`${f} is not listed in ${metaPath}`);
    }
  }
}

// Local assets referenced from any content page must exist under public/.
// A missing image does not fail the build, it just renders broken on the site.
const CONTENT = "content";
const assetPattern = /(?:\]\(|src=")(\/[^)"\s]+\.(?:png|jpe?g|svg|gif|webp|ico|pdf))/g;
const contentFiles = walk(CONTENT).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
const assets = new Map();
for (const f of contentFiles) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(assetPattern)) {
    if (!assets.has(m[1])) assets.set(m[1], new Set());
    assets.get(m[1]).add(f);
  }
}
for (const [asset, sources] of assets) {
  if (!existsSync(join("public", asset))) {
    problems.push(`missing asset public${asset} (referenced in ${[...sources].sort().join(", ")})`);
  }
}

console.log(
  `docs: ${files.length} pages, ${links.size} distinct internal links, ` +
    `${assets.size} local assets, ${problems.length} problem(s)`,
);
for (const p of problems) console.error("  " + p);
process.exit(problems.length ? 1 : 0);
