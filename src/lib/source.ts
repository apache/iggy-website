import { docs, blogPosts } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

// Blog posts as raw collection for direct access to custom schema fields
export { blogPosts };
