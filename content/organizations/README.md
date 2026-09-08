<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Adding your organization to Powered By Iggy

[iggy.apache.org/powered-by](https://iggy.apache.org/powered-by) lists the
organizations, projects and teams building with Apache Iggy. It is maintained
by the community: every entry arrives as an issue or a pull request from the
people who run the system.

Production deployments, pilots, integrations and open source side projects are
all welcome. A team benchmarking Iggy against other streaming engines is as useful a data point
for the next reader as a fleet running it at scale.

## Two ways to submit

**Open an issue.** Use the
[Powered By Iggy submission form](https://github.com/apache/iggy-website/issues/new?template=organization-submission.yml).
Three required fields; a committer opens the pull request for you.

**Send the pull request yourself.**

1. Copy [`TEMPLATE.mdx`](TEMPLATE.mdx) to `content/organizations/<your-slug>.mdx`.
   Use a lowercase hyphenated slug: `acme.mdx`.
2. Fill in the frontmatter. Delete every field you do not use.
3. Commit any logo files to `public/img/organizations/`.
4. Leave `draft: true`. A committer flips it to `false` once verified, and
   that is what publishes the entry.
5. Open the PR. Conventional commit style, e.g.
   `content(site): add Acme Inc to Powered By`.

Run `npm install && npm run dev`, then open <http://localhost:3000/powered-by>
to preview. Setting `draft: false` locally shows your entry; set it back to `draft: true`
before committing.

## How the page decides what to show

There are two levels, and the difference is whether you wrote a description.

| You supply | Where it appears |
| --- | --- |
| Name only | Logo wall, unlinked |
| Name + website | Logo wall, linked to your site |
| Name + logo | Logo wall, showing your logo |
| ...plus a `description` | Also gets a card in **How Iggy is being used**, and the wall tile links to it |

There is deliberately no way to get a use-case card without writing a real
description. Generated filler such as "Acme runs Apache Iggy in production" is
not published: it tells a reader nothing, and a page of it reads as marketing.
If all you can share is that you use Iggy, the logo wall is the right home and a
complete answer.

## Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Printed exactly as written. |
| `website` | yes | Omit rather than guess; the tile renders unlinked. |
| `deploymentStatus` | yes | `production`, `pilot`, `evaluating` or `integration`. Not shown on the page. |
| `useCaseCategory` | no | Short phrase, e.g. `Observability, AI Infrastructure`. |
| `description` | no | One to three sentences, third person. Promotes the entry into the use-case section. |
| `technologies` | no | List of short strings, rendered as tags. |
| `caseStudyUrl` | no | Public write-up to link. |
| `quote` / `quoteAuthor` | no | Attributed pull quote. |
| `logo` | no | Artwork legible on a **light** background. |
| `logoDark` | no | Artwork legible on a **dark** background. |
| `permissionConfirmed` | no | Defaults to `false`. **No logo renders until this is `true`.** |
| `draft` | no | Defaults to `true`. Committers publish by setting `false`. |
| `submittedBy` | no | GitHub handle, so committers know who to follow up with. |

Anything below the frontmatter is maintainer notes. It is not rendered, but it
is still MDX: a bare `<` starts a JSX tag and fails the build. Write links as
`[text](url)` rather than `<https://example.com>`, and wrap placeholders like
`<name>` in backticks.

### Logos and the two themes

A single logo usually works in only one theme. Supply artwork for whichever
backgrounds you have; the other theme falls back to your name as text, and
plenty of entries are text-only by choice.

SVG is preferred; a transparent PNG at least 400px wide is fine. Tiles cap
logos at roughly 144x36px, so wordmarks read better than tall lockups.

The build checks that the file named in the frontmatter actually exists in
`public/`. A missing file falls back to text rather than shipping a broken
image, so a PR can safely land the frontmatter and the artwork separately.

### Logo permission

`permissionConfirmed` is not a formality. Setting it to `true` is your
statement that you are authorized to grant the ASF permission to display your
mark on iggy.apache.org. Reviewers will ask who confirmed it.

Adding an organization you do not work for? Leave it `false` and say so in the
PR. Someone from that organization can grant permission in a follow-up.

## What committers check before publishing

- The submission comes from the organization, or the PR says who confirmed it.
- Any `description` describes real usage and reads as a record, not an advert.
- `permissionConfirmed` is `true` only where permission was actually granted.
- Logo files are committed to the repo, not hotlinked.
- No field was filled in by guessing. An empty field is always better.

Entries go stale. If something listed here is no longer accurate, open an
issue or a PR: removing an entry needs no more justification than adding one.

## Trademark note

Company names, product names and logos are the property of their respective
owners. Inclusion on the Powered By page does not imply that the ASF endorses
any listed organization, or that any listed organization endorses Apache Iggy
beyond the description it submitted. See the
[ASF trademark policy](https://www.apache.org/foundation/marks/) for how
Apache marks themselves may be used.
