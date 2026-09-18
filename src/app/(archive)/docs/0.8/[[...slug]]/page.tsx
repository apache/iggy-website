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

import { source08 } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getArchiveMDXComponents } from "@/components/archive-0.8/mdx-components";
import { ArchiveNotice } from "@/components/archive-0.8/archive-notice";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import * as PageTree from "fumadocs-core/page-tree";

// The frozen 0.8 docs. Mirrors src/app/(current)/docs/[[...slug]]/page.tsx,
// with the archive notice and without indexing or a Markdown copy.
export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source08.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const tree = source08.getPageTree();
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
      <ArchiveNotice />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getArchiveMDXComponents({
            a: createRelativeLink(source08, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source08.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source08.getPage(params.slug);
  if (!page) notFound();

  const chapter = chapterName(source08.getPageTree(), page.url);
  const title = chapter ? `${chapter}: ${page.data.title}` : page.data.title;

  return {
    title: `0.8 ${title}`,
    description: page.data.description,
    // Old docs should not compete with the current ones in search results.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${page.url}/`,
    },
  };
}

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

function chapterName(tree: PageTree.Root, url: string) {
  const parent = PageTree.findParent(tree, url);
  if (!parent || parent.type !== "folder") return undefined;
  return typeof parent.name === "string" ? parent.name : undefined;
}
