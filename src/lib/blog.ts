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

import { blogPosts } from "@/lib/source";

/** Filename stem of a blog post, which is the last segment of its URL. */
export function blogSlug(filePath: string): string {
  return (
    filePath
      .replace(/\.mdx?$/, "")
      .split("/")
      .pop() ?? filePath
  );
}

/** Published, non-draft posts, newest first, with their site-relative URLs. */
export function publishedPosts() {
  return [...blogPosts]
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const date = new Date(post.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return {
        post,
        date,
        href: `/blogs/${year}/${month}/${day}/${blogSlug(post.info.path)}`,
      };
    });
}
