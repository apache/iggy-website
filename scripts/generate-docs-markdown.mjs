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
 * Emits a Markdown copy of every docs page and blog post next to its HTML
 * route, so an agent can fetch `/docs/server/security.md` instead of parsing
 * the rendered page.
 *
 * The site is a static export served by ASF infrastructure, so it cannot do
 * Accept-header content negotiation; a sibling file is the version of this that
 * needs no server. Output goes to public/, is gitignored, and is rebuilt from
 * content/docs and content/blog on every build.
 *
 * Site-relative links become absolute, since a copied page loses the site it
 * came from, and diagram components become the text in diagram-text.mjs.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "fs";
import { join, relative, dirname, basename } from "path";
import { DIAGRAM_TEXT } from "./diagram-text.mjs";

const CONTENT = "content/docs";
const BLOG = "content/blog";
const PUBLIC = "public";
const SITE_URL = "https://iggy.apache.org";
const REPO_BLOB = "https://github.com/apache/iggy-website/blob/main";
// The same file src/lib/site.ts reads for DOCS_VERSIONS.
const DOCS_VERSIONS = JSON.parse(readFileSync("src/lib/docs-version.json", "utf8")).docsVersions;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith(".mdx") ? [path] : [];
  });
}

/** content/docs/server/security.mdx -> public/docs/server/security.md
 *  content/docs/binary-protocol/index.mdx -> public/docs/binary-protocol.md
 *  content/docs/index.mdx -> public/docs.md */
function outputPath(source) {
  const rel = relative(CONTENT, source).replace(/\.mdx$/, "");
  const stem = basename(rel) === "index" ? dirname(rel) : rel;
  return join(PUBLIC, "docs" + (stem === "." ? "" : `/${stem}`) + ".md");
}

/** Frontmatter is YAML, but only a few scalar keys are read here, so it is not
 *  worth a parser dependency. */
function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const meta = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const match = /^(title|description|date|draft):\s*(.*)$/.exec(line);
    if (match) meta[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: raw.slice(end + 4).replace(/^\n+/, "") };
}

/** Replace diagram components with their text, and make site links absolute.
 *  Code fences are left alone. */
function transformBody(source, body) {
  let inFence = false;
  return body
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      const component = /^\s*<([A-Z][A-Za-z0-9]*)\s*\/>\s*$/.exec(line);
      if (component) {
        const text = DIAGRAM_TEXT[component[1]];
        if (!text) {
          throw new Error(
            `${source}: <${component[1]} /> has no text version. Add one to scripts/diagram-text.mjs.`,
          );
        }
        return text;
      }
      return line.replace(/\]\(\//g, `](${SITE_URL}/`);
    })
    .join("\n");
}

function render(source, raw, pageUrl) {
  const { meta, body } = splitFrontmatter(raw);
  const head = [
    `# ${meta.title ?? basename(source, ".mdx")}`,
    ...(meta.description ? [`> ${meta.description}`] : []),
    ...(meta.date ? [`Published: ${meta.date}`] : []),
    `Rendered page: ${pageUrl}`,
    `Source: ${REPO_BLOB}/${source}`,
    ...(source.startsWith(CONTENT) ? [`Docs version: ${DOCS_VERSIONS}`] : []),
  ].join("\n\n");
  // The rest of the body keeps its MDX as authored.
  return `${head}\n\n${transformBody(source, body).trimEnd()}\n`;
}

/** content/blog/release-0.8.0.mdx dated 2026-04-22 -> public/blogs/2026/04/22/release-0.8.0.md.
 *  The date is read the same way as the blog route (src/app/(site)/blogs), so
 *  the copy sits next to the post's URL. Drafts are skipped. */
function blogOutputPath(source, meta) {
  const date = new Date(meta.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return join(PUBLIC, "blogs", String(year), month, day, `${basename(source, ".mdx")}.md`);
}

/** Everything this script wrote last time. Nothing else under public/ is .md. */
function clean(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) clean(path);
    else if (entry.name.endsWith(".md")) rmSync(path);
  }
}

function main() {
  const sources = walk(CONTENT).sort();
  for (const dir of [join(PUBLIC, "docs"), join(PUBLIC, "blogs")]) {
    try {
      if (statSync(dir).isDirectory()) clean(dir);
    } catch {
      // Nothing generated there yet.
    }
  }
  rmSync(join(PUBLIC, "docs.md"), { force: true });

  for (const source of sources) {
    const target = outputPath(source);
    const url = `${SITE_URL}/${target.replace(/^public\//, "").replace(/\.md$/, "")}/`;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, render(source, readFileSync(source, "utf8"), url));
  }

  let posts = 0;
  for (const source of walk(BLOG).sort()) {
    const raw = readFileSync(source, "utf8");
    const { meta } = splitFrontmatter(raw);
    if (meta.draft === "true" || !meta.date) continue;
    const target = blogOutputPath(source, meta);
    const url = `${SITE_URL}/${target.replace(/^public\//, "").replace(/\.md$/, "")}/`;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, render(source, raw, url));
    posts += 1;
  }
  console.log(`Generated ${sources.length} Markdown copies of docs pages and ${posts} of blog posts.`);
}

main();
