# Contributing to the Apache Iggy website

This repository holds the source of [iggy.apache.org](https://iggy.apache.org):
the blog, the landing pages and the site components. The docs pages live in
`docs/` of [apache/iggy](https://github.com/apache/iggy), and the connectors docs
live in `docs/` of [apache/iggy-connectors](https://github.com/apache/iggy-connectors).
See [Docs pages](#docs-pages).

## Where things live

| Path | What it holds |
|------|---------------|
| `content/blog/**` | Blog posts |
| `content/docs-<minor>/**` | Frozen docs of each release, served at `/docs/<minor>` |
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
npm run check:links
```

Each `dev` and `build` run fetches the docs pages from `master` of
apache/iggy and apache/iggy-connectors, so it needs git and network access.
[Where the site gets the docs](#where-the-site-gets-the-docs) shows how to use
other docs.

Run `npm run build` before opening a pull request: MDX that renders in `dev`
can still fail the static build, most often through a malformed frontmatter
block or a component that is used but not imported.

CI also runs `npm run check:links`, and a pull request cannot merge until it
passes. It fails on a broken `/docs` link, a page that its `meta.json` does
not list, or a missing image.

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

## Docs pages

The docs pages describe configuration keys, CLI arguments and SDK methods
that apache/iggy and apache/iggy-connectors define, so they live next to that
code. Open a docs pull request on [apache/iggy](https://github.com/apache/iggy),
or on [apache/iggy-connectors](https://github.com/apache/iggy-connectors) for a
page under `/docs/connectors`. The Docs section of `CONTRIBUTING.md` in each
repository shows how to preview a page.

The docs pages use the components in `src/mdx-components.tsx` and the images
in `public/img/` of this repository. A pull request here must not rename or
break a component or an image that the docs use. Remove one only after
`master` and every open pull request of both docs repositories stop using it.
A new image for a docs page comes to `public/img/` here first.

### Where the site gets the docs

`content/docs` is not in Git. Before `dev`, `build`, `typecheck` and
`check:links`, `scripts/fetch-docs.mjs` builds it. `docs/` of apache/iggy
becomes `content/docs`, and `docs/` of apache/iggy-connectors becomes
`content/docs/connectors`. Do not edit the pages in `content/docs`, because the
next run overwrites them.

These environment variables change where each part comes from:

| Variable | Effect |
|----------|--------|
| `IGGY_DOCS_REF`, `IGGY_CONNECTORS_DOCS_REF` | Fetch this branch, tag or commit instead of `master` |
| `IGGY_DOCS_DIR`, `IGGY_CONNECTORS_DOCS_DIR` | Copy this local directory instead, for example `../iggy/docs` |

To preview docs pages while you edit them, check out the docs repository next
to this one. Then run these two commands, each in its own terminal:

```bash
IGGY_DOCS_DIR=../iggy/docs npm run docs:watch
IGGY_DOCS_DIR=../iggy/docs npm run dev
```

`docs:watch` copies each saved page into `content/docs`, and the dev server
reloads it. For the connectors docs, use
`IGGY_CONNECTORS_DOCS_DIR=../iggy-connectors/docs`. Set the same directory
variables for each npm command. A command without them fetches `master` again
and overwrites your local pages.

## Archiving the docs of a release

After the vote on a release passes, the release manager freezes its docs at
`/docs/<minor>`. Check out both docs repositories next to this one, with their
tags. In these commands, the version and the tags are examples:

```bash
mkdir -p content/docs-0.11/connectors
git -C ../iggy archive server-0.11.0 docs | tar -x -C content/docs-0.11 --strip-components=1
git -C ../iggy-connectors archive connectors-0.7.0 docs | tar -x -C content/docs-0.11/connectors --strip-components=1
```

Use the connectors runtime tag of the same release, `connectors-<version>`.
Do not use a `connectors-sdk-` tag or an edge tag. Then:

1. Point the `/docs` links of the copy at `/docs/0.11`.
2. Add a collection in `source.config.ts`, a loader in `src/lib/source.ts`, and
   an entry in `TREES` in `scripts/check-docs-links.mjs`.
3. Copy the route group of the newest archive in `src/app/(archive)/docs/`, and
   its diagram components in `src/components/archive-<minor>/`. Point their
   links at `/docs/0.11` too.
4. Add the archive to `src/lib/docs-versions.tsx`.
5. Run `npm run check:links`. An archived page that links to the current docs
   fails it.

## Publishing

Pull requests merge to `main`. The published sites are built from separate
branches:

- `asf-site` → iggy.apache.org (production)
- `asf-staging` → iggy.staged.apache.org (staging)

A push to `main` publishes the site. A merged docs change in apache/iggy or
apache/iggy-connectors goes live about 7 to 30 minutes later. Contributors do
not need to touch either branch.

`.github/workflows/deploy.yml` runs on each push to `main`, every 15 minutes,
and on a manual run. Its `check` job compares four values with
`docs-source.json` on `asf-site`, the record of the last deploy: the website
commit, the tree of `docs/` on `master` of each docs repository, and the date.
If one of them differs or the run is manual, the site builds, and only a run
on `main` publishes. After two failed builds of the same values, the runs
skip them until one of the values changes. The docs jobs of apache/iggy and
apache/iggy-connectors read the same record and build against the commits that
it names.

If the docs on the site look old, compare
<https://iggy.apache.org/docs-source.json> with `master` of both docs
repositories. Then start `deploy.yml` by hand. GitHub disables the schedule
after 60 days without activity in this repository. To start it again, run
`gh workflow enable deploy.yml`.

A push to `staging` publishes iggy.staged.apache.org with the docs from
`master`. A manual run of `.github/workflows/stage.yml` publishes the branch
that it runs on, with the docs from the branches in its `iggy_branch` and
`connectors_branch` inputs.

## Getting help

- [dev@iggy.apache.org](mailto:dev@iggy.apache.org), the project's development
  mailing list, for project decisions and anything that should stay on the
  public record ([subscribe](mailto:dev-subscribe@iggy.apache.org))
- [Discord](https://discord.gg/apache-iggy) for informal conversation and quick
  questions
- [GitHub issues](https://github.com/apache/iggy-website/issues) for problems
  with the site or its documentation
