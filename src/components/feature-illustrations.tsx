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

import { useId, type ReactNode } from "react";

// Decorative artwork for the features page. Each drawing takes its accent
// from the --fi custom property set on the surrounding panel, and its neutral
// strokes and labels from the current text colour, so it follows the theme.

const ACCENT = "var(--fi)";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 200"
      aria-hidden="true"
      fill="none"
      className="h-auto w-full text-fd-foreground"
    >
      {children}
    </svg>
  );
}

function Label({
  x,
  y,
  children,
  size = 12,
  mono = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  mono?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={Math.max(size, 11)}
      fontWeight={600}
      fontFamily={mono ? "ui-monospace, monospace" : "inherit"}
      fill="currentColor"
    >
      {children}
    </text>
  );
}

function Box({
  x,
  y,
  w,
  h,
  filled = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  filled?: boolean;
  opacity?: number;
}) {
  return filled ? (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      fill={ACCENT}
      opacity={opacity}
    />
  ) : (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      stroke="currentColor"
      strokeOpacity={0.65}
      strokeWidth={1.5}
    />
  );
}

function Wire({
  d,
  dashed = false,
  accent = false,
  arrow = false,
}: {
  d: string;
  dashed?: boolean;
  accent?: boolean;
  arrow?: boolean;
}) {
  const markerId = useId();
  return (
    <>
      {arrow && <defs><marker id={markerId} viewBox="0 0 8 8" refX={8} refY={4} markerWidth={5} markerHeight={5} orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={accent ? ACCENT : "currentColor"} /></marker></defs>}
    <path
      d={d}
      stroke={accent ? ACCENT : "currentColor"}
      strokeOpacity={accent ? 1 : 0.7}
      strokeWidth={accent ? 2.5 : 1.5}
      strokeLinecap="round"
      strokeDasharray={dashed ? "5 5" : undefined}
      markerEnd={arrow ? `url(#${markerId})` : undefined}
    />
    </>
  );
}

function DashedBox({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      stroke="currentColor"
      strokeOpacity={0.65}
      strokeWidth={1.5}
      strokeDasharray="5 5"
    />
  );
}

function Lock({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path
        d={`M${cx - 9} ${cy - 4} v-8 a9 9 0 0 1 18 0 v8`}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <rect
        x={cx - 14}
        y={cy - 4}
        width={28}
        height={22}
        rx={5}
        fill="currentColor"
      />
    </g>
  );
}

export function ShardsArt() {
  return (
    <Frame>
      {[0, 1, 2, 3].map((i) => {
        const x = 14 + i * 76;
        return (
          <g key={i}>
            <Box x={x} y={14} w={64} h={150} />
            <circle cx={x + 32} cy={42} r={14} fill={ACCENT} />
            {[0, 1, 2].map((j) => (
              <Box
                key={j}
                x={x + 12}
                y={70 + j * 30}
                w={40}
                h={20}
                filled
                opacity={0.25 + ((i + j) % 3) * 0.2}
              />
            ))}
            <Label x={x + 32} y={182} size={10}>
              shard {i}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

export function SegmentsArt() {
  return (
    <Frame>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box
            x={14 + i * 76}
            y={60}
            w={66}
            h={64}
            filled
            opacity={0.35 + i * 0.2}
          />
          <Label x={47 + i * 76} y={144} size={10}>
            sealed
          </Label>
        </g>
      ))}
      <Box x={242} y={60} w={66} h={64} />
      <rect x={242} y={60} width={30} height={64} rx={8} fill={ACCENT} />
      <Label x={275} y={144} size={10}>
        active
      </Label>
      <Wire d="M275 22 V48 M268 41 L275 48 L282 41" />
      {[0, 1, 2, 3].map((i) => (
        <Wire key={i} d={`M${20 + i * 76} 168 h54`} />
      ))}
    </Frame>
  );
}

export function HierarchyArt() {
  return (
    <Frame>
      <Wire d="M160 46 V64 M90 64 H230 M90 64 V80 M230 64 V80" />
      <Box x={110} y={14} w={100} h={32} filled />
      <Label x={160} y={30}>
        stream
      </Label>
      {[40, 180].map((x) => (
        <g key={x}>
          <Box x={x} y={80} w={100} h={32} filled opacity={0.45} />
          <Label x={x + 50} y={96}>
            topic
          </Label>
          <Wire d={`M${x + 50} 112 V128 M${x + 14} 128 H${x + 86}`} />
          {[0, 1, 2].map((j) => (
            <g key={j}>
              <Wire d={`M${x + 14 + j * 36} 128 V140`} />
              <Box x={x + j * 36} y={140} w={28} h={40} />
            </g>
          ))}
        </g>
      ))}
    </Frame>
  );
}

export function ConsumerGroupArt() {
  return (
    <Frame>
      {[0, 1, 2, 3].map((i) => {
        const y = 22 + i * 42;
        const target = i < 2 ? 64 : 136;
        return (
          <g key={i}>
            <Wire arrow
              d={`M130 ${y + 13} C190 ${y + 13} 190 ${target} 246 ${target}`}
            />
            <Box x={20} y={y} w={110} h={26} filled opacity={0.35 + i * 0.2} />
            <Label x={75} y={y + 13} size={10}>
              partition {i}
            </Label>
          </g>
        );
      })}
      {[64, 136].map((cy, i) => (
        <g key={cy}>
          <circle cx={272} cy={cy} r={26} stroke={ACCENT} strokeWidth={2.5} />
          <Label x={272} y={cy} size={10}>
            client {i + 1}
          </Label>
        </g>
      ))}
    </Frame>
  );
}

export function ClusterArt() {
  return (
    <Frame>
      <Wire d="M138 78 L98 122" arrow accent />
      <Wire d="M182 78 L222 122" arrow accent />
      <circle cx={160} cy={52} r={28} fill={ACCENT} />
      <Label x={160} y={52}>primary</Label>
      {[80, 240].map((cx) => <g key={cx}>
        <Box x={cx - 40} y={126} w={80} h={42} />
        <Label x={cx} y={147}>replica</Label>
      </g>)}
      <Label x={160} y={186}>primary sends log entries</Label>
    </Frame>
  );
}

export function MultiLeaderArt() {
  return (
    <Frame>
      {["A", "B", "C"].map((name, i) => {
        const x = 14 + i * 102;
        return (
          <g key={name}>
            <Box x={x} y={14} w={88} h={150} />
            {[0, 1, 2].map((j) => (
              <g key={j}>
                <Box
                  x={x + 12}
                  y={28 + j * 44}
                  w={64}
                  h={32}
                  filled={i === j}
                />
                <Label x={x + 44} y={44 + j * 44} size={10}>
                  P{j}
                </Label>
              </g>
            ))}
            <Label x={x + 44} y={182} size={10}>
              node {name}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

export function SecurityArt() {
  return (
    <Frame>
      {[
        { r: 92, name: "global", opacity: 0.12 },
        { r: 66, name: "stream", opacity: 0.22 },
        { r: 40, name: "topic", opacity: 0.4 },
      ].map(({ r, name, opacity }) => (
        <g key={name}>
          <circle cx={160} cy={102} r={r} fill={ACCENT} opacity={opacity} />
          <Label x={160} y={102 - r + 13} size={10}>
            {name}
          </Label>
        </g>
      ))}
      <Lock cx={160} cy={110} />
    </Frame>
  );
}

export function SdksArt() {
  const languages = [
    "Rust",
    "C#",
    "Java",
    "Python",
    "Node.js",
    "Go",
    "PHP",
    "C++",
    "Swift",
  ];
  return (
    <Frame>
      {languages.map((language, i) => {
        const x = 14 + (i % 3) * 102;
        const y = 10 + Math.floor(i / 3) * 42;
        return (
          <g key={language}>
            <Box
              x={x}
              y={y}
              w={88}
              h={34}
              filled
              opacity={0.2 + (i % 4) * 0.15}
            />
            <Label x={x + 44} y={y + 17}>
              {language}
            </Label>
          </g>
        );
      })}
      <Label x={160} y={144}>transports</Label>
      {[{ name: "TCP", x: 6, w: 58 }, { name: "QUIC", x: 70, w: 64 }, { name: "WebSocket", x: 140, w: 102 }, { name: "HTTP", x: 248, w: 66 }].map(({ name, x, w }) => <g key={name}>
        <Box x={x} y={160} w={w} h={30} />
        <Label x={x + w / 2} y={175} size={12}>{name}</Label>
      </g>)}
    </Frame>
  );
}

export function KafkaGatewayArt() {
  return (
    <Frame>
      <Wire d="M98 100 H112" arrow />
      <Wire d="M208 100 H222" arrow />
      <Box x={8} y={72} w={90} h={56} />
      <Label x={53} y={100} size={10}>
        Kafka client
      </Label>
      <Box x={114} y={72} w={92} h={56} filled />
      <Label x={160} y={100}>
        gateway
      </Label>
      <Box x={224} y={72} w={88} h={56} />
      <Label x={268} y={100}>
        Iggy
      </Label>
    </Frame>
  );
}

export function ConnectorsArt() {
  const sources = ["PostgreSQL", "MQTT", "HTTP"];
  const sinks = ["Iceberg", "S3", "Elasticsearch"];
  return (
    <Frame>
      {[0, 1, 2].map((i) => {
        const y = 26 + i * 54;
        return (
          <g key={i}>
            <Wire arrow d={`M86 ${y + 20} C104 ${y + 20} 104 100 122 100`} />
            <Wire arrow d={`M198 100 C216 100 216 ${y + 20} 234 ${y + 20}`} />
            <Box x={8} y={y} w={78} h={40} />
            <Label x={47} y={y + 20} size={9.5}>
              {sources[i]}
            </Label>
            <Box x={234} y={y} w={78} h={40} />
            <Label x={273} y={y + 20} size={9.5}>
              {sinks[i]}
            </Label>
          </g>
        );
      })}
      <Box x={122} y={56} w={76} h={88} filled />
      <Label x={160} y={100}>
        Iggy
      </Label>
    </Frame>
  );
}

export function ToolingArt() {
  return (
    <Frame>
      <Box x={12} y={16} w={200} h={96} />
      <Label x={112} y={36}>CLI</Label>
      <Label x={112} y={76} size={14} mono>$ iggy stream list</Label>
      <Box x={228} y={16} w={80} h={96} />
      <Label x={268} y={36}>Web UI</Label>
      {[0, 1, 2].map(i => <Box key={i} x={240} y={54 + i * 16} w={56 - i * 12} h={10} filled opacity={0.65} />)}
      <Box x={12} y={146} w={80} h={36} />
      <Label x={52} y={164}>agent</Label>
      <Wire d="M92 164 H120" arrow />
      <Box x={120} y={146} w={80} h={36} filled opacity={0.45} />
      <Label x={160} y={164}>MCP</Label>
      <Wire d="M200 164 H228" arrow />
      <Box x={228} y={146} w={80} h={36} />
      <Label x={268} y={164}>Iggy</Label>
    </Frame>
  );
}

export function ZeroCopyArt() {
  return (
    <Frame>
      <Label x={160} y={24} size={10}>
        one buffer
      </Label>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Box
          key={i}
          x={24 + i * 34}
          y={40}
          w={30}
          h={36}
          filled
          opacity={0.3 + (i % 4) * 0.2}
        />
      ))}
      <Wire d="M90 140 V84 M230 140 V84" />
      {[40, 180].map((x) => (
        <g key={x}>
          <Box x={x} y={140} w={100} h={36} />
          <Label x={x + 50} y={158} size={10}>
            view
          </Label>
        </g>
      ))}
    </Frame>
  );
}

export function BenchmarkArt() {
  return (
    <Frame>
      <Box x={18} y={22} w={284} h={156} />
      <Label x={160} y={46}>iggy-bench</Label>
      <Wire d="M18 64 H302" />
      <Box x={34} y={80} w={94} h={36} filled opacity={0.45} />
      <Label x={81} y={98}>load test</Label>
      <Wire d="M128 98 H188" arrow accent />
      <Box x={188} y={80} w={94} h={36} />
      <Label x={235} y={98}>Iggy</Label>
      <Label x={160} y={140}>throughput · messages/s</Label>
      <Label x={160} y={160}>latency · ms</Label>
      <Label x={160} y={192}>measure on your hardware</Label>
    </Frame>
  );
}

export function PollingArt() {
  const pointers = [
    { i: 0, name: "first" },
    { i: 4, name: "offset" },
    { i: 7, name: "last" },
  ];
  return (
    <Frame>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Box
          key={i}
          x={14 + i * 37}
          y={50}
          w={31}
          h={44}
          filled
          opacity={0.25 + i * 0.1}
        />
      ))}
      {pointers.map(({ i, name }) => {
        const cx = 29.5 + i * 37;
        return (
          <g key={name}>
            <Wire
              d={`M${cx} 132 V106 M${cx - 6} 112 L${cx} 106 L${cx + 6} 112`}
            />
            <Label x={cx} y={148} size={10}>
              {name}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

export function DeferredPollingArt() {
  return (
    <Frame>
      <circle cx={62} cy={100} r={36} stroke={ACCENT} strokeWidth={2.5} />
      <Wire d="M62 100 V76 M62 100 H80" />
      <Wire d="M106 100 H170" dashed />
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          x={180 + i * 44}
          y={78}
          w={36}
          h={44}
          filled
          opacity={0.3 + i * 0.35}
        />
      ))}
    </Frame>
  );
}

export function RetentionArt() {
  return (
    <Frame>
      {[0, 1].map((i) => (
        <g key={i}>
          <DashedBox x={14 + i * 60} y={62} w={52} h={60} />
          <Wire d={`M${22 + i * 60} 114 L${58 + i * 60} 70`} />
        </g>
      ))}
      {[2, 3, 4].map((i) => (
        <Box
          key={i}
          x={14 + i * 60}
          y={62}
          w={52}
          h={60}
          filled
          opacity={0.2 + i * 0.2}
        />
      ))}
      <Label x={70} y={142} size={10}>
        expired
      </Label>
      <Label x={220} y={142} size={10}>
        kept
      </Label>
    </Frame>
  );
}

export function PartitioningArt() {
  return (
    <Frame>
      {[0, 1, 2].map((i) => {
        const y = 28 + i * 57;
        return (
          <g key={i}>
            <Wire arrow d={`M80 100 C140 100 140 ${y + 15} 192 ${y + 15}`} />
            <Box x={192} y={y} w={114} h={30} filled opacity={0.35 + i * 0.3} />
            <Label x={249} y={y + 15} size={10}>
              partition {i}
            </Label>
          </g>
        );
      })}
      <circle cx={48} cy={100} r={32} stroke={ACCENT} strokeWidth={2.5} />
      <Label x={48} y={100} size={9.5}>
        producer
      </Label>
    </Frame>
  );
}

export function HeadersArt() {
  return (
    <Frame>
      <Box x={70} y={14} w={180} h={172} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={86} y={30 + i * 24} w={50} h={14} filled opacity={0.8} />
          <rect
            x={144}
            y={30 + i * 24}
            width={90 - i * 14}
            height={14}
            rx={7}
            fill="currentColor"
            opacity={0.2}
          />
        </g>
      ))}
      <Wire d="M70 108 H250" />
      <Box x={86} y={122} w={148} h={48} filled opacity={0.3} />
      <Label x={160} y={146} size={10}>
        payload
      </Label>
    </Frame>
  );
}

export function ReplicationArt() {
  return (
    <Frame>
      {["A", "B", "C"].map((name, i) => {
        const x = 14 + i * 102;
        return (
          <g key={name}>
            <Box x={x} y={34} w={88} h={100} />
            <Box x={x + 12} y={64} w={64} h={40} filled />
            <Label x={x + 44} y={84} size={10}>
              P0 copy
            </Label>
            <Label x={x + 44} y={154} size={10}>
              node {name}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

export function DurabilityArt() {
  return (
    <Frame>
      <Box x={100} y={16} w={120} h={36} filled />
      <Label x={160} y={34} size={15}>write</Label>
      {[56, 160, 264].map((x, i) => <g key={x}>
        <Wire d={`M160 52 L${x} 88`} arrow />
        <Box x={x - 40} y={88} w={80} h={36} />
        {i < 2 && <>
          <path d={`M${x - 10} 106 l7 7 l14 -16`} stroke={ACCENT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <Wire d={`M${x} 124 V150 H122 V164`} arrow accent />
        </>}
      </g>)}
      <Box x={44} y={164} w={232} h={30} filled opacity={0.4} />
      <Label x={160} y={179} size={15}>2 of 3 ACKs → quorum</Label>
    </Frame>
  );
}

export function IdempotentArt() {
  return (
    <Frame>
      <Label x={160} y={24} size={15}>producer ID + epoch + sequence</Label>
      <Box x={12} y={54} w={146} h={40} filled opacity={0.45} />
      <Label x={85} y={74} size={14}>original: 7 / 2 / 42</Label>
      <DashedBox x={12} y={130} w={146} h={40} />
      <Label x={85} y={150} size={14}>retry: 7 / 2 / 42</Label>
      <Wire d="M158 74 H188 V112 H210" arrow accent />
      <Wire d="M158 150 H188 V112" dashed />
      <Box x={210} y={90} w={102} h={44} filled opacity={0.45} />
      <Label x={261} y={112} size={15}>one append</Label>
    </Frame>
  );
}

export function FailoverArt() {
  return (
    <Frame>
      <Wire arrow d="M98 92 C150 92 160 52 214 52" dashed />
      <Wire d="M150 64 l12 12 M162 64 l-12 12" />
      <Wire arrow d="M98 108 C150 108 160 148 214 148" accent />
      <Box x={14} y={76} w={84} h={48} />
      <Label x={56} y={100} size={10}>
        client
      </Label>
      <DashedBox x={214} y={24} w={92} h={56} />
      <Label x={260} y={52} size={10}>
        node A
      </Label>
      <Box x={214} y={120} w={92} h={56} filled />
      <Label x={260} y={148} size={10}>
        node B
      </Label>
    </Frame>
  );
}

export function SimulationArt() {
  return (
    <Frame>
      <Wire d="M144 70 L92 128" arrow />
      <Wire d="M176 70 L228 128" dashed arrow />
      <Wire d="M196 92 l12 12 M208 92 l-12 12" />
      <Wire d="M104 150 H216" arrow />
      <Label x={160} y={188}>injected network fault</Label>
      <circle cx={160} cy={48} r={28} fill={ACCENT} />
      <circle
        cx={76}
        cy={150}
        r={28}
        stroke="currentColor"
        strokeOpacity={0.65}
        strokeWidth={1.5}
      />
      <circle
        cx={244}
        cy={150}
        r={28}
        stroke="currentColor"
        strokeOpacity={0.65}
        strokeWidth={1.5}
        strokeDasharray="5 5"
      />
    </Frame>
  );
}

export function IdentityArt() {
  return (
    <Frame>
      <Wire d="M98 100 H112" arrow />
      <Wire d="M208 100 H222" arrow />
      <Box x={8} y={72} w={90} h={56} />
      <Label x={53} y={100} size={10}>
        client
      </Label>
      <Box x={114} y={72} w={92} h={56} filled />
      <Label x={160} y={100}>
        Iggy
      </Label>
      <Box x={224} y={72} w={88} h={56} />
      <Label x={268} y={100} size={9.5}>
        auth service
      </Label>
    </Frame>
  );
}

function Key({ y, accent }: { y: number; accent: boolean }) {
  return (
    <g
      stroke={accent ? ACCENT : "currentColor"}
      strokeOpacity={accent ? 1 : 0.3}
      strokeWidth={6}
      strokeLinecap="round"
    >
      <circle cx={90} cy={y} r={16} />
      <path d={`M106 ${y} H200 M176 ${y} v14 M194 ${y} v10`} />
    </g>
  );
}

export function KeyRotationArt() {
  return (
    <Frame>
      <Key y={62} accent={false} />
      <Key y={138} accent />
      <Wire d="M226 62 C270 62 270 138 226 138 M235 130 L226 138 L235 146" />
    </Frame>
  );
}

export function ClientEncryptionArt() {
  return (
    <Frame>
      <Box x={10} y={24} w={134} h={156} />
      <Label x={77} y={44}>client</Label>
      <Label x={77} y={72}>plaintext</Label>
      <Wire d="M77 84 V100" arrow />
      <Lock cx={77} cy={118} />
      <Label x={77} y={158}>encrypt</Label>
      <Wire d="M144 118 H236" arrow accent />
      <Label x={190} y={96}>ciphertext</Label>
      <Box x={236} y={90} w={74} h={56} filled opacity={0.35} />
      <Label x={273} y={118}>Iggy</Label>
    </Frame>
  );
}

export function ConnectionStringArt() {
  return (
    <Frame>
      <Box x={24} y={58} w={272} h={44} filled opacity={0.2} />
      <text
        x={40}
        y={80}
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={600}
        fontFamily="ui-monospace, monospace"
        textLength={240}
        fill="currentColor"
      >
        iggy+quic://user:pass@host:8080
      </text>
      <Wire d="M40 116 H110 M133 116 H203 M210 116 H280" />
      <Label x={75} y={134} size={10}>
        transport
      </Label>
      <Label x={168} y={134} size={10}>
        credentials
      </Label>
      <Label x={245} y={134} size={10}>
        address
      </Label>
    </Frame>
  );
}

export function MetricsArt() {
  const points = [
    [30, 150],
    [74, 120],
    [118, 132],
    [162, 90],
    [206, 104],
    [250, 60],
    [294, 74],
  ];
  return (
    <Frame>
      <Wire d="M24 60 H300 M24 105 H300 M24 150 H300" dashed />
      <polyline
        points={points.map((point) => point.join(",")).join(" ")}
        stroke={ACCENT}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r={5} fill={ACCENT} />
      ))}
    </Frame>
  );
}

export function BinaryArt() {
  return (
    <Frame>
      <Box x={80} y={46} w={160} h={108} filled />
      <Label x={160} y={100} size={13} mono>
        iggy-server
      </Label>
    </Frame>
  );
}
