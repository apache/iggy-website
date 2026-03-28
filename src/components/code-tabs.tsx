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

"use client";

import { useState } from "react";
import { highlight } from "sugar-high";

const pkgInfo: Record<string, { install: string; url: string; label: string }> = {
  "Rust": { install: "cargo add iggy", url: "https://crates.io/crates/iggy", label: "crates.io" },
  "Python": { install: "pip install apache-iggy", url: "https://pypi.org/project/apache-iggy/", label: "PyPI" },
  "Java": { install: "org.apache.iggy:iggy", url: "https://mvnrepository.com/artifact/org.apache.iggy/iggy", label: "Maven Central" },
  "Go": { install: "go get github.com/apache/iggy/foreign/go", url: "https://pkg.go.dev/github.com/apache/iggy/foreign/go", label: "pkg.go.dev" },
  "Node.js": { install: "npm install apache-iggy", url: "https://www.npmjs.com/package/apache-iggy", label: "npm" },
  "C#": { install: "dotnet add package Apache.Iggy", url: "https://www.nuget.org/packages/Apache.Iggy/", label: "NuGet" },
  "C++ (WIP)": { install: "git clone https://github.com/apache/iggy", url: "https://github.com/apache/iggy/tree/master/foreign/cpp", label: "GitHub" },
};

const snippets = [
  {
    lang: "Rust",
    file: "producer.rs",
    href: "/docs/sdk/rust/high-level-sdk",
    code: `use iggy::prelude::*;

let client = IggyClient::from_connection_string(
    "iggy://iggy:iggy@localhost:8090"
)?;
client.connect().await?;

let producer = client
    .producer("orders", "events")?
    .direct(
        DirectConfig::builder()
            .batch_length(100)
            .build()
    )
    .partitioning(Partitioning::balanced())
    .build();
producer.init().await?;

let msg = IggyMessage::from_str("order-123")?;
producer.send(vec![msg]).await?;`,
  },
  {
    lang: "Python",
    file: "producer.py",
    href: "/docs/sdk/python/intro",
    code: `from apache_iggy import IggyClient, SendMessage

client = IggyClient.from_connection_string(
    "iggy://iggy:iggy@localhost:8090"
)
await client.connect()

await client.create_stream(name="orders")
await client.create_topic(
    stream="orders",
    name="events",
    partitions_count=3,
    replication_factor=1,
)

message = SendMessage("order-123")
await client.send_messages(
    stream="orders",
    topic="events",
    partitioning=1,
    messages=[message],
)`,
  },
  {
    lang: "Java",
    file: "Producer.java",
    href: "/docs/sdk/java/intro",
    code: `var client = IggyTcpClient.builder()
    .host("localhost")
    .port(8090)
    .credentials("iggy", "iggy")
    .buildAndLogin();

client.streams().createStream("orders");
client.topics().createTopic(
    StreamId.of("orders"), 1L,
    CompressionAlgorithm.None,
    BigInteger.ZERO, BigInteger.ZERO,
    Optional.empty(), "events"
);

client.messages().sendMessages(
    StreamId.of("orders"),
    TopicId.of("events"),
    Partitioning.partitionId(0L),
    List.of(Message.of("order-123"))
);

client.close();`,
  },
  {
    lang: "Go",
    file: "producer.go",
    href: "/docs/sdk/go/intro",
    code: `cli, _ := client.NewIggyClient(
    client.WithTcp(
        tcp.WithServerAddress(
            "127.0.0.1:8090"),
    ),
)
cli.LoginUser("iggy", "iggy")
cli.CreateStream("orders")

streamId, _ := iggcon.NewIdentifier(
    uint32(1),
)
cli.CreateTopic(
    streamId, "events", 3,
    iggcon.CompressionAlgorithmNone,
    iggcon.IggyExpiryNeverExpire,
    0, nil,
)

msg, _ := iggcon.NewIggyMessage(
    []byte("order-123"),
)
topicId, _ := iggcon.NewIdentifier(
    uint32(1),
)
cli.SendMessages(
    streamId, topicId,
    iggcon.PartitionId(0),
    []iggcon.IggyMessage{msg},
)`,
  },
  {
    lang: "Node.js",
    file: "producer.ts",
    href: "/docs/sdk/node/intro",
    code: `import { Client, Partitioning } from 'apache-iggy';

const client = new Client({
  transport: 'TCP',
  options: { port: 8090, host: '127.0.0.1' },
  credentials: {
    username: 'iggy', password: 'iggy'
  },
});

const stream = await client.stream.create({
  name: 'orders'
});
const topic = await client.topic.create({
  streamId: stream.id,
  name: 'events',
  partitionCount: 3,
  compressionAlgorithm: 1,
  replicationFactor: 1,
});

await client.message.send({
  streamId: stream.id,
  topicId: topic.id,
  partition: Partitioning.PartitionId(1),
  messages: [{ payload: 'order-123' }],
});

await client.destroy();`,
  },
  {
    lang: "C#",
    file: "Producer.cs",
    href: "/docs/sdk/csharp/intro",
    code: `var client = IggyClientFactory.CreateClient(
    new IggyClientConfigurator() {
        BaseAddress = "127.0.0.1:8090",
        Protocol = Protocol.Tcp,
    }
);
await client.ConnectAsync();
await client.LoginUser("iggy", "iggy");

await client.CreateStreamAsync("orders");
await client.CreateTopicAsync(
    Identifier.String("orders"),
    "events", 3,
    CompressionAlgorithm.None
);

await client.SendMessagesAsync(
    Identifier.String("orders"),
    Identifier.String("events"),
    Partitioning.PartitionId(1),
    new[] {
        new Message(Guid.NewGuid(),
            Encoding.UTF8.GetBytes(
                "order-123"))
    }
);`,
  },
  {
    lang: "C++ (WIP)",
    file: "producer.cpp",
    href: "/docs/sdk/cpp/intro",
    code: `#include "lib.rs.h"

auto* client = iggy::ffi::new_connection(
    "iggy://iggy:iggy@localhost:8090"
);
client->connect();
client->login_user("iggy", "iggy");

client->create_stream("orders");

auto stream_id =
    make_string_identifier("orders");

client->create_topic(
    stream_id, "events", 3,
    "none", 0,
    "server_default", 0,
    "server_default"
);

iggy::ffi::delete_connection(client);`,
  },
];

export function LandingCodeTabs() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const s = snippets[active];
  const pkg = pkgInfo[s.lang];

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220] overflow-hidden">
        <div className="flex items-center border-b border-white/[0.06] overflow-x-auto">
          {snippets.map((sn, i) => (
            <button
              key={sn.lang}
              onClick={() => setActive(i)}
              className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                i === active
                  ? "text-[#ff9103] border-b-2 border-[#ff9103] bg-white/[0.03]"
                  : "text-[#636b75] hover:text-[#aaafb6]"
              }`}
            >
              {sn.lang}
            </button>
          ))}
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-[#636b75] font-mono">{s.file}</span>
            </div>
            <a
              href={s.href}
              className="text-[10px] text-[#ff9103] no-underline hover:underline"
            >
              SDK docs →
            </a>
          </div>
          <pre className="text-[13px] leading-relaxed font-mono overflow-x-auto m-0 whitespace-pre min-h-[360px]">
            <code dangerouslySetInnerHTML={{ __html: highlight(s.code) }} />
          </pre>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(pkg.install);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="group flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 transition-colors hover:border-white/[0.15]"
        >
          <code className="font-mono text-xs text-[#aaafb6]">{pkg.install}</code>
          <svg className="h-3.5 w-3.5 shrink-0 text-[#636b75] transition-colors group-hover:text-[#aaafb6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            )}
          </svg>
        </button>
        <a
          href={pkg.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#ff9103]/80 no-underline transition-colors hover:text-[#ff9103]"
        >
          {pkg.label} →
        </a>
      </div>
    </div>
  );
}
