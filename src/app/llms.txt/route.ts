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

import { llms } from "fumadocs-core/source/llms";
import { source } from "@/lib/source";
import { publishedPosts } from "@/lib/blog";
import { DOCS_VERSIONS, SITE_DESCRIPTION, absoluteFileUrl, absoluteUrl } from "@/lib/site";
import { docsSections, joinPages, sectionFileUrl } from "@/lib/llms";

export const dynamic = "force-static";

const INTRO = `# Apache Iggy

> ${SITE_DESCRIPTION}

Apache Iggy is a message streaming server, not a hosted service: there is no
API on this domain to call. This site carries the documentation, blog and
community pages. The source, releases and issue tracker live at
https://github.com/apache/iggy.

These docs describe ${DOCS_VERSIONS}.

Every docs page is also available as Markdown: replace the trailing slash in its
URL with \`.md\`, for example ${absoluteFileUrl("/docs/introduction/getting-started.md")}. Each docs section
is also available as one file, listed under "Docs by section" below. All the docs
pages in one file are at ${absoluteFileUrl("/llms-full.txt")}, which is large.

## When to use this site

- Running or configuring the server, including storage, networking and clustering: ${absoluteUrl("/docs/server")} and ${absoluteUrl("/docs/clustering")}
- Writing a producer or consumer in a given language: ${absoluteUrl("/docs/sdk")}
- Talking to the server directly over QUIC, TCP or HTTP: ${absoluteUrl("/docs/binary-protocol")}
- Moving data in or out of Iggy without writing code: ${absoluteUrl("/docs/connectors")}
- Command line and web administration: ${absoluteUrl("/docs/cli")} and ${absoluteUrl("/docs/web_ui")}
- Downloading a release: ${absoluteUrl("/downloads")}
- Contributing, or reaching the project's mailing lists and Discord: ${absoluteUrl("/community")}

## Writing Iggy clients

- Use the high-level producer and consumer API for anything beyond a first example. It handles consumer groups, offsets, batching and reconnection: ${absoluteUrl("/docs/sdk/rust/high-level-sdk")}
- The server and each SDK have their own version numbers. Check that the SDK version you install matches the server: ${absoluteUrl("/docs/sdk/introduction")}
- Some connection string keys differ between transports, and an unknown key is an error. Check the key for each transport before reusing a connection string: ${absoluteUrl("/docs/sdk/connection-strings")}
- By default a client retries a failed connection forever, and only logs the retries if tracing is set up. For scripts that should fail fast, set \`reconnection_retries=0\` in the connection string (\`reconnection_max_retries=0\` for QUIC).
`;

export function GET(): Response {
  const posts = publishedPosts()
    .slice(0, 10)
    .map(({ post, href, date }) => {
      const day = date.toISOString().slice(0, 10);
      return `- [${post.title}](${absoluteUrl(href)}): ${day}`;
    })
    .join("\n");

  // The helper emits site-relative links; llms.txt consumers want absolute ones.
  const docsIndex = llms(source)
    .index()
    .replace(/\]\((\/[^)\s]*)\)/g, (_match, path: string) => `](${absoluteUrl(path)})`)
    // One H1 per file: the helper's top-level heading becomes a section.
    .replace(/^# /gm, "## ");

  // Sizes help a reader pick a file that fits their context.
  const sections = docsSections()
    .map((section) => {
      const kb = Math.round(Buffer.byteLength(joinPages("", section.urls)) / 1024);
      const pages = section.urls.length === 1 ? "1 page" : `${section.urls.length} pages`;
      return `- [${section.title}](${absoluteFileUrl(sectionFileUrl(section.slug))}): ${pages}, ${kb} KB`;
    })
    .join("\n");

  const body = [
    INTRO,
    `## Docs by section\n\nEach file joins every page in one docs section.\n\n${sections}\n`,
    docsIndex,
    `## Blog\n\nThe ten most recent posts. The full list is at ${absoluteUrl("/blogs")}. Each post is also available as Markdown: replace the trailing slash in its URL with \`.md\`.\n\n${posts}\n`,
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
