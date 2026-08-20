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

import Image from "next/image";
import type { Metadata } from "next";
import {
  CommunityHeader,
  CommunityLayout,
  ExternalLink,
} from "../_components/community-layout";

export const metadata: Metadata = {
  title: "Brand Kit",
  description: "Apache Iggy logo assets and brand guidance.",
};

const logoAssets = [
  {
    title: "Dark background",
    src: "/img/apache-iggy-color-darkbg0.5x.png",
    href: "/img/apache-iggy-color-darkbg0.5x.png",
  },
  {
    title: "Light background",
    src: "/img/apache-iggy-color-lightbg0.5x.png",
    href: "/img/apache-iggy-color-lightbg0.5x.png",
  },
  {
    title: "SVG mark",
    src: "/img/iggy-apache-color-darkbg.svg",
    href: "/img/iggy-apache-color-darkbg.svg",
  },
];

export default function BrandKitPage() {
  return (
    <CommunityLayout>
      <CommunityHeader
        title="Brand Kit"
        description="Use these resources when presenting, writing about or linking to Apache Iggy. Please follow Apache trademark and branding policy when using project marks."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {logoAssets.map((asset) => (
          <a
            key={asset.href}
            href={asset.href}
            className="rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent/60"
          >
            <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-fd-background p-4">
              <Image
                src={asset.src}
                alt={asset.title}
                width={220}
                height={72}
                className="max-h-20 w-auto object-contain"
                unoptimized
              />
            </div>
            <h2 className="text-base font-bold text-fd-foreground">
              {asset.title}
            </h2>
          </a>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Naming
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-fd-muted-foreground">
        <li>
          Use <strong className="text-fd-foreground">Apache Iggy</strong> on
          first mention.
        </li>
        <li>
          Do not imply that non-release artifacts, nightly builds or downstream
          packages are official Apache releases.
        </li>
      </ul>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-fd-foreground">
        Trademark Guidance
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-fd-muted-foreground">
        Apache project names and logos are trademarks of the Apache Software
        Foundation. For complete guidance, see the{" "}
        <ExternalLink href="https://www.apache.org/foundation/marks/">
          ASF trademark policy
        </ExternalLink>
        .
      </p>
    </CommunityLayout>
  );
}
