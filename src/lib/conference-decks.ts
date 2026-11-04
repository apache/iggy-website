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

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type ConferenceDeck = {
  routeSegments: [string, ...string[]];
  year: string;
  city: string;
  conferenceName: string;
  title: string;
  shortDescription: string;
  presenterName: string;
  deckPath?: string;
  pdfDownloadPath?: string;
  videoUrl?: string;
  order?: number;
};

type ConferenceDeckSidecar = Partial<
  Pick<
    ConferenceDeck,
    | "title"
    | "shortDescription"
    | "presenterName"
    | "conferenceName"
    | "city"
    | "year"
    | "videoUrl"
    | "order"
  >
>;

const DECKS_ROOT = path.join(process.cwd(), "public", "decks", "conferences");

const ENTRY_FILE = /\.(html|meta\.json)$/i;

/** Each talk's path without its extension, from its HTML export or its sidecar. */
function walkTalks(dir: string): string[] {
  const talks = readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkTalks(fullPath);
    return entry.isFile() && ENTRY_FILE.test(entry.name)
      ? [fullPath.replace(ENTRY_FILE, "")]
      : [];
  });
  return [...new Set(talks)];
}

function labelFromSegment(segment = "") {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

let cached: ConferenceDeck[] | null = null;

/**
 * Talks live under public/decks/conferences/<year>/<city>/<conference>/. A `<slug>.html`
 * single-file export is the deck, a `<slug>.meta.json` supplies the title, presenter,
 * video link and so on, and a `<slug>.pdf` is offered as the PDF download. A talk with
 * a recording but no deck has only the sidecar.
 */
export function getConferenceDecks(): ConferenceDeck[] {
  if (cached) return cached;
  if (!existsSync(DECKS_ROOT)) return [];

  cached = walkTalks(DECKS_ROOT)
    .sort()
    .map((basePath) => {
      const relativePath = path
        .relative(DECKS_ROOT, basePath)
        .split(path.sep)
        .join("/");
      const routeSegments = relativePath
        .split("/")
        .filter(Boolean) as [string, ...string[]];
      const sidecarPath = `${basePath}.meta.json`;
      const sidecar: ConferenceDeckSidecar = existsSync(sidecarPath)
        ? JSON.parse(readFileSync(sidecarPath, "utf8"))
        : {};
      const title =
        sidecar.title ?? labelFromSegment(routeSegments[routeSegments.length - 1]);
      const conferenceName =
        sidecar.conferenceName ?? labelFromSegment(routeSegments[2]);
      const year = sidecar.year ?? routeSegments[0];

      return {
        routeSegments,
        year,
        city: sidecar.city ?? labelFromSegment(routeSegments[1]),
        conferenceName,
        title,
        shortDescription:
          sidecar.shortDescription ?? `${title} at ${conferenceName} ${year}`,
        presenterName: sidecar.presenterName ?? "",
        deckPath: existsSync(`${basePath}.html`)
          ? `/decks/conferences/${relativePath}.html`
          : undefined,
        pdfDownloadPath: existsSync(`${basePath}.pdf`)
          ? `/decks/conferences/${relativePath}.pdf`
          : undefined,
        videoUrl: sidecar.videoUrl,
        order: sidecar.order,
      };
    })
    .sort(
      (a, b) =>
        (b.order ?? 0) - (a.order ?? 0) ||
        b.routeSegments.join("/").localeCompare(a.routeSegments.join("/")),
    );

  return cached;
}

export function getConferenceDeck(routeSegments: string[]) {
  return getConferenceDecks().find(
    (deck) => deck.routeSegments.join("/") === routeSegments.join("/"),
  );
}

export function getConferenceDeckPage(deck: ConferenceDeck) {
  return `/presentations/${deck.routeSegments.join("/")}`;
}
