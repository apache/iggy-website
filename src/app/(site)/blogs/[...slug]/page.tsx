import { blogPosts } from "@/lib/source";
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
          {page.author && (
            <p className="mt-4 text-base text-fd-muted-foreground">
              By {page.author}
            </p>
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
  return blogPosts.map((page) => {
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

  return {
    title: page.title,
    description: page.description,
  };
}
