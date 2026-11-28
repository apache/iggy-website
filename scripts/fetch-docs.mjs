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
 * Builds content/docs, which is not in Git, from the docs repositories.
 *
 * docs/ of apache/iggy becomes content/docs, and docs/ of apache/iggy-connectors
 * becomes content/docs/connectors. For each part, a directory variable copies a
 * local checkout: IGGY_DOCS_DIR and IGGY_CONNECTORS_DOCS_DIR. A part without
 * one is fetched from GitHub at IGGY_DOCS_REF or IGGY_CONNECTORS_DOCS_REF, a
 * branch, tag or commit. An empty or unset ref means master.
 *
 * With --watch, the script copies each set directory once and then again after
 * each change, so that `next dev` reloads the changed pages. No dependencies:
 * plain Node and git.
 */

import { execFileSync } from "child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  watch,
} from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve, sep } from "path";

const CONTENT = "content/docs";
const CONNECTORS = "connectors";

const PARTS = [
  // The connectors docs live in apache/iggy-connectors, so the copy of
  // apache/iggy must leave them alone.
  {
    variable: "IGGY_DOCS_DIR",
    refVariable: "IGGY_DOCS_REF",
    repository: "apache/iggy",
    target: CONTENT,
    keep: CONNECTORS,
  },
  {
    variable: "IGGY_CONNECTORS_DOCS_DIR",
    refVariable: "IGGY_CONNECTORS_DOCS_REF",
    repository: "apache/iggy-connectors",
    target: join(CONTENT, CONNECTORS),
  },
];

// A branch, tag or commit. git reads an argument that starts with "-" as an
// option, so the first character must not be one.
const REF = /^[A-Za-z0-9_][A-Za-z0-9._/+-]*$/;

class DocsError extends Error {}

function fail(message) {
  throw new DocsError(message);
}

function isInside(path, dir) {
  return path === dir || path.startsWith(dir + sep);
}

function checkKeep(part, source) {
  if (part.keep && existsSync(join(source, part.keep))) {
    fail(`${source} contains ${part.keep}/. These docs live in apache/iggy-connectors.`);
  }
}

/** The parts whose directory variable is set, with their source checked. */
function localParts() {
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
    checkKeep(part, source);
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
function copyPart({ source, target, keep, label = source }) {
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
    `Docs: copied ${label} to ${target}: ${copied} changed, ${stale.length} removed` +
      (keep ? `, ${keep}/ kept` : ""),
  );
}

/** Fetches docs/ of the repository of the part at its ref, then copies it. */
function fetchPart(part) {
  const ref = process.env[part.refVariable] || "master";
  if (!REF.test(ref)) fail(`${part.refVariable} is "${ref}", which is not a branch, tag or commit.`);
  const dir = mkdtempSync(join(tmpdir(), "iggy-docs-"));
  const git = (...args) =>
    execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();
  try {
    git("init", "-q");
    git("remote", "add", "origin", `https://github.com/${part.repository}.git`);
    // Checks out docs/ and the few files at the root of the repository.
    git("sparse-checkout", "set", "docs");
    // Unlike `git clone --branch`, a fetch also accepts a commit SHA.
    try {
      git("fetch", "-q", "--depth=1", "--filter=blob:none", "origin", ref);
    } catch {
      fail(`could not fetch ${ref} of ${part.repository}. Set ${part.variable} to use a local checkout.`);
    }
    git("checkout", "-q", "FETCH_HEAD");
    const source = join(dir, "docs");
    if (!existsSync(source)) fail(`${part.repository} has no docs/ at ${ref}.`);
    checkKeep(part, source);
    console.log(
      `Docs: fetched ${part.repository} at ${ref}: commit ${git("rev-parse", "FETCH_HEAD")}, ` +
        `docs/ tree ${git("rev-parse", "FETCH_HEAD:docs")}`,
    );
    copyPart({ ...part, source, label: `docs/ of ${part.repository}` });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
  const local = localParts();
  if (watchMode && local.length === 0) {
    fail("set IGGY_DOCS_DIR, IGGY_CONNECTORS_DOCS_DIR or both to watch them.");
  }
  // In PARTS order: the copy of apache/iggy keeps connectors/ as it is.
  for (const part of PARTS) {
    const localPart = local.find((candidate) => candidate.variable === part.variable);
    if (localPart) copyPart(localPart);
    else fetchPart(part);
  }
  if (watchMode) for (const part of local) watchPart(part);
}

try {
  main();
} catch (e) {
  if (!(e instanceof DocsError)) throw e;
  console.error(`Docs: ${e.message}`);
  process.exit(1);
}
