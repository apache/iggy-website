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

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetups",
  description: "Recordings of past Apache Iggy community meetups and the next scheduled event",
};

const meetups = [
  {
    date: "2026-10-07",
    title: "Apache Iggy community meetup, 2026-10-07",
    summary:
      "Piotr Gankiewicz on clustering in 0.9.0, followed by questions from the room and the chat.",
    recording: "https://youtu.be/n3a8VJdpeGc",
    notes: "https://github.com/apache/iggy/discussions/4440",
  },
];

export default function MeetupsPage() {
  return (
    <main className="min-h-screen px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-fd-foreground md:text-5xl">
          Meetups
        </h1>
        <p className="mb-14 max-w-3xl text-lg leading-relaxed text-fd-muted-foreground">
          The Apache Iggy&trade; community meets online. Each meetup is recorded
          and published on the{" "}
          <Link
            href="https://www.youtube.com/@ApacheIggy"
            className="text-fd-primary hover:underline"
          >
            Apache Iggy YouTube channel
          </Link>
          .
        </p>

        <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
          Next meetup
        </h2>
        <p className="mb-14 text-base text-fd-muted-foreground">
          No meetup is scheduled. Dates are announced on the{" "}
          <Link
            href="/community/mailing-lists"
            className="text-fd-primary hover:underline"
          >
            dev mailing list
          </Link>{" "}
          and in{" "}
          <Link
            href="https://github.com/apache/iggy/discussions"
            className="text-fd-primary hover:underline"
          >
            GitHub Discussions
          </Link>
          .
        </p>

        <h2 className="mb-6 text-2xl font-bold text-fd-foreground">
          Past meetups
        </h2>
        <div className="overflow-x-auto rounded-xl border border-fd-border">
          <table className="w-full text-left text-sm text-fd-foreground">
            <thead>
              <tr className="bg-fd-accent/60">
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Date
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Meetup
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Recording
                </th>
                <th className="border-b border-fd-border px-5 py-3.5 text-xs font-semibold tracking-wide text-fd-muted-foreground uppercase">
                  Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {meetups.map((m) => (
                <tr
                  key={m.date}
                  className="border-b border-fd-border/50 transition-colors hover:bg-fd-accent/30"
                >
                  <td className="px-5 py-4 text-fd-muted-foreground">
                    {m.date}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-semibold">{m.title}</span>
                    <br />
                    <span className="text-fd-muted-foreground">{m.summary}</span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={m.recording}
                      className="text-fd-primary hover:underline"
                    >
                      YouTube
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={m.notes}
                      className="text-fd-primary hover:underline"
                    >
                      Summary
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
