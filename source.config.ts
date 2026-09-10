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

import {
  defineConfig,
  defineDocs,
  defineCollections,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: frontmatterSchema.extend({
    author: z.string().default("Apache Iggy"),
    date: z
      .string()
      .or(z.date())
      .transform((value) => new Date(value)),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

export const organizations = defineCollections({
  type: "doc",
  dir: "content/organizations",
  // Submission instructions live beside the entries for contributors, but
  // only completed organization MDX files belong to this collection.
  files: ["**/*.mdx", "!TEMPLATE.mdx"],
  schema: z.object({
    // Organization or project name, exactly as it should be printed.
    name: z.string(),
    // Public URL. Omit when it is not known -- the entry renders unlinked
    // rather than pointing somewhere unverified.
    website: z.string().optional(),

    // Logo variants. `logo` must be legible on a light background, `logoDark`
    // on a dark one. Either may be omitted; the wall falls back to the name
    // set as text for whichever theme has no artwork.
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    // Logos render only when the submitter has confirmed they are authorized
    // to grant the ASF permission to display the mark, AND the file is
    // actually committed. See content/organizations/README.md.
    permissionConfirmed: z.boolean().optional().default(false),
    // Whether the description is published as a use-case card. On by default,
    // so an entry with a description reads as before. Set it false to keep a
    // description in the file without putting it on the page -- an entry
    // written from public sources that the organization has not confirmed
    // still belongs on the logo wall, but its wording is not theirs to speak.
    showText: z.boolean().optional().default(true),

    // A short category for the workload, e.g. "AI infrastructure",
    // "Change data capture", "Observability". Rendered as a label above the
    // description in the "How Iggy is being used" section.
    useCaseCategory: z.string().optional(),
    // One to three sentences about what the organization uses Iggy for.
    // Presence of this field is what promotes an entry out of the logo wall
    // and into the use-case section -- so leave it empty unless there is
    // something substantive to say. Never write filler.
    description: z.string().optional(),
    technologies: z.array(z.string()).optional().default([]),
    since: z.string().optional(),
    caseStudyUrl: z.string().optional(),
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),

    // Collected at submission time and kept for the project's own records.
    // Deliberately NOT used as the page's public taxonomy: with adoption
    // still early, sorting a handful of names into production vs evaluating
    // advertises how few there are. Revisit when the numbers justify a
    // "Running Iggy in production" cut.
    deploymentStatus: z
      .enum(["production", "pilot", "evaluating", "integration"])
      .optional(),

    // Reserved for entries that earn a richer treatment (quote, case study).
    featured: z.boolean().optional().default(false),
    // Entries stay hidden until a committer has verified the submission.
    draft: z.boolean().optional().default(true),
    submittedBy: z.string().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    // Search snippets are rendered as plain text. The stock stringifier
    // serialises back to markdown, so emphasis, inline code and character
    // escapes leak into the index as literal syntax.
    remarkStructureOptions: {
      stringify: {
        handlers: {
          strong: (node, _parent, state, info) =>
            state.containerPhrasing(node, info),
          emphasis: (node, _parent, state, info) =>
            state.containerPhrasing(node, info),
          delete: (node, _parent, state, info) =>
            state.containerPhrasing(node, info),
          blockquote: (node, _parent, state, info) =>
            state.containerFlow(node, info),
          inlineCode: (node) => node.value,
          text: (node) => node.value,
        },
      },
    },
  },
});
