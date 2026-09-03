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
import { resolveAuthors } from "@/lib/authors";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import Link from "next/link";
import type { Metadata } from "next";

function getSlug(filePath: string): string {
  return (
    filePath
      .replace(/\.mdx?$/, "")
      .split("/")
      .pop() ?? filePath
  );
}

function findPostByDateSlug(slugParts: string[]) {
  if (slugParts.length !== 4) return null;
  const [year, month, day, postSlug] = slugParts;
  return (
    blogPosts.find((p) => {
      if (p.draft) return false;
      const date = new Date(p.date);
      return (
        date.getFullYear() === Number(year) &&
        String(date.getMonth() + 1).padStart(2, "0") === month &&
        String(date.getDate()).padStart(2, "0") === day &&
        getSlug(p.info.path) === postSlug
      );
    }) ?? null
  );
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const page = findPostByDateSlug(params.slug);
  if (!page) notFound();

  const MDX = page.body;
  const date = new Date(page.date);
  const postAuthors = resolveAuthors(page.author);

  return (
    <main className="min-h-screen px-6 py-16 md:px-12">
      <article className="mx-auto max-w-5xl">
        <header className="mb-10">
          <time className="text-sm font-medium text-fd-muted-foreground">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
            {page.title}
          </h1>
          {postAuthors.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {postAuthors.map((author) => (
                <div key={author.name} className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={author.image}
                    alt={author.name}
                    className="h-11 w-11 rounded-full border border-fd-border object-cover"
                  />
                  <div>
                    {author.url ? (
                      <a
                        href={author.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-fd-foreground transition-colors hover:text-fd-primary"
                      >
                        {author.name}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold text-fd-foreground">
                        {author.name}
                      </span>
                    )}
                    {author.title && (
                      <p className="text-xs text-fd-muted-foreground">
                        {author.title}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 h-px bg-fd-border" />
        </header>

        <div className="fd-prose prose dark:prose-invert max-w-none prose-headings:text-fd-foreground prose-headings:font-bold prose-p:text-fd-foreground/85 prose-p:leading-relaxed prose-a:text-fd-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-fd-foreground prose-code:text-fd-foreground/80 prose-li:text-fd-foreground/85 prose-blockquote:border-fd-primary prose-blockquote:text-fd-muted-foreground prose-img:rounded-lg">
          <MDX components={getMDXComponents()} />
        </div>

        <footer className="mt-16 border-t border-fd-border pt-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary transition-colors hover:opacity-80"
          >
            &larr; Back to all posts
          </Link>
        </footer>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return blogPosts.filter((page) => !page.draft).map((page) => {
    const date = new Date(page.date);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const postSlug = getSlug(page.info.path);
    return { slug: [year, month, day, postSlug] };
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = findPostByDateSlug(params.slug);
  if (!page) notFound();

  const date = new Date(page.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return {
    title: page.title,
    description: page.description,
    // Set explicitly: the inherited relative canonical loses the trailing slash
    // on this catch-all route, so it would not match the URL actually served.
    alternates: {
      canonical: `/blogs/${year}/${month}/${day}/${getSlug(page.info.path)}/`,
    },
  };
}
