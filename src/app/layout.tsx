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

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import Script from "next/script";
import { Matomo } from "@/components/matomo";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import "./global.css";

const OG_IMAGE = "/img/apache-iggy-color-darkbg0.5x.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Apache Iggy",
    template: "%s | Apache Iggy",
  },
  description: SITE_DESCRIPTION,
  // Relative values resolve against the current route, so every page gets its own canonical.
  alternates: { canonical: "./" },
  // No title/description here on purpose: Next fills og:title and og:description
  // from each page's own metadata, so per-page titles survive.
  openGraph: {
    type: "website",
    siteName: "Apache Iggy",
    url: "./",
    images: [
      {
        url: OG_IMAGE,
        width: 1951,
        height: 652,
        alt: "Apache Iggy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
  icons: { icon: "/img/favicon.png" },
};

// Structured data. Kept deliberately small: only claims the site already makes elsewhere.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "The Apache Software Foundation",
      url: "https://www.apache.org/",
      logo: `${SITE_URL}/img/asf_logo.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "technical support",
        email: "dev@iggy.apache.org",
        url: `${SITE_URL}/community/`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Apache Iggy",
      url: `${SITE_URL}/`,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Apache Iggy",
      applicationCategory: "DeveloperApplication",
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      license: "https://www.apache.org/licenses/LICENSE-2.0",
      sameAs: ["https://github.com/apache/iggy"],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <RootProvider
          search={{ options: { type: "static" as const } }}
          theme={{ defaultTheme: "dark" }}
        >
          {children}
        </RootProvider>
        {/* Snippet supplied by the Apache Privacy Team */}
        <Script id="matomo" strategy="afterInteractive">
          {`var _paq = window._paq = window._paq || [];
_paq.push(["setDoNotTrack", true]);
_paq.push(["disableCookies"]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="https://analytics.apache.org/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '80']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();`}
        </Script>
        <Matomo />
      </body>
    </html>
  );
}
