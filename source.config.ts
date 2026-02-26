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

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
  },
});
