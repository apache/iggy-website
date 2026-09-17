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

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { flattenTree, type Folder, type Node } from "fumadocs-core/page-tree";
import { source } from "@/lib/source";

/** A top-level docs folder, such as SDK or Server, with its page URLs in navigation order. */
export interface DocsSection {
  slug: string;
  title: string;
  urls: string[];
}

function docsUrls(nodes: Node[]): string[] {
  return flattenTree(nodes)
    .filter((item) => !item.external && item.url.startsWith("/docs"))
    .map((item) => item.url);
}

/** Every docs page URL, in the order the sidebar shows them. */
export function docsUrlsInNavOrder(): string[] {
  return docsUrls(source.getPageTree().children);
}

export function docsSections(): DocsSection[] {
  return source
    .getPageTree()
    .children.filter((node): node is Folder => node.type === "folder")
    .map((folder) => {
      const urls = docsUrls([folder]);
      const slug = urls[0].split("/")[2];
      return { slug, title: typeof folder.name === "string" ? folder.name : slug, urls };
    })
    .filter((section) => section.urls.length > 0);
}

export function sectionFileUrl(slug: string): string {
  return `/llms-full/${slug}.txt`;
}

/**
 * Joins the Markdown copies that scripts/generate-docs-markdown.mjs writes to
 * public/ before every dev and build run.
 */
export function joinPages(intro: string, urls: string[]): string {
  const pages = urls.map((url) => readFileSync(join(process.cwd(), "public", `${url}.md`), "utf8"));
  return [intro, ...pages].join("\n---\n\n");
}
