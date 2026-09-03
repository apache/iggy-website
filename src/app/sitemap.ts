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

import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { publishedPosts } from "@/lib/blog";
import { STATIC_ROUTES, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7,
  }));

  const docsPages = source.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = publishedPosts().map(({ href, date }) => ({
    url: absoluteUrl(href),
    lastModified: date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...docsPages, ...blogPages];
}
