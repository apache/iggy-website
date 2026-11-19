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
 * Builds content/docs from local checkouts of the docs repositories.
 *
 * IGGY_DOCS_DIR replaces content/docs, except connectors/, with a copy of that
 * directory (docs/ of apache/iggy). IGGY_CONNECTORS_DOCS_DIR replaces
 * content/docs/connectors (docs/ of apache/iggy-connectors). A part without a
 * variable stays as it is in Git.
 *
 * With --watch, the script copies each set directory once and then again after
 * each change, so that `next dev` reloads the changed pages. No dependencies:
 * plain Node.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  watch,
} from "fs";
import { dirname, join, resolve, sep } from "path";

const CONTENT = "content/docs";
const CONNECTORS = "connectors";

const PARTS = [
  // The connectors docs live in apache/iggy-connectors, so the copy of
  // apache/iggy must leave them alone.
  { variable: "IGGY_DOCS_DIR", target: CONTENT, keep: CONNECTORS },
  { variable: "IGGY_CONNECTORS_DOCS_DIR", target: join(CONTENT, CONNECTORS) },
];

function fail(message) {
  console.error(`Docs: ${message}`);
  process.exit(1);
}

function isInside(path, dir) {
  return path === dir || path.startsWith(dir + sep);
}

/** The parts whose variable is set, with their source checked. */
function setParts() {
  return PARTS.filter((part) => process.env[part.variable]).map((part) => {
    // npm runs scripts from the package root, so resolve a relative path
    // against the directory where npm was started.
    const source = resolve(process.env.INIT_CWD ?? ".", process.env[part.variable]);
    if (!existsSync(source) || !statSync(source).isDirectory()) {
      fail(`${part.variable} is ${source}, which is not a directory.`);
    }
    // The copy deletes each target file that the source does not have, so the
    // two must not overlap.
    const real = realpathSync(source);
    const target = resolve(part.target);
    if (existsSync(target) && (isInside(real, realpathSync(target)) || isInside(realpathSync(target), real))) {
      fail(`${part.variable} is ${source}, which overlaps ${part.target}.`);
    }
    if (part.keep && existsSync(join(source, part.keep))) {
      fail(`${source} contains ${part.keep}/. These docs live in apache/iggy-connectors.`);
    }
    return { ...part, source };
  });
}

/** The files and folders under root, as paths relative to it, without skip. */
function entries(root, skip) {
  const files = [];
  const dirs = [];
  const visit = (rel) => {
    for (const entry of readdirSync(join(root, rel), { withFileTypes: true })) {
      const path = join(rel, entry.name);
      if (path === skip) continue;
      if (entry.isDirectory()) {
        dirs.push(path);
        visit(path);
      } else {
        files.push(path);
      }
    }
  };
  if (existsSync(root)) visit("");
  return { files, dirs };
}

/**
 * Makes the target equal to the source, except keep. Unchanged files are not
 * written, because each write makes a running `next dev` rebuild the page.
 */
function copyPart({ source, target, keep }) {
  if (keep && existsSync(join(source, keep))) {
    console.error(`Docs: ignored ${join(source, keep)}. These docs live in apache/iggy-connectors.`);
  }
  const from = entries(source, keep);
  const to = entries(target, keep);
  // Delete first, so that a file can replace a folder of the same name.
  const sourceFiles = new Set(from.files);
  const sourceDirs = new Set(from.dirs);
  const stale = [
    ...to.files.filter((name) => !sourceFiles.has(name)),
    ...to.dirs.filter((name) => !sourceDirs.has(name)),
  ];
  for (const name of stale) rmSync(join(target, name), { recursive: true, force: true });
  let copied = 0;
  for (const name of from.files) {
    const src = join(source, name);
    const dst = join(target, name);
    if (existsSync(dst) && readFileSync(src).equals(readFileSync(dst))) continue;
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(src, dst);
    copied += 1;
  }
  console.log(
    `Docs: copied ${source} to ${target}: ${copied} changed, ${stale.length} removed` +
      (keep ? `, ${keep}/ kept` : ""),
  );
}

function watchPart(part) {
  let timer;
  watch(part.source, { recursive: true }, () => {
    // A save or a branch switch fires a burst of events. Copy once after it.
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        copyPart(part);
      } catch (e) {
        // An editor temporary file can vanish during the copy. Its removal
        // fires another event, which copies again.
        console.error(`Docs: could not copy ${part.source}: ${e.message}`);
      }
    }, 100);
  });
  console.log(`Docs: watching ${part.source}`);
}

function main() {
  const watchMode = process.argv.includes("--watch");
  const parts = setParts();
  if (parts.length === 0) {
    if (watchMode) fail("set IGGY_DOCS_DIR, IGGY_CONNECTORS_DOCS_DIR or both to watch them.");
    console.log(`Docs: using ${CONTENT} from Git`);
    return;
  }
  for (const part of parts) copyPart(part);
  if (watchMode) for (const part of parts) watchPart(part);
}

main();
