# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apache Iggy website -- a static documentation and marketing site built with **Next.js + Fumadocs + Tailwind CSS** (versions pinned in `package.json`). Output is a fully static export (no server runtime).

## Commands

```bash
npm install        # Install deps (triggers fumadocs-mdx postinstall)
npm run dev        # Dev server with hot reload (http://localhost:3000)
npm run build      # Static export to out/ directory
npm run check:links  # Broken /docs links, pages missing from meta.json, missing assets
npx serve out      # Preview the static build
```

`npm start` (`next start`) does not work here: it is incompatible with `output: "export"`. `predev`/`prebuild` run `scripts/fetch-github-stars.mjs` and `scripts/fetch-discord-members.mjs` (network calls with a graceful offline fallback).

`check:links` reads the `/docs` links in the docs pages and blog posts, and the complete `/docs` string literals in `src/`. It accepts `https://iggy.apache.org/docs/...` and the `.md` URLs of the Markdown copies. CI runs it in the required `checks` job.

`content/docs` is not in Git. `predev`, `prebuild`, `pretypecheck` and `precheck:links` first run `scripts/fetch-docs.mjs`, which builds it from `docs/` of apache/iggy and apache/iggy-connectors. Edit the docs pages in those repositories, not in `content/docs`, because the next run of the script overwrites it. [Where the site gets the docs](CONTRIBUTING.md#where-the-site-gets-the-docs) describes the refs, the local checkouts and `docs:watch`.

No test framework is configured. No linter is configured beyond TypeScript strict mode.

## Architecture

**Tech stack:** Next.js App Router, Fumadocs (docs framework), Tailwind CSS v4, MDX, TypeScript.

**Route groups:**
- `src/app/(home)/` -- Landing page with hero, features, footer
- `src/app/(site)/` -- Blog listing (`/blogs/`), downloads (`/downloads/`), community (`/community/`)
- `src/app/(current)/docs/` -- Documentation pages via Fumadocs DocsLayout
- `src/app/(archive)/docs/<minor>/` -- Archived docs of each release (see "Archived docs")
- `src/app/api/search/` -- Static search index (search UI enabled in the docs layout)

**Content (MDX):**
- `content/docs/` -- Documentation pages, fetched from apache/iggy and apache/iggy-connectors (see "Commands"). `meta.json` files set the order and the hierarchy.
- `content/blog/` -- Blog posts with frontmatter (title, author, date, tags, draft). Date-based URL routing: `/blogs/YYYY/MM/DD/[slug]`

**Shared config:** `src/lib/layout.shared.tsx` defines navigation options (`homeOptions`, `siteOptions`, `docsOptions`) shared across all layouts.

**Content loading:** `src/lib/source.ts` configures the Fumadocs source loader. Blog and docs collections are defined in `source.config.ts` at the project root.

**Static output:** `next.config.mjs` sets `output: "export"`, `trailingSlash: true`, and `images: { unoptimized: true }`.

## Key Conventions

- New docs pages MUST be listed in their directory's `meta.json` `pages` array or they build fine but never appear in the sidebar (no `meta.json` uses the `"..."` rest item). Docs frontmatter requires `title`.
- Static export means no redirects, rewrites, middleware, or runtime API routes. Renaming or moving a page breaks its URL permanently; think before renaming. New dynamic route segments need `generateStaticParams`.
- Every new `.ts`/`.tsx`/`.mjs`/`.css` file needs the Apache 2.0 license header. MDX content does not.
- Custom docs components (architecture diagrams, Mermaid) are registered globally in `src/mdx-components.tsx`; use them in MDX without imports. Diagram components live in `src/components/architecture-diagrams.tsx`.
- Dark theme is the default (the home page force-locks dark; docs pages have a light/dark toggle, test both). Palette source of truth: CSS variables in `src/app/global.css`.
- Client components must be marked with `"use client"`.
- Mermaid diagrams are supported in MDX via `src/components/mermaid.tsx` (client-rendered, theme-aware).
- Blog frontmatter schema is defined in `source.config.ts` using Zod.
- Node.js v26+ required (`.nvmrc`).
- `.npmrc` sets `legacy-peer-deps=true`.
- Commits follow conventional commits: `type(scope): subject`, e.g. `fix(docs): ...`.
- `scripts/generate-docs-markdown.mjs` writes a Markdown copy of every docs page and blog post (its URL plus `.md`) before each dev and build run. `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts` and `src/app/llms-full/[section]/route.ts` (one file per docs section) build on those copies, through `src/lib/llms.ts`. The copies keep code fences as written, so give every fence a language. Site-relative links become absolute.
- A diagram component used on its own line in MDX is replaced in the Markdown copy by its text in `scripts/diagram-text.mjs`. When you add or change a diagram, add or update its text there. The generator fails if a component has no text.
- The docs version shown in llms.txt, llms-full.txt and the Markdown copies is set in `src/lib/docs-version.json`.
- The docs in apache/iggy and apache/iggy-connectors use the components in `src/mdx-components.tsx` and the images in `public/img`. Do not rename, break or remove one that they use. [Docs pages](CONTRIBUTING.md#docs-pages) gives the rule.

## Archived docs

- `content/docs-0.8/`, `content/docs-0.9/` and `content/docs-0.10/` are frozen copies of the docs of each release, served at `/docs/<minor>` by `src/app/(archive)/docs/<minor>/`. The 0.8 copy is from commit `9eece0aa`, before the 0.9.0 update. The current docs live in `src/app/(current)/docs/`. The route groups keep the sidebars apart.
- Do not edit an archive except to fix something broken. Its `/docs` links point at `/docs/<minor>` or at an older archive, and `npm run check:links` fails if an archived page links to the current docs.
- Each archive uses its own copy of the diagrams in `src/components/archive-<minor>/`, shows a notice on every page, is marked `noindex`, and is left out of search, the sitemap and llms.txt. These use `source`, not the archive loaders.
- The version switcher at the top of every docs sidebar lists `/docs` and the archives from `src/lib/docs-versions.tsx`.
- To add an archive after a release, follow [Archiving the docs of a release](CONTRIBUTING.md#archiving-the-docs-of-a-release).

## Deployment

- Default branch is `main` (the code repo uses `master`; this one does not).
- `.github/workflows/deploy.yml` force-orphan-pushes `out/` to the `asf-site` branch -> iggy.apache.org, and `stage.yml` pushes to `asf-staging` -> iggy.staged.apache.org. [Publishing](CONTRIBUTING.md#publishing) describes their triggers, the `docs-source.json` deploy record, and what to do when the docs on the site look old.
- The docs jobs of apache/iggy and apache/iggy-connectors read `docs-source.json`. Do not rename or remove its fields.
- `ci.yml` builds each pull request with the docs from `master` of both docs repositories.
- `asf-site` and `asf-staging` are generated artifacts. Never edit them by hand.
- Both workflows copy `.asf.yaml` and `.htaccess` into `out/` before publishing. The `.htaccess` sets `ErrorDocument 404 /404.html`; without it the ASF web server answers unknown paths with its own bare "Not Found" body instead of the site's 404 page (the status code is 404 either way).
- Branch-to-URL mapping is configured via `.asf.yaml` (Apache infrastructure).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
