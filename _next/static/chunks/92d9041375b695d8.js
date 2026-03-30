(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18870,e=>{"use strict";var t=e.i(43476),i=e.i(71645);let r=new Set(["<",">","{","}","[","]"]),s=new Set(["for","do","while","if","else","return","function","var","let","const","true","false","undefined","this","new","delete","typeof","in","instanceof","void","break","continue","switch","case","default","throw","try","catch","finally","debugger","with","yield","async","await","class","extends","super","import","export","from","static"]),n=new Set(["+","-","*","/","%","=","!","&","|","^","~","!","?",":",".",",",";","'",'"',".","(",")","[","]","#","@","\\",...r]),a={keywords:s,onCommentStart:C,onCommentEnd:function(e,t){return e+t==="*/"?2:+("\n"===t)}},l=["identifier","keyword","string","class","property","entity","jsxliterals","sign","comment","break","space"],[o,c,g,d,f,p,u,h,m,x,y]=l.map((e,t)=>t);function L(e){return/^[^\S\r\n]+$/g.test(e)}function b(e){return n.has(e)}function w(e){return/^[\w_]+$/.test(e)||v(e)}function v(e){return/[^\u0000-\u007f]/.test(e)}function j(e){return/^[a-zA-Z]$/.test(e)}function N(e){var t;return(j(t=e[0])||v(t))&&(1===e.length||w(e.slice(1)))}function k(e){return'"'===e||"'"===e}function C(e,t){let i=e+t;return"/*"===i?2:+("//"===i)}l.map((e,t)=>[e,t]);let I={Rust:{install:"cargo add iggy",url:"https://crates.io/crates/iggy",label:"crates.io"},Python:{install:"pip install apache-iggy",url:"https://pypi.org/project/apache-iggy/",label:"PyPI"},Java:{install:"org.apache.iggy:iggy",url:"https://mvnrepository.com/artifact/org.apache.iggy/iggy",label:"Maven Central"},Go:{install:"go get github.com/apache/iggy/foreign/go",url:"https://pkg.go.dev/github.com/apache/iggy/foreign/go",label:"pkg.go.dev"},"Node.js":{install:"npm install apache-iggy",url:"https://www.npmjs.com/package/apache-iggy",label:"npm"},"C#":{install:"dotnet add package Apache.Iggy",url:"https://www.nuget.org/packages/Apache.Iggy/",label:"NuGet"},"C++ (WIP)":{install:"git clone https://github.com/apache/iggy",url:"https://github.com/apache/iggy/tree/master/foreign/cpp",label:"GitHub"}},_=[{lang:"Rust",file:"producer.rs",href:"/docs/sdk/rust/high-level-sdk",code:`use iggy::prelude::*;

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

iggy::ffi::delete_connection(client);`}];function S(){let[e,s]=(0,i.useState)(0),[S,P]=(0,i.useState)(!1),A=_[e],M=I[A.lang];return(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"rounded-2xl border border-white/[0.08] bg-[#0c1220] overflow-hidden",children:[(0,t.jsx)("div",{className:"flex items-center border-b border-white/[0.06] overflow-x-auto",children:_.map((i,r)=>(0,t.jsx)("button",{onClick:()=>s(r),className:`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${r===e?"text-[#ff9103] border-b-2 border-[#ff9103] bg-white/[0.03]":"text-[#636b75] hover:text-[#aaafb6]"}`,children:i.lang},i.lang))}),(0,t.jsxs)("div",{className:"p-5",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#ff5f57]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#febc2e]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#28c840]"}),(0,t.jsx)("span",{className:"ml-2 text-xs text-[#636b75] font-mono",children:A.file})]}),(0,t.jsx)("a",{href:A.href,className:"text-[10px] text-[#ff9103] no-underline hover:underline",children:"SDK docs →"})]}),(0,t.jsx)("pre",{className:"text-[13px] leading-relaxed font-mono overflow-x-auto m-0 whitespace-pre min-h-[360px]",children:(0,t.jsx)("code",{dangerouslySetInnerHTML:{__html:(function(e){let t=[];function i(e){let i=e.map(([e,t])=>{let i=l[e];return{type:"element",tagName:"span",children:[{type:"text",value:t}],properties:{className:`sh__token--${i}`,style:{color:`var(--sh-${i})`}}}});t.push({type:"element",tagName:"span",children:i,properties:{className:"sh__line"}})}let r=[],s=!1;for(let t=0;t<e.length;t++){let n=e[t],[a,l]=n,o=t===e.length-1;if(a!==x){if(l.includes("\n")){let e=l.split("\n");for(let t=0;t<e.length;t++)r.push([a,e[t]]),t<e.length-1&&(i(r),r.length=0)}else r.push(n);s=!1}else s?i([]):(i(r),r.length=0),o&&i([]),s=!0}return r.length&&i(r),t})(function(e,t){let{keywords:i,onCommentStart:s,onCommentEnd:l}={...a,...t},I="",_=-1,S=[-1,""],P=[-2,""],A=[],M=!1,$=0,O=!1,T=0,W=()=>M&&!O&&!$,G=()=>!$&&W()&&!O&&T>0,B=null,R=!1,z=0,E=0,F=()=>R,U=()=>E>z,Z=()=>E>0&&E===z,D=()=>null!==B||U(),H=(e,t)=>{if(t&&(I=t),I){let t=[_=e||function(e){let t="\n"===e;if($&&!W()){if(null!==B)return g;let[,t]=S;if(N(e)&&("<"===t||"</"===t))return p}if(G())return u;if(null!==B||U())return g;{let r;if(i.has(e))return"."===S[1]?o:c;if(t)return x;if(L(e))return y;if(e.split("").every(b))return h;if(w(r=e[0])&&r===r.toUpperCase()||"null"===e)return $&&!W()?o:d;if(N(e)){let e="."===S[1]&&N(P[1]);if(!D()&&!e)return o;if(e)return f}return g}}(I),I];_!==y&&_!==x&&(P=S,S=t),A.push(t)}I=""};for(let t=0;t<e.length;t++){var K,X;let i=e[t],a=e[t-1],o=e[t+1],c=a+i,d=i+o;if(k(i)&&!G()&&!U()){H(),"\\"!==a&&(B&&i===B?B=null:B||(B=i)),H(g,i);continue}if(!U()&&"\\n"!==a&&"`"===i){H(),H(g,i),E++;continue}if(U()){if("\\n"!==a&&"`"===i&&E>0){H(),E--,H(g,i);continue}if("${"===d){z++,H(g),H(h,d),t++;continue}}if(Z()&&"}"===i){H(),z--,H(h,i);continue}if(W()&&"{"===i){H(),H(h,i),O=!0;continue}if(M){if(!$&&"<"===i){H(),"/"===o?($=2,I=d,t++):($=1,I=i),H(h);continue}if($){if(">"===i&&!"/=".includes(a)){H(),1===$?($=0,T++):($=0,M=!1),H(h,i);continue}if("/>"===d||"</"===d){"<"!==I&&"/"!==I&&H(),"/>"===d?$=0:T--,T||(M=!1),I=d,t++,H(h);continue}if("<"===i){H(),I=i,H(h);continue}if("-"===o&&!D()&&!G()&&I){H(f,I+i+o),t++;continue}if("="===o&&!D()&&!L(i)){L(I)&&H();let e=I+i;if(N(e)){H(f,e);continue}}}}!$&&("<"===i&&(j(o)||v(o))||"</"===d)&&($="/"===o?2:1,"<"===i&&("/"===o||j(o))&&!D()&&!G()&&!F()&&(M=!0));let p=k(X=i)||"`"===X,u=U(),x=!M&&"/"===(K=d)[0]&&!C(K[0],K[1]),y=G();if(p||u||k(B))I+=i;else if(x){H();let[r,s]=S;if(x&&-1!==r&&(r!==h||")"===s)&&r!==m){I=i,H();continue}R=!0;let n=t++,a=()=>t>=e.length,l=()=>a()||"\n"===e[t],o=!1;for(;!l();t++)if("/"===e[t]&&"\\"!==e[t-1]){for(o=!0;n!==t&&/^[a-z]$/.test(e[t+1])&&!l();)t++;break}R=!1,n!==t&&o?(I=e.slice(n,t+1),H(g)):(I=i,H(),t=n)}else if(s(i,o)){H();let r=t,n=s(i,o);if(n)for(;t<e.length&&l(e[t-1],e[t])!=n;t++);I=e.slice(r,t+1),H(m)}else" "===i||"\n"===i?" "===i&&(L(I)||!I||y)?(I+=i,"<"===o&&H()):(H(),I=i,H()):O&&"}"===i?(H(),I=i,H(),O=!1):y&&!r.has(i)||U()||(w(i)===w(I[I.length-1])||W())&&!n.has(i)?I+=i:("</"===c&&(I=c),H(),"</"!==c&&(I=i),"</"===d||"/>"===d?(I=d,H(),t++):r.has(i)&&H())}return H(),A}(A.code,void 0)).map(e=>{let{tagName:t}=e,i=e.children.map(e=>{let{tagName:t,children:i,properties:r}=e;return`<${t} ${(e=>{let t=`class="${e.className}"`;if(e.style){let i=Object.entries(e.style).map(([e,t])=>`${e}:${t}`).join(";");t+=` style="${i}"`}return t})(r)}>${i[0].value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}</${t}>`}).join("");return`<${t} class="${e.properties.className}">${i}</${t}>`}).join("\n")}})})]})]}),(0,t.jsxs)("div",{className:"mt-3 flex items-center gap-3",children:[(0,t.jsxs)("button",{onClick:()=>{navigator.clipboard.writeText(M.install),P(!0),setTimeout(()=>P(!1),1500)},className:"group flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 transition-colors hover:border-white/[0.15]",children:[(0,t.jsx)("code",{className:"font-mono text-xs text-[#aaafb6]",children:M.install}),(0,t.jsx)("svg",{className:"h-3.5 w-3.5 shrink-0 text-[#636b75] transition-colors group-hover:text-[#aaafb6]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:S?(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"}):(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})]}),(0,t.jsxs)("a",{href:M.url,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-[#ff9103]/80 no-underline transition-colors hover:text-[#ff9103]",children:[M.label," →"]})]})]})}e.s(["LandingCodeTabs",()=>S],18870)},89626,e=>{"use strict";var t=e.i(43476),i=e.i(71645),r=e.i(22016);let s="M0,128 L8,155 L16,161 L24,130 L32,125 L40,153 L48,165 L56,129 L64,154 L72,150 L80,118 L88,166 L96,131 L104,128 L112,157 L120,130 L128,131 L136,160 L144,132 L152,135 L160,166 L168,134 L176,137 L184,164 L192,122 L200,146 L208,148 L216,131 L224,130 L232,162 L240,126 L248,124 L256,163 L264,129 L272,135 L280,166 L288,131 L296,128 L304,163 L312,162 L320,131 L328,166 L336,133 L344,152 L352,158 L360,131 L368,128 L376,163 L384,120 L392,157 L400,164 L408,132 L416,115 L424,152 L432,125 L440,114 L448,155 L456,124 L464,132 L472,169 L480,163 L488,129 L496,167 L504,147 L512,152 L520,148 L528,141 L536,157 L544,145 L552,162 L560,113 L568,154 L576,143 L584,116 L592,161 L600,140",n="M0,151 L8,154 L16,155 L24,154 L32,156 L40,154 L48,155 L56,152 L64,154 L72,154 L80,152 L88,154 L96,153 L104,154 L112,152 L120,156 L128,153 L136,154 L144,153 L152,156 L160,152 L168,153 L176,153 L184,156 L192,155 L200,154 L208,155 L216,153 L224,154 L232,153 L240,154 L248,152 L256,155 L264,152 L272,152 L280,155 L288,154 L296,155 L304,154 L312,153 L320,155 L328,155 L336,152 L344,152 L352,156 L360,154 L368,157 L376,156 L384,157 L392,156 L400,152 L408,153 L416,155 L424,157 L432,155 L440,157 L448,157 L456,156 L464,155 L472,152 L480,155 L488,154 L496,154 L504,156 L512,156 L520,154 L528,156 L536,156 L544,152 L552,155 L560,156 L568,153 L576,156 L584,153 L592,153 L600,154",a=[0,.5,1,1.5,2,2.5,3];function l(){let e=(0,i.useRef)(null),[l,o]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let t=e.current;if(!t)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void o(!0);let i=new IntersectionObserver(([e])=>{e.isIntersecting&&(o(!0),i.unobserve(t))},{threshold:.15});return i.observe(t),()=>i.disconnect()},[]);let c=200-60*2.05;return(0,t.jsxs)("div",{ref:e,children:[(0,t.jsx)("style",{children:`
        @keyframes iggy-draw { from { stroke-dashoffset: 2400 } to { stroke-dashoffset: 0 } }
        @keyframes iggy-area-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes iggy-label-in { from { opacity: 0; transform: translateX(8px) } to { opacity: 1; transform: translateX(0) } }
        .iggy-line { stroke-dasharray: 2400; stroke-dashoffset: 2400 }
        .iggy-area-wr, .iggy-area-rd { opacity: 0 }
        .iggy-label { opacity: 0 }
        .iggy-go .iggy-line { animation: iggy-draw 2s cubic-bezier(0.4,0,0.2,1) forwards }
        .iggy-go .iggy-line-rd { animation-delay: 0.3s }
        .iggy-go .iggy-area-wr { animation: iggy-area-in 0.8s ease 1s forwards }
        .iggy-go .iggy-area-rd { animation: iggy-area-in 0.8s ease 1.3s forwards }
        .iggy-go .iggy-label { animation: iggy-label-in 0.4s ease 2s forwards }
      `}),(0,t.jsx)("div",{className:"mb-6 grid grid-cols-2 md:grid-cols-5 gap-4",children:[{value:"1M+",unit:"msg/s",label:"Throughput",sub:null},{value:"+1 GB/s",unit:"write",label:"Producer throughput",sub:null},{value:"+3 GB/s",unit:"read",label:"Consumer throughput",sub:null},{value:"1.01",unit:"ms",label:"Avg write latency",sub:null},{value:"2.05",unit:"ms",label:"P99 write latency",sub:null}].map(e=>(0,t.jsxs)("div",{className:"rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-5",children:[(0,t.jsxs)("div",{className:"mb-1 flex items-baseline gap-1.5",children:[(0,t.jsx)("span",{className:"text-3xl font-extrabold text-white",children:e.value}),(0,t.jsx)("span",{className:"text-sm font-medium text-neutral-400",children:e.unit})]}),(0,t.jsx)("div",{className:"text-sm text-neutral-500",children:e.label}),e.sub&&(0,t.jsx)("div",{className:"mt-1 text-xs text-neutral-600",children:e.sub})]},e.label))}),(0,t.jsxs)("div",{className:"rounded-xl border border-white/[0.06] bg-[#060a12] overflow-hidden",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between border-b border-white/[0.04] px-5 py-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-6",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#ff9103]"}),(0,t.jsx)("span",{className:"text-xs text-neutral-400",children:"Write"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#38bdf8]"}),(0,t.jsx)("span",{className:"text-xs text-neutral-400",children:"Read"})]})]}),(0,t.jsx)("span",{className:"text-xs text-neutral-600",children:"Latency (ms) · 40M messages"})]}),(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsx)("div",{className:"flex w-10 shrink-0 flex-col justify-between py-3 pr-1 text-right font-mono text-[9px] text-neutral-600 sm:w-12",children:[...a].reverse().map(e=>(0,t.jsx)("div",{className:"leading-none",children:e.toFixed(1)},e))}),(0,t.jsx)("div",{className:"min-w-0 flex-1 py-3 pr-3",children:(0,t.jsxs)("svg",{viewBox:"0 0 600 200",className:l?"iggy-go":"",preserveAspectRatio:"none",style:{width:"100%",height:"auto",aspectRatio:"600 / 200"},children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"iggy-wr-g",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#ff9103",stopOpacity:"0.15"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#ff9103",stopOpacity:"0"})]}),(0,t.jsxs)("linearGradient",{id:"iggy-rd-g",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#38bdf8",stopOpacity:"0.08"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#38bdf8",stopOpacity:"0"})]})]}),a.map(e=>(0,t.jsx)("line",{x1:"0",y1:200-60*e,x2:"600",y2:200-60*e,stroke:"white",strokeOpacity:"0.03"},e)),(0,t.jsx)("path",{d:s+" L600,200 L0,200 Z",fill:"url(#iggy-wr-g)",className:"iggy-area-wr"}),(0,t.jsx)("path",{d:s,fill:"none",stroke:"#ff9103",strokeWidth:"2",strokeLinejoin:"round",className:"iggy-line"}),(0,t.jsx)("path",{d:n+" L600,200 L0,200 Z",fill:"url(#iggy-rd-g)",className:"iggy-area-rd"}),(0,t.jsx)("path",{d:n,fill:"none",stroke:"#38bdf8",strokeWidth:"1.5",strokeLinejoin:"round",className:"iggy-line iggy-line-rd"}),(0,t.jsxs)("g",{className:"iggy-label",children:[(0,t.jsx)("line",{x1:"0",y1:139.4,x2:"600",y2:139.4,stroke:"#ff9103",strokeOpacity:"0.3",strokeDasharray:"6 6",strokeWidth:"1"}),(0,t.jsx)("rect",{x:"539",y:128.4,width:"58",height:"22",rx:"4",fill:"#060a12"}),(0,t.jsx)("rect",{x:"539",y:128.4,width:"58",height:"22",rx:"4",fill:"#ff9103",fillOpacity:"0.15",stroke:"#ff9103",strokeOpacity:"0.4",strokeWidth:"0.5"}),(0,t.jsx)("text",{x:"568",y:143.4,textAnchor:"middle",fill:"#ff9103",fontSize:"11",fontFamily:"monospace",fontWeight:"bold",children:"AVG"}),(0,t.jsx)("line",{x1:"0",y1:c,x2:"600",y2:c,stroke:"#ff9103",strokeOpacity:"0.2",strokeDasharray:"6 6",strokeWidth:"1"}),(0,t.jsx)("rect",{x:"539",y:c-11,width:"58",height:"22",rx:"4",fill:"#060a12"}),(0,t.jsx)("rect",{x:"539",y:c-11,width:"58",height:"22",rx:"4",fill:"#ff9103",fillOpacity:"0.1",stroke:"#ff9103",strokeOpacity:"0.3",strokeWidth:"0.5"}),(0,t.jsx)("text",{x:"568",y:c+4,textAnchor:"middle",fill:"#ff9103",fontSize:"11",fontFamily:"monospace",fontWeight:"bold",children:"P99"})]})]})})]})]}),(0,t.jsxs)("div",{className:"mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5",children:[(0,t.jsxs)("span",{className:"font-mono text-sm text-neutral-500",children:[(0,t.jsx)("span",{className:"text-neutral-400",children:"Machine:"})," AWS i3en.3xlarge · Intel Xeon 8259CL @ 2.50GHz"]}),(0,t.jsxs)("div",{className:"flex gap-5",children:[(0,t.jsx)(r.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/2c6a0f6a-fb4d-4e84-8ac0-bfca60c75b21",target:"_blank",className:"font-mono text-sm text-[#ff9103] no-underline hover:underline",children:"Producer →"}),(0,t.jsx)(r.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/63607acc-5861-47c7-9673-5c1ce649ed0c",target:"_blank",className:"font-mono text-sm text-[#38bdf8] no-underline hover:underline",children:"Consumer →"})]})]})]})}e.s(["BenchmarkSection",()=>l])}]);