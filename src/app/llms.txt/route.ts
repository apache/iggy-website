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
import { SITE_DESCRIPTION, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

const INTRO = `# Apache Iggy

> ${SITE_DESCRIPTION}

Apache Iggy is a message streaming server, not a hosted service: there is no
API on this domain to call. This site carries the documentation, blog and
community pages. The source, releases and issue tracker live at
https://github.com/apache/iggy.

## When to use this site

- Running or configuring the server, including storage, networking and clustering: /docs/server and /docs/clustering.
- Writing a producer or consumer in a given language: /docs/sdk.
- Talking to the server directly over QUIC, TCP or HTTP: /docs/binary-protocol.
- Moving data in or out of Iggy without writing code: /docs/connectors.
- Command line and web administration: /docs/cli and /docs/web_ui.
- Downloading a release: /downloads.
- Contributing, or reaching the project's mailing lists and Discord: /community.
`;

export function GET(): Response {
  const posts = publishedPosts()
    .slice(0, 10)
    .map(({ post, href, date }) => {
      const day = date.toISOString().slice(0, 10);
      return `- [${post.title}](${absoluteUrl(href)}): ${day}`;
    })
    .join("\n");

  const body = [
    INTRO,
    llms(source).index(),
    `## Blog\n\nThe ten most recent posts. The full list is at ${absoluteUrl("/blogs")}.\n\n${posts}\n`,
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
