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
import { docsUrlsInNavOrder, joinPages } from "@/lib/llms";

export const dynamic = "force-static";

// Every docs page in one file, in sidebar order. llms.txt also lists one file
// per section, which is easier to use in a chat.
export function GET(): Response {
  const intro = `# Apache Iggy documentation

These docs describe ${DOCS_VERSIONS}. This file joins every docs page. For a linked index, and a smaller file for each section, see ${absoluteFileUrl("/llms.txt")}.
`;

  return new Response(joinPages(intro, docsUrlsInNavOrder()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
