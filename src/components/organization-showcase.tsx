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
  hasUseCase,
  logoFor,
  organizationSlug,
  type Organization,
} from "@/lib/organizations";

/**
 * Height is pinned rather than capped. `max-h-*` with `w-auto` leaves a
 * replaced element inside a shrink-to-fit flex chain with a circular size
 * dependency that browsers resolve to zero, and a fixed height is what makes
 * logos of different aspect ratios read as one row.
 */
const WALL_LOGO_CLASS = "h-7 w-auto max-w-full shrink-0 object-contain";
const USE_CASE_LOGO_CLASS = "h-9 w-auto max-w-36 shrink-0 object-contain";

/**
 * Each theme shows its own artwork, and falls back to the name set as text
 * when there is none. Deliberately symmetric: a logo drawn for a light
 * background is often invisible on a dark card, so it is not reused across
 * themes. Either way the name is in the markup for both themes, so the
 * organization is readable without images and without JavaScript.
 *
 * The logo band needs a definite height and `shrink-0` on the image: a
 * replaced element with `width: auto` inside a shrink-to-fit flex container
 * otherwise resolves to zero on both axes.
 */
function Mark({ entry }: { entry: Organization }) {
  const { light, dark } = logoFor(entry);

  const name = (
    <span className="text-sm font-semibold leading-tight tracking-tight text-fd-foreground">
      {entry.name}
    </span>
  );

  if (!light && !dark) return name;

  const withLogo = (src: string) => (
    <>
      <span className="flex h-7 w-full items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${entry.name} logo`}
          className={WALL_LOGO_CLASS}
        />
      </span>
      {/* Most of these marks are wordmarks, so a visible caption would print
          the name twice. It stays in the DOM for screen readers and crawlers
          instead -- the point is that the page never depends on the image
          alone to say who this is. */}
      <span className="sr-only">{entry.name}</span>
    </>
  );

  return (
    <>
      <span className="flex flex-col items-center dark:hidden">
        {light ? withLogo(light) : name}
      </span>
      <span className="hidden flex-col items-center dark:flex">
        {dark ? withLogo(dark) : name}
      </span>
    </>
  );
}

const TILE_CLASS =
  "flex h-16 flex-col items-center justify-center rounded-lg px-3 text-center";

/**
 * A tile links to the organization's use-case section when it has one, and
 * to its own site otherwise. Entries with neither render as plain tiles
 * rather than pointing somewhere unverified.
 */
function Tile({ entry }: { entry: Organization }) {
  const interactive =
    "transition-colors hover:bg-fd-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary/50";

  if (hasUseCase(entry)) {
    return (
      <a
        href={`#${organizationSlug(entry)}`}
        className={`${TILE_CLASS} ${interactive}`}
      >
        <Mark entry={entry} />
      </a>
    );
  }

  if (entry.website) {
    return (
      <a
        href={entry.website}
        target="_blank"
        rel="noreferrer noopener"
        className={`${TILE_CLASS} ${interactive}`}
      >
        <Mark entry={entry} />
      </a>
    );
  }

  return (
    <div className={TILE_CLASS}>
      <Mark entry={entry} />
    </div>
  );
}

export function OrganizationWall({ entries }: { entries: Organization[] }) {
  return (
    <ul className="grid list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      {entries.map((entry) => (
        <li key={organizationSlug(entry)}>
          <Tile entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-fd-border bg-fd-muted/40 px-2.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
      {children}
    </span>
  );
}

/**
 * The use-case entry. Everything substantive here is plain semantic markup:
 * no disclosure, no modal, nothing that needs JavaScript to read.
 */
export function UseCaseCard({ entry }: { entry: Organization }) {
  const { light, dark } = logoFor(entry);
  const slug = organizationSlug(entry);

  const heading = entry.website ? (
    <a
      href={entry.website}
      target="_blank"
      rel="noreferrer noopener"
      className="transition-colors hover:text-fd-primary"
    >
      {entry.name}
    </a>
  ) : (
    entry.name
  );

  return (
    <article
      id={slug}
      className="scroll-mt-24 rounded-xl border border-fd-border bg-fd-card p-6 md:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-fd-foreground">
            {heading}
          </h3>
          {entry.useCaseCategory && (
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-fd-primary">
              {entry.useCaseCategory}
            </p>
          )}
        </div>

        {light && (
          <div className="flex h-9 items-center dark:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href={entry.website}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-fd-primary"
            >
              <img
                src={light}
                alt={`${entry.name} logo`}
                className={USE_CASE_LOGO_CLASS}
              />
            </a>
          </div>
        )}
        {dark && (
          <div className="hidden h-9 items-center dark:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a
              href={entry.website}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-fd-primary"
            >
              <img
                src={dark}
                alt={`${entry.name} logo`}
                className={USE_CASE_LOGO_CLASS}
              />
            </a>
          </div>
        )}
      </div>

      <p className="mt-5 max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        {entry.description}
      </p>

      {entry.quote && (
        <blockquote className="mt-5 border-l-2 border-fd-primary/60 pl-4 text-sm italic leading-relaxed text-fd-muted-foreground">
          <p>{entry.quote}</p>
          {entry.quoteAuthor && (
            <footer className="mt-2 not-italic text-xs text-fd-muted-foreground/80">
              {entry.quoteAuthor}
            </footer>
          )}
        </blockquote>
      )}

      {entry.technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {entry.technologies.map((technology) => (
            <Tag key={technology}>{technology}</Tag>
          ))}
        </div>
      )}

      {entry.caseStudyUrl && (
        <a
          href={entry.caseStudyUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-5 inline-block text-sm font-medium text-fd-primary transition-opacity hover:opacity-80"
        >
          Read the full case study &rarr;
        </a>
      )}
    </article>
  );
}
