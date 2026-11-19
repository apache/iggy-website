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
 * Fails if a /docs link points at a page that does not exist, if an .mdx page
 * is missing from its directory's meta.json, or if a local asset referenced
 * from content/ is not present under public/.
 *
 * The links come from the docs pages, the blog posts and the complete string
 * literals in src/. No dependencies: plain Node.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

// Each docs tree and the URL it is served under. The archived docs are frozen
// copies, so an archive links only to itself and to other archives, never to
// the current /docs pages, which change.
const TREES = [
  { root: "content/docs", base: "/docs" },
  { root: "content/docs-0.8", base: "/docs/0.8" },
  { root: "content/docs-0.9", base: "/docs/0.9" },
  { root: "content/docs-0.10", base: "/docs/0.10" },
];
const BLOG = "content/blog";
const SRC = "src";
const SITE_URL = "https://iggy.apache.org";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const archiveBases = TREES.map((tree) => tree.base).filter((base) => base !== "/docs");
const inArchive = (target) => archiveBases.some((base) => target === base || target.startsWith(base + "/"));

const routes = new Set();
const trees = TREES.map(({ root, base }) => {
  const files = walk(root).filter((f) => f.endsWith(".mdx"));
  for (const f of files) {
    const rel = relative(root, f).slice(0, -4);
    routes.add(base + "/" + rel.replace(/\/index$/, ""));
    if (rel.endsWith("index")) routes.add((base + "/" + rel.slice(0, -6)).replace(/\/$/, ""));
  }
  return { root, base, files };
});
const files = trees.flatMap((tree) => tree.files);

const problems = [];

// A docs URL as written, reduced to the route it opens: no origin, no .md
// suffix of the Markdown copies, no trailing slash.
const DOCS_URL = String.raw`(?:https://iggy\.apache\.org)?/docs(?:[/.][^)#"'\x60\s$]*)?`;
const linkPattern = new RegExp(String.raw`(?:\]\(|href=")(${DOCS_URL})(?=[)#"\s])`, "g");
// Only complete literals: the URL excludes "$", so a template literal with
// ${...} does not match.
const literalPattern = new RegExp(String.raw`(["'\x60])(${DOCS_URL})(?:#[^"'\x60\s]*)?\1`, "g");
const toRoute = (url) => url.replace(SITE_URL, "").replace(/\.md$/, "").replace(/\/$/, "");

const links = new Map();
function addLink(target, file) {
  if (!links.has(target)) links.set(target, new Set());
  links.get(target).add(file);
}
for (const { base, files: treeFiles } of trees) {
  for (const f of treeFiles) {
    for (const m of readFileSync(f, "utf8").matchAll(linkPattern)) {
      const target = toRoute(m[1]);
      if (base !== "/docs" && !inArchive(target)) {
        problems.push(`${f} links to ${target}, outside the archives`);
      }
      addLink(target, f);
    }
  }
}
const blogFiles = walk(BLOG).filter((f) => f.endsWith(".mdx"));
for (const f of blogFiles) {
  for (const m of readFileSync(f, "utf8").matchAll(linkPattern)) addLink(toRoute(m[1]), f);
}
const srcFiles = walk(SRC).filter((f) => /\.(ts|tsx|mjs|js)$/.test(f));
for (const f of srcFiles) {
  for (const m of readFileSync(f, "utf8").matchAll(literalPattern)) addLink(toRoute(m[2]), f);
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
  `docs: ${files.length} pages, ${links.size} distinct /docs links from the docs, ` +
    `${blogFiles.length} blog posts and ${srcFiles.length} src files, ` +
    `${assets.size} local assets, ${problems.length} problem(s)`,
);
for (const p of problems) console.error("  " + p);
process.exit(problems.length ? 1 : 0);
