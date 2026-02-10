import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: {
    default: "Apache Iggy (Incubating)",
    template: "%s | Apache Iggy",
  },
  description:
    "Apache Iggy (Incubating) is a persistent message streaming platform written in Rust, supporting QUIC, TCP and HTTP transport protocols, capable of processing millions of messages per second.",
  icons: { icon: "/img/favicon.png" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <RootProvider
          search={{ options: { type: "static" as const } }}
          theme={{ defaultTheme: "dark" }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
