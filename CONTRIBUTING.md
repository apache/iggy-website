# Contributing to the Apache Iggy website

This repository holds the source of [iggy.apache.org](https://iggy.apache.org):
the documentation, blog and landing pages. The broker itself lives in
[apache/iggy](https://github.com/apache/iggy).

## Where things live

| Path | What it holds |
|------|---------------|
| `content/docs/**` | Documentation pages, as MDX |
| `content/blog/**` | Blog posts |
| `content/docs/**/meta.json` | Sidebar titles and page ordering for each section |
| `src/` | Site components and layout |
| `public/`, `brand-assets/` | Static assets and Apache Iggy brand material |

The site is built with [Fumadocs](https://fumadocs.dev/) on
[Next.js](https://nextjs.org/) and generates a fully static site.

## Working locally

The required Node version is in `.nvmrc`, and as an `engines` floor in
`package.json`.

```bash
npm install
npm run dev     # local server with hot reload
npm run build   # static output in ./out
```

Run `npm run build` before opening a pull request: MDX that renders in `dev`
can still fail the static build, most often through a malformed frontmatter
block or a component that is used but not imported.

Add a new page to the `pages` array of its directory's `meta.json`. Left out, it
builds and deploys but never appears in the sidebar.

## Making a change

1. Fork the repository and create a branch off `main`.
2. Make the change, and check the affected pages in `npm run dev`.
3. Open a pull request against `main`, describing what was wrong and how you
   verified the correction.

Small corrections such as a broken link, a stale command or a wrong default
are welcome as direct pull requests; there is no need to open an issue first. For
larger changes such as new pages, restructured navigation or a reorganised
section, please open an issue to discuss the shape before writing it.

The site is a static export with no redirects, so a page's path is its permanent
URL. Do not rename or move a published page: it breaks every existing link to it.

## Documenting the broker

Much of the documentation describes behaviour that is defined in
[apache/iggy](https://github.com/apache/iggy): configuration keys, CLI
arguments, SDK signatures and defaults. Nothing in this repository is generated
from that source, so the two can drift.

When correcting such a page, please verify the claim against the broker's
default branch and say so in the pull request. Naming the file you checked
(for example `core/server/config.toml`, or the SDK source for a client method)
is enough. A documented default that no longer matches the code is a bug worth
fixing on its own.

If you find that the broker's own behaviour is wrong rather than its
documentation, file the issue on
[apache/iggy](https://github.com/apache/iggy/issues) instead.

## Publishing

Pull requests merge to `main`. The published sites are built from separate
branches:

- `asf-site` → iggy.apache.org (production)
- `asf-staging` → iggy.staged.apache.org (staging)

Contributors do not need to touch either branch.

## Getting help

- [dev@iggy.apache.org](mailto:dev@iggy.apache.org), the project's development
  mailing list, for project decisions and anything that should stay on the
  public record ([subscribe](mailto:dev-subscribe@iggy.apache.org))
- [Discord](https://discord.gg/apache-iggy) for informal conversation and quick
  questions
- [GitHub issues](https://github.com/apache/iggy-website/issues) for problems
  with the site or its documentation
