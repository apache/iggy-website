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

import { docs, docs08, docs09, blogPosts, organizations } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

// The frozen 0.8 docs. Kept out of search, the sitemap and llms.txt, which all
// use `source` above.
export const source08 = loader({
  baseUrl: "/docs/0.8",
  source: docs08.toFumadocsSource(),
});

export const source09 = loader({
  baseUrl: "/docs/0.9",
  source: docs09.toFumadocsSource(),
});

// Blog posts as raw collection for direct access to custom schema fields
export { blogPosts };

// Organization entries powering /powered-by
export { organizations };
