import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Official release artifacts of Apache Iggy (Incubating)",
};

const releases = [
  {
    version: "0.6.0-incubating",
    latest: true,
    date: "2025-12-09",
    archive:
      "https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz",
    asc: "https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz.asc",
    sha: "https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz.sha512",
    changelog: "/blogs/2025/12/09/release-0.6.0",
  },
  {
    version: "0.5.0-incubating",
    latest: false,
    date: "2025-08-10",
    archive:
      "https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz",
    asc: "https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.asc",
    sha: "https://downloads.apache.org/incubator/iggy/0.5.0/iggy-0.5.0-incubating-src.tar.gz.sha512",
    changelog: "/blogs/2025/08/10/release-0.5.0",
  },
  {
    version: "0.4.300-incubating",
    latest: false,
    date: "2025-04-15",
    archive:
      "https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz",
    asc: "https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz.asc",
    sha: "https://downloads.apache.org/incubator/iggy/0.4.300/iggy-0.4.300-incubating-src.tar.gz.sha512",
    changelog: "https://github.com/apache/iggy/releases/tag/server-0.4.300",
  },
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
          Downloads
        </h1>
        <p className="mb-14 max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
          The Apache Iggy project publishes source-code releases as compressed
          archives (
          <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-sm">
            .tar.gz
          </code>
          ). Binary convenience builds may appear in the future, but{" "}
          <strong className="text-fd-foreground">
            the only official artifacts today are the source packages signed by
            Iggy committers and mirrored by the Apache Software Foundation.
          </strong>
        </p>

        <h2 className="mb-6 text-2xl font-bold text-fd-foreground">Releases</h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm text-fd-foreground">
            <thead>
              <tr className="bg-fd-accent/60">
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Version
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Date
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Source
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Verify
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Changelog
                </th>
              </tr>
            </thead>
            <tbody>
              {releases.map((r) => (
                <tr
                  key={r.version}
                  className="border-b border-fd-border/50 transition-colors hover:bg-fd-accent/30"
                >
                  <td className="px-5 py-4 font-semibold">
                    {r.version}
                    {r.latest && (
                      <span className="ml-2 rounded-full bg-fd-primary px-2.5 py-0.5 text-xs font-bold text-fd-primary-foreground">
                        latest
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-fd-muted-foreground">
                    {r.date}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={r.archive}
                      className="text-fd-primary hover:underline"
                    >
                      .tar.gz
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={r.asc}
                      className="text-fd-primary hover:underline"
                    >
                      asc
                    </Link>
                    {" / "}
                    <Link
                      href={r.sha}
                      className="text-fd-primary hover:underline"
                    >
                      sha512
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={r.changelog}
                      className="text-fd-primary hover:underline"
                    >
                      {r.version.replace("-incubating", "")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-fd-muted-foreground/70">
          Older incubating releases will appear in the same{" "}
          <Link
            href="https://downloads.apache.org/incubator/iggy/"
            className="text-fd-primary hover:underline"
          >
            downloads directory
          </Link>{" "}
          after they are approved by the Apache Incubator PMC.
        </p>

        <h2 className="mb-4 mt-14 text-2xl font-bold text-fd-foreground">
          Notes
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-base text-fd-muted-foreground">
          <li>
            <strong className="text-fd-foreground">Verify before use.</strong>{" "}
            Always check the OpenPGP{" "}
            <strong className="text-fd-foreground">signature</strong> (.asc) or,
            if that is not possible, at least the{" "}
            <strong className="text-fd-foreground">SHA-512 checksum</strong>.
          </li>
          <li>
            The{" "}
            <Link
              href="https://downloads.apache.org/incubator/iggy/KEYS"
              className="text-fd-primary hover:underline"
            >
              KEYS
            </Link>{" "}
            file contains all public keys used to sign Iggy releases.
          </li>
          <li>
            Because Iggy is still in the Apache Incubator, releases are{" "}
            <strong className="text-fd-foreground">incubating releases</strong>{" "}
            and are not yet official ASF products.
          </li>
        </ul>

        <h2 className="mb-4 mt-14 text-2xl font-bold text-fd-foreground">
          Verify the signature
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-5 text-sm leading-relaxed text-fd-foreground/85">
          <code>{`# Download artifact, matching .asc file and KEYS
curl -O https://downloads.apache.org/incubator/iggy/KEYS
curl -O https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz
curl -O https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz.asc

# Import Iggy release keys
gpg --import KEYS

# Verify signature
gpg --verify iggy-0.6.0-incubating-src.tar.gz.asc iggy-0.6.0-incubating-src.tar.gz`}</code>
        </pre>

        <h2 className="mb-4 mt-14 text-2xl font-bold text-fd-foreground">
          Verify the checksum
        </h2>
        <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-5 text-sm leading-relaxed text-fd-foreground/85">
          <code>{`curl -O https://downloads.apache.org/incubator/iggy/0.6.0/iggy-0.6.0-incubating-src.tar.gz.sha512
shasum -a 512 -c iggy-0.6.0-incubating-src.tar.gz.sha512`}</code>
        </pre>

        <h2 className="mb-4 mt-14 text-2xl font-bold text-fd-foreground">
          Need bleeding-edge code?
        </h2>
        <p className="text-base text-fd-muted-foreground">
          The latest development code is available from the{" "}
          <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-sm">
            master
          </code>{" "}
          branch on GitHub:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-card p-5 text-sm leading-relaxed text-fd-foreground/85">
          <code>git clone https://github.com/apache/iggy.git</code>
        </pre>
        <p className="mt-4 text-sm text-fd-muted-foreground/70">
          Be aware that trunk builds{" "}
          <strong className="text-fd-muted-foreground">
            may be unstable and are not ASF-endorsed releases
          </strong>
          .
        </p>

        <div className="mt-16 border-t border-fd-border pt-8 text-xs text-fd-muted-foreground/60">
          &copy; {new Date().getFullYear()} The Apache Software Foundation.
          Apache, Apache Iggy, the Apache feather logo, and related marks are
          trademarks of the ASF.
        </div>
      </div>
    </main>
  );
}
