(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18870,e=>{"use strict";var t=e.i(43476),r=e.i(71645);let i=new Set(["<",">","{","}","[","]"]),s=new Set(["for","do","while","if","else","return","function","var","let","const","true","false","undefined","this","new","delete","typeof","in","instanceof","void","break","continue","switch","case","default","throw","try","catch","finally","debugger","with","yield","async","await","class","extends","super","import","export","from","static"]),n=new Set(["+","-","*","/","%","=","!","&","|","^","~","!","?",":",".",",",";","'",'"',".","(",")","[","]","#","@","\\",...i]),a={keywords:s,onCommentStart:I,onCommentEnd:function(e,t){return e+t==="*/"?2:+("\n"===t)}},l=["identifier","keyword","string","class","property","entity","jsxliterals","sign","comment","break","space"],[o,c,d,g,p,u,m,h,f,x,y]=l.map((e,t)=>t);function b(e){return/^[^\S\r\n]+$/g.test(e)}function w(e){return n.has(e)}function v(e){return/^[\w_]+$/.test(e)||j(e)}function j(e){return/[^\u0000-\u007f]/.test(e)}function N(e){return/^[a-zA-Z]$/.test(e)}function k(e){var t;return(N(t=e[0])||j(t))&&(1===e.length||v(e.slice(1)))}function C(e){return'"'===e||"'"===e}function I(e,t){let r=e+t;return"/*"===r?2:+("//"===r)}l.map((e,t)=>[e,t]);let P={Rust:{install:"cargo add iggy",url:"https://crates.io/crates/iggy",label:"crates.io"},Python:{install:"pip install apache-iggy",url:"https://pypi.org/project/apache-iggy/",label:"PyPI"},Java:{install:"org.apache.iggy:iggy",url:"https://mvnrepository.com/artifact/org.apache.iggy/iggy",label:"Maven Central"},Go:{install:"go get github.com/apache/iggy/foreign/go",url:"https://pkg.go.dev/github.com/apache/iggy/foreign/go",label:"pkg.go.dev"},"Node.js":{install:"npm install apache-iggy",url:"https://www.npmjs.com/package/apache-iggy",label:"npm"},"C#":{install:"dotnet add package Apache.Iggy",url:"https://www.nuget.org/packages/Apache.Iggy/",label:"NuGet"},PHP:{install:"cargo php install --release --yes",url:"https://github.com/apache/iggy/tree/master/foreign/php",label:"GitHub"},"C++ (WIP)":{install:"git clone https://github.com/apache/iggy",url:"https://github.com/apache/iggy/tree/master/foreign/cpp",label:"GitHub"}},_=[{lang:"Rust",file:"producer.rs",href:"/docs/sdk/rust/high-level-sdk",code:`use iggy::prelude::*;

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
producer.send(vec![msg]).await?;`},{lang:"Python",file:"producer.py",href:"/docs/sdk/python/intro",code:`from apache_iggy import IggyClient, SendMessage

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
)`},{lang:"Java",file:"Producer.java",href:"/docs/sdk/java/intro",code:`var client = IggyTcpClient.builder()
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

client.close();`},{lang:"Go",file:"producer.go",href:"/docs/sdk/go/intro",code:`cli, _ := client.NewIggyClient(
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
)`},{lang:"Node.js",file:"producer.ts",href:"/docs/sdk/node/intro",code:`import { Client, Partitioning } from 'apache-iggy';

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

await client.destroy();`},{lang:"C#",file:"Producer.cs",href:"/docs/sdk/csharp/intro",code:`var client = IggyClientFactory.CreateClient(
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
);`},{lang:"PHP",file:"producer.php",href:"https://github.com/apache/iggy/tree/master/foreign/php",code:`<?php

$client = new \\Iggy\\Client(
    '127.0.0.1:8090'
);
$client->connect();
$client->loginUser('iggy', 'iggy');

$client->createStream('orders');
$client->createTopic(
    'orders',
    'events',
    3,
    null,
    null,
    null,
    null
);

$client->sendMessages(
    'orders',
    'events',
    0,
    [new \\Iggy\\SendMessage('order-123')]
);`},{lang:"C++ (WIP)",file:"producer.cpp",href:"/docs/sdk/cpp/intro",code:`#include "lib.rs.h"

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

iggy::ffi::delete_connection(client);`}];function M(){let[e,s]=(0,r.useState)(0),[M,$]=(0,r.useState)(!1),S=_[e],L=P[S.lang];return(0,t.jsxs)("div",{className:"min-w-0 max-w-full",children:[(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220]",children:[(0,t.jsx)("div",{className:"flex max-w-full items-center overflow-x-auto border-b border-white/[0.06]",children:_.map((r,i)=>(0,t.jsx)("button",{onClick:()=>s(i),className:`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${i===e?"text-[#ff9103] border-b-2 border-[#ff9103] bg-white/[0.03]":"text-[#8c959f] hover:text-[#c4c9cf]"}`,children:r.lang},r.lang))}),(0,t.jsxs)("div",{className:"min-w-0 p-5",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#ff5f57]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#febc2e]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#28c840]"}),(0,t.jsx)("span",{className:"ml-2 text-xs text-[#8c959f] font-mono",children:S.file})]}),(0,t.jsx)("a",{href:S.href,target:S.href.startsWith("http")?"_blank":void 0,rel:S.href.startsWith("http")?"noopener noreferrer":void 0,className:"text-[10px] text-[#ff9103] no-underline hover:underline",children:"SDK docs →"})]}),(0,t.jsx)("pre",{className:"m-0 min-h-[360px] max-w-full overflow-x-auto whitespace-pre font-mono text-[13px] leading-relaxed",children:(0,t.jsx)("code",{dangerouslySetInnerHTML:{__html:(function(e){let t=[];function r(e){let r=e.map(([e,t])=>{let r=l[e];return{type:"element",tagName:"span",children:[{type:"text",value:t}],properties:{className:`sh__token--${r}`,style:{color:`var(--sh-${r})`}}}});t.push({type:"element",tagName:"span",children:r,properties:{className:"sh__line"}})}let i=[],s=!1;for(let t=0;t<e.length;t++){let n=e[t],[a,l]=n,o=t===e.length-1;if(a!==x){if(l.includes("\n")){let e=l.split("\n");for(let t=0;t<e.length;t++)i.push([a,e[t]]),t<e.length-1&&(r(i),i.length=0)}else i.push(n);s=!1}else s?r([]):(r(i),i.length=0),o&&r([]),s=!0}return i.length&&r(i),t})(function(e,t){let{keywords:r,onCommentStart:s,onCommentEnd:l}={...a,...t},P="",_=-1,M=[-1,""],$=[-2,""],S=[],L=!1,A=0,T=!1,O=0,G=()=>L&&!T&&!A,B=()=>!A&&G()&&!T&&O>0,W=null,R=!1,E=0,U=0,F=()=>R,H=()=>U>E,z=()=>U>0&&U===E,D=()=>null!==W||H(),Z=(e,t)=>{if(t&&(P=t),P){let t=[_=e||function(e){let t="\n"===e;if(A&&!G()){if(null!==W)return d;let[,t]=M;if(k(e)&&("<"===t||"</"===t))return u}if(B())return m;if(null!==W||H())return d;{let i;if(r.has(e))return"."===M[1]?o:c;if(t)return x;if(b(e))return y;if(e.split("").every(w))return h;if(v(i=e[0])&&i===i.toUpperCase()||"null"===e)return A&&!G()?o:g;if(k(e)){let e="."===M[1]&&k($[1]);if(!D()&&!e)return o;if(e)return p}return d}}(P),P];_!==y&&_!==x&&($=M,M=t),S.push(t)}P=""};for(let t=0;t<e.length;t++){var K,J;let r=e[t],a=e[t-1],o=e[t+1],c=a+r,g=r+o;if(C(r)&&!B()&&!H()){Z(),"\\"!==a&&(W&&r===W?W=null:W||(W=r)),Z(d,r);continue}if(!H()&&"\\n"!==a&&"`"===r){Z(),Z(d,r),U++;continue}if(H()){if("\\n"!==a&&"`"===r&&U>0){Z(),U--,Z(d,r);continue}if("${"===g){E++,Z(d),Z(h,g),t++;continue}}if(z()&&"}"===r){Z(),E--,Z(h,r);continue}if(G()&&"{"===r){Z(),Z(h,r),T=!0;continue}if(L){if(!A&&"<"===r){Z(),"/"===o?(A=2,P=g,t++):(A=1,P=r),Z(h);continue}if(A){if(">"===r&&!"/=".includes(a)){Z(),1===A?(A=0,O++):(A=0,L=!1),Z(h,r);continue}if("/>"===g||"</"===g){"<"!==P&&"/"!==P&&Z(),"/>"===g?A=0:O--,O||(L=!1),P=g,t++,Z(h);continue}if("<"===r){Z(),P=r,Z(h);continue}if("-"===o&&!D()&&!B()&&P){Z(p,P+r+o),t++;continue}if("="===o&&!D()&&!b(r)){b(P)&&Z();let e=P+r;if(k(e)){Z(p,e);continue}}}}!A&&("<"===r&&(N(o)||j(o))||"</"===g)&&(A="/"===o?2:1,"<"===r&&("/"===o||N(o))&&!D()&&!B()&&!F()&&(L=!0));let u=C(J=r)||"`"===J,m=H(),x=!L&&"/"===(K=g)[0]&&!I(K[0],K[1]),y=B();if(u||m||C(W))P+=r;else if(x){Z();let[i,s]=M;if(x&&-1!==i&&(i!==h||")"===s)&&i!==f){P=r,Z();continue}R=!0;let n=t++,a=()=>t>=e.length,l=()=>a()||"\n"===e[t],o=!1;for(;!l();t++)if("/"===e[t]&&"\\"!==e[t-1]){for(o=!0;n!==t&&/^[a-z]$/.test(e[t+1])&&!l();)t++;break}R=!1,n!==t&&o?(P=e.slice(n,t+1),Z(d)):(P=r,Z(),t=n)}else if(s(r,o)){Z();let i=t,n=s(r,o);if(n)for(;t<e.length&&l(e[t-1],e[t])!=n;t++);P=e.slice(i,t+1),Z(f)}else" "===r||"\n"===r?" "===r&&(b(P)||!P||y)?(P+=r,"<"===o&&Z()):(Z(),P=r,Z()):T&&"}"===r?(Z(),P=r,Z(),T=!1):y&&!i.has(r)||H()||(v(r)===v(P[P.length-1])||G())&&!n.has(r)?P+=r:("</"===c&&(P=c),Z(),"</"!==c&&(P=r),"</"===g||"/>"===g?(P=g,Z(),t++):i.has(r)&&Z())}return Z(),S}(S.code,void 0)).map(e=>{let{tagName:t}=e,r=e.children.map(e=>{let{tagName:t,children:r,properties:i}=e;return`<${t} ${(e=>{let t=`class="${e.className}"`;if(e.style){let r=Object.entries(e.style).map(([e,t])=>`${e}:${t}`).join(";");t+=` style="${r}"`}return t})(i)}>${r[0].value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}</${t}>`}).join("");return`<${t} class="${e.properties.className}">${r}</${t}>`}).join("\n")}})})]})]}),(0,t.jsxs)("div",{className:"mt-3 flex min-w-0 flex-wrap items-center gap-3",children:[(0,t.jsxs)("button",{onClick:()=>{navigator.clipboard.writeText(L.install),$(!0),setTimeout(()=>$(!1),1500)},className:"group flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 transition-colors hover:border-white/[0.15]",children:[(0,t.jsx)("code",{className:"font-mono text-xs text-[#aaafb6]",children:L.install}),(0,t.jsx)("svg",{className:"h-3.5 w-3.5 shrink-0 text-[#8c959f] transition-colors group-hover:text-[#c4c9cf]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:M?(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"}):(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})]}),(0,t.jsxs)("a",{href:L.url,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-[#ff9103]/80 no-underline transition-colors hover:text-[#ff9103]",children:[L.label," →"]})]})]})}e.s(["LandingCodeTabs",()=>M],18870)},89626,e=>{"use strict";var t=e.i(43476),r=e.i(22016),i=e.i(71645);let s=[0,.2,.4,.6,.8,1],n=[{label:"Avg",producer:"0.466",consumer:"0.357"},{label:"Median",producer:"0.349",consumer:"0.351"},{label:"P95",producer:"0.886",consumer:"0.446"},{label:"P99",producer:"0.976",consumer:"0.495"},{label:"P99.9",producer:"1.114",consumer:"0.566"}],a=[{value:"2M+",unit:"msg/s",label:"Throughput",detail:"Single node"},{value:"1",unit:"GB/s",label:"Producer throughput",detail:"Persisted writes"},{value:"2",unit:"GB/s",label:"Consumer throughput",detail:"Persistent log reads"},{value:"0.976",unit:"ms",label:"Producer P99",detail:"0.466 ms average"},{value:"0.495",unit:"ms",label:"Consumer P99",detail:"0.357 ms average"}],l=e=>20+(1-Math.min(e,1)/1)*180;function o(e,t,r,i){let s,n=(s=e>>>0,()=>{let e=s=s+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}),a=[];for(let s=0;s<160;s+=1){let o=s/159*800,c=Math.max(0,t+(Math.sin(.18*s+.31*e)*r*.55+Math.sin(.62*s+.11*e)*r*.4)+(n()-.5)*r*.6+(n()>.93?n()*i:0));a.push(`${o.toFixed(1)},${l(c).toFixed(1)}`)}return{line:`M${a.join(" L")}`,area:`M${a.join(" L")} L800,200 L0,200 Z`}}function c(){let e=(0,i.useRef)(null),[c,d]=(0,i.useState)(!1),{producer:g,consumer:p}=(0,i.useMemo)(()=>({producer:o(11,.466,.09,.4),consumer:o(1,.357,.04,.1)}),[]);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void d(!0);let r=new IntersectionObserver(([e])=>{e.isIntersecting&&(d(!0),r.unobserve(t))},{threshold:.15});return r.observe(t),()=>r.disconnect()},[]),(0,t.jsxs)("div",{ref:e,className:"min-w-0 max-w-full",children:[(0,t.jsx)("style",{children:`
        @keyframes iggy-chart-reveal {
          from { width: 0; }
          to { width: 800px; }
        }
        @keyframes iggy-reference-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .iggy-chart-clip {
          width: 0;
        }
        .iggy-chart-visible .iggy-chart-clip {
          animation: iggy-chart-reveal 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .iggy-chart-reference {
          opacity: 0;
        }
        .iggy-chart-visible .iggy-chart-reference {
          animation: iggy-reference-in 0.5s ease 2.1s forwards;
        }
      `}),(0,t.jsx)("div",{className:"mb-6 grid min-w-0 grid-cols-2 gap-4 md:grid-cols-5",children:a.map(e=>(0,t.jsxs)("div",{className:"min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-5 sm:px-5",children:[(0,t.jsxs)("div",{className:"mb-1 flex items-baseline gap-1.5",children:[(0,t.jsx)("span",{className:"text-2xl font-extrabold text-white sm:text-3xl",children:e.value}),(0,t.jsx)("span",{className:"text-xs font-medium text-neutral-300 sm:text-sm",children:e.unit})]}),(0,t.jsx)("div",{className:"text-sm text-neutral-300",children:e.label}),(0,t.jsx)("div",{className:"mt-1 text-xs text-neutral-400",children:e.detail})]},e.label))}),(0,t.jsxs)("div",{className:"grid min-w-0 max-w-full gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",children:[(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#060a12]",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 border-b border-white/[0.06] px-5 py-3 sm:flex-row sm:items-center sm:justify-between",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-x-5 gap-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#ff9103]"}),(0,t.jsxs)("span",{className:"text-xs text-neutral-300",children:["Producer"," ",(0,t.jsx)("span",{className:"text-neutral-100",children:"0.466 ms avg"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#38bdf8]"}),(0,t.jsxs)("span",{className:"text-xs text-neutral-300",children:["Consumer"," ",(0,t.jsx)("span",{className:"text-neutral-100",children:"0.357 ms avg"})]})]})]}),(0,t.jsx)("span",{className:"font-mono text-xs text-neutral-400",children:"Apache Iggy 0.8.0 · 40M messages"})]}),(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsxs)("div",{className:"flex w-12 shrink-0 flex-col justify-between py-4 pr-2 text-right font-mono text-[10px] text-neutral-400 sm:w-14 sm:text-xs",children:[(0,t.jsx)("div",{className:"text-neutral-300",children:"ms"}),[...s].reverse().map(e=>(0,t.jsx)("div",{className:"leading-none",children:e.toFixed(1)},e))]}),(0,t.jsx)("div",{className:"min-w-0 flex-1 pt-4 pr-3 pb-3",children:(0,t.jsxs)("svg",{viewBox:"0 0 800 200",className:c?"iggy-chart-visible w-full":"w-full",preserveAspectRatio:"none",style:{aspectRatio:"800 / 200"},role:"img","aria-label":"Producer and consumer latency traces for the Apache Iggy 0.8.0 benchmark",children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"iggy-producer-fill",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#ff9103",stopOpacity:"0.2"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#ff9103",stopOpacity:"0"})]}),(0,t.jsxs)("linearGradient",{id:"iggy-consumer-fill",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#38bdf8",stopOpacity:"0.14"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#38bdf8",stopOpacity:"0"})]}),(0,t.jsx)("clipPath",{id:"iggy-chart-reveal",children:(0,t.jsx)("rect",{className:"iggy-chart-clip",x:"0",y:"0",height:"200"})})]}),s.map(e=>(0,t.jsx)("line",{x1:"0",y1:l(e),x2:800,y2:l(e),stroke:"white",strokeOpacity:"0.05"},e)),(0,t.jsxs)("g",{clipPath:"url(#iggy-chart-reveal)",children:[(0,t.jsx)("path",{d:g.area,fill:"url(#iggy-producer-fill)"}),(0,t.jsx)("path",{d:g.line,fill:"none",stroke:"#ff9103",strokeWidth:"1.8",strokeLinejoin:"round",strokeLinecap:"round"}),(0,t.jsx)("path",{d:p.area,fill:"url(#iggy-consumer-fill)"}),(0,t.jsx)("path",{d:p.line,fill:"none",stroke:"#38bdf8",strokeWidth:"1.5",strokeLinejoin:"round",strokeLinecap:"round"})]}),(0,t.jsxs)("g",{className:"iggy-chart-reference",children:[(0,t.jsx)("line",{x1:"0",y1:l(.466),x2:800,y2:l(.466),stroke:"#ff9103",strokeOpacity:"0.3",strokeDasharray:"6 6"}),(0,t.jsx)("line",{x1:"0",y1:l(.357),x2:800,y2:l(.357),stroke:"#38bdf8",strokeOpacity:"0.3",strokeDasharray:"6 6"})]})]})})]})]}),(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5",children:[(0,t.jsxs)("div",{className:"mb-4 font-mono text-sm text-neutral-300",children:["Latency breakdown ",(0,t.jsx)("span",{className:"text-neutral-400",children:"(ms)"})]}),(0,t.jsxs)("table",{className:"w-full table-fixed font-mono text-xs sm:text-sm",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"text-neutral-400",children:[(0,t.jsx)("th",{className:"w-[36%] pb-3 text-left font-normal",children:"Percentile"}),(0,t.jsx)("th",{className:"pb-3 text-right font-normal",children:"Producer"}),(0,t.jsx)("th",{className:"pb-3 text-right font-normal",children:"Consumer"})]})}),(0,t.jsx)("tbody",{children:n.map(e=>(0,t.jsxs)("tr",{className:"border-t border-white/[0.06]",children:[(0,t.jsx)("td",{className:"py-2.5 text-neutral-300",children:e.label}),(0,t.jsx)("td",{className:"py-2.5 text-right text-white",children:e.producer}),(0,t.jsx)("td",{className:"py-2.5 text-right text-white",children:e.consumer})]},e.label))})]})]})]}),(0,t.jsxs)("div",{className:"mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.08] px-1 py-4",children:[(0,t.jsxs)("span",{className:"min-w-0 break-words font-mono text-sm text-neutral-300",children:[(0,t.jsx)("span",{className:"text-neutral-200",children:"Machine:"})," AWS i4i.4xlarge · persistent log workload"]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-5",children:[(0,t.jsx)(r.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/4bc63b0e-f0fb-44b5-8c42-6159603a5653",target:"_blank",rel:"noopener noreferrer",className:"font-mono text-sm text-[#ff9f22] no-underline hover:underline",children:"Producer result →"}),(0,t.jsx)(r.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/6ed70d0a-de98-42da-84a9-16655152d4e8",target:"_blank",rel:"noopener noreferrer",className:"font-mono text-sm text-[#38bdf8] no-underline hover:underline",children:"Consumer result →"})]})]})]})}e.s(["BenchmarkSection",()=>c])}]);