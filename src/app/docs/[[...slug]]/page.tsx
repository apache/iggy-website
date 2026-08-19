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
} from "fumadocs-ui/layouts/docs/page";
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
      <DocsTitle>{page.data.title}</DocsTitle>
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

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

// Several chapters have pages with identical titles ("Introduction",
// "Examples"), so a bare title in the prev/next footer is ambiguous.
// Prefix it with the chapter, i.e. the target's nearest parent folder.
function withChapter(tree: PageTree.Root, item: PageTree.Item | undefined) {
  if (!item) return undefined;
  const parent = PageTree.findParent(tree, item.url);
  // The tree root is not a chapter; top-level pages keep a bare title.
  if (!parent || parent.type !== "folder") return item;
  return {
    ...item,
    name: (
      <>
        <span className="me-1 font-normal text-fd-muted-foreground">
          {parent.name}:
        </span>
        {item.name}
      </>
    ),
  };
}
