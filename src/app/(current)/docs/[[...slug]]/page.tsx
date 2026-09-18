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

import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from "fumadocs-ui/layouts/docs/page";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { FileCode, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import * as PageTree from "fumadocs-core/page-tree";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const tree = source.getPageTree();
  const neighbours = PageTree.findNeighbour(tree, page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{
        items: {
          previous: withChapter(tree, neighbours.previous),
          next: withChapter(tree, neighbours.next),
        },
      }}
    >
      <div className="flex items-start gap-3">
        <DocsTitle className="flex-1">{page.data.title}</DocsTitle>
        {/* Tool-neutral actions only: any AI tool can use the copied text or the Markdown URL. */}
        <div className="flex shrink-0 items-center gap-0.5 pt-1">
          <MarkdownCopyButton
            markdownUrl={markdownUrl(page.url)}
            title="Copy page as Markdown"
            aria-label="Copy page as Markdown"
            className={pageActionClass}
          >
            <ActionTip>Copy page as Markdown</ActionTip>
          </MarkdownCopyButton>
          <a
            href={markdownUrl(page.url)}
            title="View page as Markdown"
            aria-label="View page as Markdown"
            className={pageActionClass}
          >
            <FileText />
            <ActionTip>View page as Markdown</ActionTip>
          </a>
          <a
            href={`https://github.com/apache/iggy-website/blob/main/content/docs/${page.path}`}
            target="_blank"
            rel="noreferrer noopener"
            title="View page source on GitHub"
            aria-label="View page source on GitHub"
            className={pageActionClass}
          >
            <FileCode />
            <ActionTip>View page source on GitHub</ActionTip>
          </a>
        </div>
      </div>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // Several chapters have pages with identical titles ("Introduction",
  // "Examples"), which gives them identical document titles and pools them
  // together in analytics and in search results. Prefix the chapter, as the
  // prev/next footer already does. The on-page heading is left alone.
  const chapter = chapterName(source.getPageTree(), page.url);

  return {
    title: chapter ? `${chapter}: ${page.data.title}` : page.data.title,
    description: page.data.description,
    alternates: {
      // Set both: defining alternates here replaces the root's, canonical included.
      canonical: `${page.url}/`,
      // The Markdown copy written by scripts/generate-docs-markdown.mjs.
      types: { "text/markdown": markdownUrl(page.url) },
    },
  };
}

// Small icon buttons beside the page title. Also applied to fumadocs'
// MarkdownCopyButton, overriding its text-button styling.
const pageActionClass = buttonVariants({
  color: "ghost",
  size: "icon-sm",
  className:
    "group relative size-8 justify-center border-0 bg-transparent p-0 text-fd-muted-foreground [&_svg]:size-4 [&_svg]:text-fd-muted-foreground",
});

// A label shown under an icon button on hover and keyboard focus. It is also
// the button's text for screen readers.
function ActionTip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute end-0 top-full z-10 mt-1 whitespace-nowrap rounded-md border bg-fd-popover px-2 py-1 text-xs font-normal text-fd-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      {children}
    </span>
  );
}

// The Markdown copy of a docs page, written by scripts/generate-docs-markdown.mjs.
function markdownUrl(url: string) {
  return `${url}.md`;
}

// Several chapters have pages with identical titles ("Introduction",
// "Examples"), so a bare title in the prev/next footer is ambiguous.
// Prefix it with the chapter, i.e. the target's nearest parent folder.
function withChapter(tree: PageTree.Root, item: PageTree.Item | undefined) {
  if (!item) return undefined;
  const chapter = chapterName(tree, item.url);
  if (!chapter) return item;
  return {
    ...item,
    name: (
      <>
        <span className="me-1 font-normal text-fd-muted-foreground">
          {chapter}:
        </span>
        {item.name}
      </>
    ),
  };
}

// The title of the nearest parent folder, i.e. the chapter a page sits in.
// Undefined for top-level pages, whose parent is the tree root and not a
// chapter, and for the rare folder whose name is not a plain string.
function chapterName(tree: PageTree.Root, url: string) {
  const parent = PageTree.findParent(tree, url);
  if (!parent || parent.type !== "folder") return undefined;
  return typeof parent.name === "string" ? parent.name : undefined;
}
