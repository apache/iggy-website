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
import { notFound } from "next/navigation";

import {
  getConferenceDeck,
  getConferenceDecks,
  getConferenceDeckPage,
} from "@/lib/conference-decks";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getConferenceDecks()
    .filter(({ deckPath }) => deckPath)
    .map(({ routeSegments }) => ({ slug: routeSegments }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getConferenceDeck(slug);
  if (!deck) return {};

  return {
    title: deck.title,
    description: deck.shortDescription,
    alternates: { canonical: getConferenceDeckPage(deck) },
  };
}

export default async function ConferenceDeckPage({ params }: PageProps) {
  const { slug } = await params;
  const deck = getConferenceDeck(slug);
  if (!deck?.deckPath) notFound();

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#05070D]">
      <iframe
        title={deck.title}
        src={deck.deckPath}
        className="h-full w-full border-0"
        loading="eager"
        allow="fullscreen"
      />
      <a
        href="/presentations/"
        className="absolute left-4 top-4 z-30 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition hover:bg-black/75"
      >
        All presentations
      </a>
    </main>
  );
}
