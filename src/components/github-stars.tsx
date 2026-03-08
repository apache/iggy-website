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

import Link from "next/link";
import data from "@/github-stars.json";

export function GitHubStars() {
  return (
    <Link
      href="https://github.com/apache/iggy"
      target="_blank"
      className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border bg-fd-secondary/60 px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
    >
      GitHub{" "}
      <span className="inline-flex items-center gap-1 text-fd-primary">
        &#9733; {data.stars}
      </span>
    </Link>
  );
}
