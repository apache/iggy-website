# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apache Iggy website -- a static documentation and marketing site built with **Next.js + Fumadocs + Tailwind CSS** (versions pinned in `package.json`). Output is a fully static export (no server runtime).

## Commands

```bash
npm install        # Install deps (triggers fumadocs-mdx postinstall)
npm run dev        # Dev server with hot reload (http://localhost:3000)
npm run build      # Static export to out/ directory
npx serve out      # Preview the static build
```

`npm start` (`next start`) does not work here: it is incompatible with `output: "export"`. `predev`/`prebuild` run `scripts/fetch-github-stars.mjs` (network call with a graceful offline fallback).

No test framework is configured. No linter is configured beyond TypeScript strict mode.

## Architecture

**Tech stack:** Next.js App Router, Fumadocs (docs framework), Tailwind CSS v4, MDX, TypeScript.

**Route groups:**
- `src/app/(home)/` -- Landing page with hero, features, footer
- `src/app/(site)/` -- Blog listing (`/blogs/`), downloads (`/downloads/`), community (`/community/`)
- `src/app/docs/` -- Documentation pages via Fumadocs DocsLayout
- `src/app/api/search/` -- Static search index (search UI enabled in the docs layout)

**Content (MDX):**
- `content/docs/` -- Documentation pages, structured via `meta.json` files for ordering/hierarchy
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
- Node.js v20+ required (`.nvmrc`).
- `.npmrc` sets `legacy-peer-deps=true`.
- Commits follow conventional commits: `type(scope): subject`, e.g. `fix(docs): ...`.

## Deployment

- Default branch is `main` (the code repo uses `master`; this one does not).
- Push to `main` triggers `.github/workflows/deploy.yml` (also daily cron and manual dispatch), which builds and force-orphan-pushes `out/` to the `asf-site` branch -> iggy.apache.org.
- Push to `staging` triggers `stage.yml`, same flow to `asf-staging` -> iggy.staged.apache.org. Use it to preview large changes.
- `asf-site` and `asf-staging` are generated artifacts. Never edit them by hand.
- Branch-to-URL mapping is configured via `.asf.yaml` (Apache infrastructure).
