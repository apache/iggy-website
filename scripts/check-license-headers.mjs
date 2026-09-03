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
 * Fails if a source file under src/ or scripts/ has no ASF licence header.
 *
 * Strictly speaking the ASF source-header policy governs files shipped in a
 * release, and this website is published rather than released - so this is a
 * house-style rule, not a compliance gate. Every file in scope carries a
 * header as of this commit, which is why it can enforce rather than report:
 * the bar is already met, and this keeps it met.
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const DIRS = ["src", "scripts"];
const EXTS = [".ts", ".tsx", ".mjs", ".css"];

const MARKER = "Licensed to the Apache Software Foundation";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = DIRS.flatMap(walk).filter((f) => EXTS.some((e) => f.endsWith(e)));
const missing = files.filter((f) => !readFileSync(f, "utf8").includes(MARKER));

console.log(`licence headers: ${files.length} files checked, ${missing.length} without a header`);
for (const f of missing) console.log("  " + f);

if (missing.length) {
  console.error(
    "\nAdd the ASF header (copy one from a neighbouring file) or, if the file " +
      "genuinely should not carry one, exclude it here with a comment saying why.",
  );
  process.exit(1);
}
