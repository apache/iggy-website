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

import { GitBranch, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";

// The versions in the switcher at the top of every docs sidebar. /docs comes
// first and each archive follows, newest first. The switcher marks the last
// entry whose URL prefixes the page, so this order also picks the active one.
export const docsVersions: LayoutTab[] = [
  { title: "Upcoming release", url: "/docs", icon: versionIcon(GitBranch) },
  { title: "0.10 release", url: "/docs/0.10", icon: versionIcon(Tag) },
  { title: "0.9 release", url: "/docs/0.9", icon: versionIcon(Tag) },
  { title: "0.8 release", url: "/docs/0.8", icon: versionIcon(Tag) },
];

// Fumadocs puts the icon at the top left of a fixed slot, 20 px on desktop and
// 36 px on mobile. The wrapper fills the slot and centers the smaller icon.
function versionIcon(Icon: LucideIcon) {
  return (
    <span className="flex size-full items-center justify-center">
      <Icon className="size-4" />
    </span>
  );
}
