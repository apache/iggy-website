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

import type { Metadata } from "next";
import Link from "next/link";

import {
  getConferenceDecks,
  getConferenceDeckPage,
} from "@/lib/conference-decks";

export const metadata: Metadata = {
  title: "Presentations",
  description:
    "Conference talks on Apache Iggy, Rust, io_uring and tail latency. Watch the recordings, open the decks as slides or download the HTML and PDF.",
};

const buttonClass =
  "inline-flex items-center rounded-lg border border-fd-border px-3 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent";

export default function PresentationsPage() {
  const decks = getConferenceDecks();

  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-16">
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
            Presentations
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
            Conference talks on Apache Iggy, Rust, io_uring and tail latency.
            Watch a recording, open a deck as slides, or download it as HTML or
            PDF.
          </p>
        </header>

        {decks.length === 0 ? (
          <p className="text-fd-muted-foreground">
            No presentations published yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {decks.map((deck) => {
              const pageUrl = deck.deckPath
                ? getConferenceDeckPage(deck)
                : deck.videoUrl;
              return (
                <article
                  key={deck.routeSegments.join("/")}
                  className="flex flex-col rounded-2xl border border-fd-border bg-fd-card p-8"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-fd-muted-foreground">
                    {deck.conferenceName} {deck.year} &middot; {deck.city}
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-tight text-fd-foreground">
                    {pageUrl ? (
                      <Link href={pageUrl} className="hover:text-fd-primary">
                        {deck.title}
                      </Link>
                    ) : (
                      deck.title
                    )}
                  </h2>
                  {deck.presenterName && (
                    <p className="mt-1 text-sm text-fd-muted-foreground">
                      {deck.presenterName}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fd-muted-foreground">
                    {deck.shortDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {deck.videoUrl && (
                      <a href={deck.videoUrl} className={buttonClass}>
                        Watch
                      </a>
                    )}
                    {deck.deckPath && (
                      <>
                        <Link
                          href={getConferenceDeckPage(deck)}
                          className={buttonClass}
                        >
                          Open slides
                        </Link>
                        <a
                          href={deck.deckPath}
                          download
                          className={buttonClass}
                        >
                          HTML
                        </a>
                      </>
                    )}
                    {deck.pdfDownloadPath && (
                      <a
                        href={deck.pdfDownloadPath}
                        download
                        className={buttonClass}
                      >
                        PDF
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
