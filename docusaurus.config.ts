import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Hyper-Efficient Message Streaming at Laser Speed.",
  tagline:
    "Apache Iggy (Incubating) is a persistent message streaming platform written in Rust, supporting QUIC, TCP and HTTP transport protocols, capable of processing millions of messages per second.",
  favicon: "img/favicon.png",

  // Set the production url of your site here
  url: "https://iggy.apache.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "apache", // Usually your GitHub org/user name.
  projectName: "iggy-website", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          path: "blog",
          routeBasePath: "blogs",
          blogTitle: "Blogs",
          truncateMarker: /<!--\s*truncate\s*-->/,
          // showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // // Please change this to your repo.
          // // Remove this to remove the "edit this page" links.
          // // editUrl:
          // //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // // Useful options to enforce blogging best practices
          // onInlineTags: 'warn',
          // onInlineAuthors: 'warn',
          // onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      disableSwitch: true,       // 👈 hides the toggle UI
      defaultMode: 'light',      // or 'dark', depending on your choice
      respectPrefersColorScheme: false,
    },
    image: "img//apache-iggy-light-bg0.5x.png",
    navbar: {
      title: "",
      logo: {
        alt: "Apache Iggy",
        srcDark: "img/apache-iggy-light-bg0.5x.png",
        src: "img/apache-iggy0.5x.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "/blogs", label: "Blogs", position: "left" },
        
        { href: "https://github.com/apache/iggy/releases", 
        label: "Downloads", 
        position: "left" 
        },
        {
          href: "https://benchmarks.iggy.rs",
          label: "Benchmarks",
          position: "left",
        },
        {
          href: "https://discord.gg/C5Sux5NcRa",
          label: "Discord",
          position: "left",
        },
        {
          href: "https://forms.gle/MAd1GjpPwCjwdEp58",
          label: "Feedback",
          position: "left",
        },
        {
          href: "https://github.com/apache/iggy",
          label: "GitHub ⭐ 2.7K+",
          position: "right",
        },
        {
          type: "dropdown",
          label: "ASF",
          position: "right",
          items: [
            { label: "Foundation", to: "https://www.apache.org/" },
            { label: "License", to: "https://www.apache.org/licenses/" },
            {
              label: "Events",
              to: "https://www.apache.org/events/current-event.html",
            },
            { label: "Security", to: "https://www.apache.org/security/" },
            {
              label: "Sponsorship",
              to: "https://www.apache.org/foundation/sponsorship.html",
            },
            {
              label: "Privacy",
              to: "https://privacy.apache.org/policies/privacy-policy-public.html",
            },
            {
              label: "Thanks",
              to: "https://www.apache.org/foundation/thanks.html",
            },
          ],
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Docs",
              to: "/docs/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/apache-iggy/",
            },
            {
              label: "Discord",
              href: "https://discord.gg/C5Sux5NcRa",
            },
            {
              label: "X",
              href: "https://x.com/ApacheIggy",
            },
            {
              label: "Bluesky",
              href: "https://bsky.app/profile/iggy.rs",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blogs",
              to: "/blogs",
            },
            {
              label: "GitHub",
              href: "https://github.com/apache/iggy",
            },
            {
              href: "https://benchmarks.iggy.rs",
              label: "Benchmarks",
            },
          ],
        },
      ],
      copyright: `<div>Apache Iggy is an effort undergoing incubation at The Apache Software Foundation (ASF), sponsored by the Apache Incubator. Incubation is required of all newly accepted projects until a further review indicates that the infrastructure, communications, and decision making process have stabilized in a manner consistent with other successful ASF projects. While incubation status is not necessarily a reflection of the completeness or stability of the code, it does indicate that the project has yet to be fully endorsed by the ASF.</div>
<div><br />
Copyright © 2025 The Apache Software Foundation, Licensed under the Apache License, Version 2.0.</div>
<div><br />
Apache®, the names of Apache projects, and the feather logo are either registered trademarks or trademarks of the Apache Software Foundation in the United States and/or other countries.</div>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
