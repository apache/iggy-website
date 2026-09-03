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
 * Emits a Markdown copy of every docs page next to its HTML route, so an agent
 * can fetch `/docs/server/security.md` instead of parsing the rendered page.
 *
 * The site is a static export served by ASF infrastructure, so it cannot do
 * Accept-header content negotiation; a sibling file is the version of this that
 * needs no server. Output goes to public/, is gitignored, and is rebuilt from
 * content/docs on every build.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "fs";
import { join, relative, dirname, basename } from "path";

const CONTENT = "content/docs";
const PUBLIC = "public";
const SITE_URL = "https://iggy.apache.org";
const REPO_BLOB = "https://github.com/apache/iggy-website/blob/main";

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

/** Frontmatter is YAML, but only two scalar keys are read here, so it is not
 *  worth a parser dependency. */
function splitFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const meta = {};
  for (const line of raw.slice(4, end).split("\n")) {
    const match = /^(title|description):\s*(.*)$/.exec(line);
    if (match) meta[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: raw.slice(end + 4).replace(/^\n+/, "") };
}

function render(source, raw) {
  const { meta, body } = splitFrontmatter(raw);
  const url = `${SITE_URL}/${outputPath(source).replace(/^public\//, "").replace(/\.md$/, "")}/`;
  const head = [
    `# ${meta.title ?? basename(source, ".mdx")}`,
    ...(meta.description ? [`> ${meta.description}`] : []),
    `Rendered page: ${url}`,
    `Source: ${REPO_BLOB}/${source}`,
  ].join("\n\n");
  // The body keeps its MDX as authored: custom components appear as tags, which
  // is honest about what the page contains and needs no MDX pipeline here.
  return `${head}\n\n${body.trimEnd()}\n`;
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
  try {
    if (statSync(join(PUBLIC, "docs")).isDirectory()) clean(join(PUBLIC, "docs"));
  } catch {
    // No public/docs yet; nothing to clean.
  }
  rmSync(join(PUBLIC, "docs.md"), { force: true });

  for (const source of sources) {
    const target = outputPath(source);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, render(source, readFileSync(source, "utf8")));
  }
  console.log(`Generated ${sources.length} Markdown copies of docs pages.`);
}

main();
