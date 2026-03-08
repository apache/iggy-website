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
import { blogPosts } from "@/lib/source";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Latest news and updates from the Apache Iggy project.",
};

function getSlug(filePath: string): string {
  return (
    filePath
      .replace(/\.mdx?$/, "")
      .split("/")
      .pop() ?? filePath
  );
}

export default function BlogIndex() {
  const posts = [...blogPosts]
    .filter((post) => !post.draft)
    .sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-fd-foreground md:text-5xl">
          Blog
        </h1>
        <p className="mb-14 text-lg text-fd-muted-foreground">
          Latest news and updates from the Apache Iggy project.
        </p>
        <div className="space-y-0 divide-y divide-fd-border">
          {posts.map((post) => {
            const date = new Date(post.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const slug = getSlug(post.info.path);
            const href = `/blogs/${year}/${month}/${day}/${slug}`;

            return (
              <article key={href} className="py-8 first:pt-0">
                <Link href={href} className="group block">
                  <time className="text-sm font-medium text-fd-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {post.author && (
                      <span className="ml-2 opacity-70">by {post.author}</span>
                    )}
                  </time>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-fd-foreground transition-colors group-hover:text-fd-primary md:text-3xl">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-3 text-base leading-relaxed text-fd-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-sm font-medium text-fd-primary">
                    Read more &rarr;
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
