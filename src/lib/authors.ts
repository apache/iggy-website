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

export interface Author {
  name: string;
  title?: string;
  url?: string;
  image: string;
}

const FALLBACK_IMAGE = "/img/Avatar-Placeholder.svg";

export const authors: Record<string, Author> = {
  piotr: {
    name: "Piotr Gankiewicz",
    title: "Apache Iggy Founder & PMC Member",
    url: "https://github.com/spetz",
    image: "/img/authors/piotr.png",
  },
  kranti: {
    name: "Kranti Parisa",
    title: "Apache Iggy PMC Chair",
    url: "https://github.com/kparisa",
    image: "/img/authors/kranti.png",
  },
  grzegorz: {
    name: "Grzegorz Koszyk",
    title: "Apache Iggy PMC Member",
    url: "https://github.com/numinnex",
    image: "/img/authors/grzegorz.png",
  },
  hubert: {
    name: "Hubert Gruszecki",
    title: "Apache Iggy PMC Member",
    url: "https://github.com/hubcio",
    image: "/img/authors/hubert.png",
  },
  krishna: {
    name: "Krishna Vishal Vemula",
    title: "Apache Iggy Committer",
    url: "https://github.com/krishvishal",
    image: "/img/authors/krishna.png",
  },
};

/**
 * Resolves a frontmatter `author` value (a single key or a comma-separated
 * list, e.g. "piotr, kranti") into full author entries. Unknown keys fall
 * back to a plain entry so legacy values like "Apache Iggy" still render.
 */
export function resolveAuthors(author: string | undefined): Author[] {
  if (!author) return [];
  return author
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean)
    .map(
      (key) => authors[key] ?? { name: key, image: FALLBACK_IMAGE },
    );
}
