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

import { DOCS_VERSIONS, absoluteFileUrl } from "@/lib/site";
import { docsSections, joinPages } from "@/lib/llms";

export const dynamic = "force-static";
export const dynamicParams = false;

// One file per top-level docs section, e.g. /llms-full/sdk.txt, as listed in
// llms.txt. The segment includes ".txt" so the static export writes a file with
// that name; sectionFileUrl in src/lib/llms.ts builds the same URL.
export function generateStaticParams() {
  return docsSections().map((section) => ({ section: `${section.slug}.txt` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
): Promise<Response> {
  const { section: file } = await params;
  const section = docsSections().find((s) => `${s.slug}.txt` === file);
  if (!section) return new Response("Not found", { status: 404 });

  const intro = `# Apache Iggy documentation: ${section.title}

These docs describe ${DOCS_VERSIONS}. This file joins every page in the ${section.title} section. For the other sections, see ${absoluteFileUrl("/llms.txt")}. For all sections in one file, see ${absoluteFileUrl("/llms-full.txt")}.
`;

  return new Response(joinPages(intro, section.urls), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
