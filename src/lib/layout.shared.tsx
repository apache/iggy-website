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

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { GitHubStars } from "@/components/github-stars";
import { ASFDropdown } from "@/components/asf-dropdown";
import { ASFMobileLinks } from "@/components/asf-mobile-links";

const sharedLinks: BaseLayoutProps["links"] = [
  { text: "Docs", url: "/docs" },
  { text: "Blogs", url: "/blogs" },
  { text: "Downloads", url: "/downloads" },
  {
    text: "Benchmarks",
    url: "https://benchmarks.iggy.apache.org",
    external: true,
  },
  {
    text: "Discord",
    url: "https://discord.gg/apache-iggy",
    external: true,
  },
  {
    type: "custom",
    on: "nav",
    secondary: true,
    children: <ASFDropdown />,
  },
  {
    type: "custom",
    on: "menu",
    children: <ASFMobileLinks />,
  },
  {
    type: "custom",
    secondary: true,
    children: <GitHubStars />,
  },
];

export function homeOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <Image
          src="/img/apache-iggy-color-darkbg0.5x.png"
          alt="Apache Iggy"
          width={240}
          height={48}
          className="h-10 w-auto md:h-12"
          unoptimized
        />
      ),
      transparentMode: "top",
    },
    searchToggle: { enabled: false },
    links: sharedLinks,
  };
}

export function siteOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo className="h-10 w-auto md:h-12" />,
      transparentMode: "top",
    },
    searchToggle: { enabled: false },
    links: sharedLinks,
  };
}

export function docsOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo className="h-9 w-auto md:h-11" />,
    },
    links: [
      { text: "Home", url: "/" },
      { text: "Blogs", url: "/blogs" },
      { text: "Downloads", url: "/downloads" },
      {
        type: "custom",
        on: "nav",
        secondary: true,
        children: <GitHubStars />,
      },
    ],
  };
}
