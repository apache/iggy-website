"use strict";(self.webpackChunkiggy_website=self.webpackChunkiggy_website||[]).push([[9648],{5744:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>c,frontMatter:()=>s,metadata:()=>r,toc:()=>h});var r=n(3151),i=n(4848),o=n(8453);const s={title:"Iggy.rs - Technology Radar & current goals",authors:[{name:"Piotr Gankiewicz",title:"Iggy.rs founder",url:"https://github.com/spetz",image_url:"https://github.com/spetz.png"}],tags:[],hide_table_of_contents:!1,date:new Date("2024-10-28T00:00:00.000Z")},a=void 0,l={authorsImageUrls:[void 0]},h=[{value:"Technology Radar",id:"technology-radar",level:2},{value:"Current goals",id:"current-goals",level:2},{value:"Replication",id:"replication",level:3},{value:"S3 storage",id:"s3-storage",level:3},{value:"OpenTelemetry",id:"opentelemetry",level:3},{value:"Optimizations",id:"optimizations",level:3},{value:"io_uring",id:"io_uring",level:3}];function d(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h2,{id:"technology-radar",children:"Technology Radar"}),"\n",(0,i.jsxs)(t.p,{children:["Quite recently (a few days ago), ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/iggy",children:"Iggy"})," has been listed on ",(0,i.jsx)(t.a,{href:"https://www.thoughtworks.com/radar/platforms/summary/iggy",children:"Technology Radar"})," by ",(0,i.jsx)(t.a,{href:"https://www.thoughtworks.com/",children:"Thoughtworks"})," - a well-known technology consulting company."]}),"\n",(0,i.jsx)(t.p,{children:"If you're not familiar with the Technology Radar, it's essentially an opinionated set (updated twice a year and subscribed by the thousands of developers worldwide) of the tools, platforms, frameworks, techniques etc. which you may want to try out & explore in your IT projects. Everything is split into the different categories, depending on the maturity or popularity of the particular tool."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"image",src:n(3150).A+"",width:"4096",height:"2290"})}),"\n",(0,i.jsxs)(t.p,{children:["As you can see, we were put right into the ",(0,i.jsx)(t.strong,{children:"assess"})," bucket (next to such renowned solutions such as e.g. ",(0,i.jsx)(t.a,{href:"https://www.foundationdb.org/",children:"FoundationDB"}),") - being the projects which are worth exploring & understanding how they might affect your enterprise. Frankly speaking, we weren't expecting this at all, and ",(0,i.jsx)(t.strong,{children:"from our perspective, it's quite of an accomplishment"}),"."]}),"\n",(0,i.jsx)(t.p,{children:"Besides gaining an additional amount of trust & recognition, it has led us to another conclusion - someone out there we don't know yet about (maybe even one of their customers) is using/experimenting with Iggy :)"}),"\n",(0,i.jsxs)(t.p,{children:["And if you are (or will be) one of such persons, please hop onto our ",(0,i.jsx)(t.a,{href:"https://iggy.rs/discord",children:"Discord"})," and share your invaluable feedback with us!"]}),"\n",(0,i.jsxs)(t.p,{children:["Now, given the recent publication and increased activity within our ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/",children:"OSS community"})," building the core streaming server & SDKs in multiple programming languages, it's worth mentioning what are the current goals for Iggy."]}),"\n",(0,i.jsx)(t.h2,{id:"current-goals",children:"Current goals"}),"\n",(0,i.jsx)(t.h3,{id:"replication",children:"Replication"}),"\n",(0,i.jsx)(t.p,{children:"Without a doubt, being able to run your infrastructure (which processes & stores the data) as a cluster, gives much more confidence and greatly impacts the overall reliability."}),"\n",(0,i.jsxs)(t.p,{children:["We've started ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/iggy-cluster-sandbox",children:"experimenting"})," with the replication over half a year ago already by implementing the basic, Raft based consensus algorithm for the simple message streaming server."]}),"\n",(0,i.jsxs)(t.p,{children:["At the same time, we were researching the other possible solutions, after we've finally decided to move on with ",(0,i.jsx)(t.strong,{children:"Viewstamped Replication"})," (in its ",(0,i.jsx)(t.a,{href:"https://pmg.csail.mit.edu/papers/vr-revisited.pdf",children:"revisited form"}),"), which was successfully used by e.g. ",(0,i.jsx)(t.a,{href:"https://tigerbeetle.com/",children:"TigerBeetle"}),"."]}),"\n",(0,i.jsxs)(t.p,{children:["Long story short - the ",(0,i.jsx)(t.strong,{children:"deterministic leader election"}),", allows us to go for ring topology and chain replication of our data - it's excellent for high throughput, which is very important for us."]}),"\n",(0,i.jsxs)(t.p,{children:["Moreover, ",(0,i.jsx)(t.strong,{children:"VSR can be run completely in memory"}),", providing us an opportunity to work independently both on the consensus and the storage and how to link these two together, to form a bulletproof storage fault model."]}),"\n",(0,i.jsx)(t.p,{children:"Below is our very first draft for the initial implementation of VSR."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"image",src:n(352).A+"",width:"2832",height:"3281"})}),"\n",(0,i.jsx)(t.h3,{id:"s3-storage",children:"S3 storage"}),"\n",(0,i.jsxs)(t.p,{children:["A few months ago, we did ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/iggy/pull/1053",children:"implement"})," an optional archiver for the server state log & streaming data (messages etc.) which supports any S3 compatible storage (just pick up your favorite cloud provider). The configuration is as simple as this example:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-toml",children:'[data_maintenance.archiver]\n# Enables or disables the archiver process.\nenabled = true\n\n# Kind of archiver to use. Available options: "disk", "s3".\nkind = "s3"\n\n[data_maintenance.archiver.disk]\n# Path for storing the archived data on disk.\npath = "local_data/archive"\n\n[data_maintenance.archiver.s3]\n# Access key ID for the S3 bucket.\nkey_id = "123"\n\n# Secret access key for the S3 bucket\nkey_secret = "secret"\n\n# Name of the S3 bucket.\nbucket = "iggy"\n\n# Endpoint of the S3 region.\nendpoint = "http://localhost:9000"\n\n# Region of the S3 bucket.\nregion = "eu-west-1"\n\n# Temporary directory for storing the data before uploading to S3.\ntmp_upload_dir = "local_data/s3_tmp"\n'})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"By making use of S3, you could almost infinitely (and very cheaply) store your data"})," - for the need of additional backups, being compliant with law regulations etc. However, there's one catch - in order to read the data stored with S3, you'd need to download it from the cloud and restart your server. And this is where things will change in the future - we're planning to implement a dedicated S3 storage, for both, writing and reading the data in real-time if needed. You could think of the following analogy to the different kinds of cache storages in your PC."]}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"L1"})," - data available directly from the server RAM (super fast writes/reads)"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"L2"})," - data stored on your servers disks (still very, very fast with NVME SSD gen4 or 5)"]}),"\n",(0,i.jsxs)(t.li,{children:[(0,i.jsx)(t.strong,{children:"L3"})," - S3 storage, still fast for the typical use-cases which do not require a very stable, microsecond level latencies"]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Each of these storage layers could be optionally enabled or disabled"}),". You can already decide if and how much memory to use for caching the messages. With S3 tiered storage in place, you could e.g. treat your server's SSD as a sort of ring buffer for keeping the most recent data (easily millions or billions of messages, depending on their size) and only fetch the ones from S3, when you need something very old."]}),"\n",(0,i.jsxs)(t.p,{children:["Or, you could just ignore your server's RAM & SSD, and do all the writes and reads directly on S3, and still remain blazingly fast (just like ",(0,i.jsx)(t.a,{href:"https://quickwit.io",children:"Quickwit"}),")."]}),"\n",(0,i.jsx)(t.h3,{id:"opentelemetry",children:"OpenTelemetry"}),"\n",(0,i.jsxs)(t.p,{children:["Speaking of the Quickwit, we've also ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/iggy/pull/1294",children:"implemented"})," a support for ",(0,i.jsx)(t.a,{href:"https://opentelemetry.io/",children:"OpenTelemetry"})," logs & traces for the server. Since our SDK already uses the logging & tracing libraries, we thought that adding such a feature on the server, could help you gain even better, real-time observability into what's happening under the hood."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-toml",children:'# OpenTelemetry configuration\n[telemetry]\n# Enables or disables telemetry.\nenabled = false\n# Service name for telemetry.\nservice_name = "iggy"\n\n# OpenTelemetry logs configuration\n[telemetry.logs]\n# Transport for sending logs. Options: "grpc", "http".\ntransport = "grpc"\n# Endpoint for sending logs.\nendpoint = "http://localhost:7281/v1/logs"\n\n# OpenTelemetry traces configuration\n[telemetry.traces]\n# Transport for sending traces. Options: "grpc", "http".\ntransport = "grpc"\n# Endpoint for sending traces.\nendpoint = "http://localhost:7281/v1/traces"\n'})}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"And just like with S3 storage, it's merely a beginning"})," - one of the members on our ",(0,i.jsx)(t.a,{href:"https://iggy.rs/discord",children:"Discord"})," had already thought of extending this implementation by ",(0,i.jsx)(t.strong,{children:"propagating the trace context"})," (via existing message headers metadata) between the clients & server in order to get full understanding of the distributed systems and its dependencies, which could be further visualized by tools like ",(0,i.jsx)(t.a,{href:"https://zipkin.io/",children:"Zipkin"})," or ",(0,i.jsx)(t.a,{href:"https://www.jaegertracing.io/",children:"Jaeger"}),"."]}),"\n",(0,i.jsx)(t.h3,{id:"optimizations",children:"Optimizations"}),"\n",(0,i.jsxs)(t.p,{children:["Improved messages batching, keeping the indexes & time indexes in a single file, making use of ",(0,i.jsx)(t.strong,{children:"mmap"})," or ",(0,i.jsx)(t.strong,{children:"directIO"})," for the data storage processing, ",(0,i.jsx)(t.a,{href:"https://github.com/rkyv/rkyv",children:"rkyv"})," for ",(0,i.jsx)(t.strong,{children:"zero-copy (de)serialization"}),", keeping open the file descriptors and lots of other minor improvements - all these low hanging fruits (or at least some of them), will hopefully build up to making Iggy even more performant & resource effective than it already is."]}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.strong,{children:"To start the Iggy server, you just need to wait for a few milliseconds, and the RAM consumption is within a range ~20 MB, which is already over an order of magnitude lower than when compared to Kafka."})}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{alt:"image",src:n(4069).A+"",width:"2558",height:"1375"})}),"\n",(0,i.jsx)(t.h3,{id:"io_uring",children:"io_uring"}),"\n",(0,i.jsxs)(t.p,{children:["This will certainly require to have its own blog post, as there's so much to talk about. We did experiment with ",(0,i.jsx)(t.a,{href:"https://github.com/bytedance/monoio",children:"Monoio"})," (which, in its basic form without additonal enhancements allowed us to reach ",(0,i.jsx)(t.strong,{children:"over 15 GB/s reads"})," when compared to 10-12 GB/s for Tokio that we currently use), we also might experiment with ",(0,i.jsx)(t.a,{href:"https://github.com/DataDog/glommio",children:"Glommio"}),", yet, most likely, we might ",(0,i.jsx)(t.strong,{children:"build our own io_uring backend"})," to fully utilize all its features."]}),"\n",(0,i.jsxs)(t.p,{children:["Yes, at this point you might call us crazy (",(0,i.jsx)(t.strong,{children:"io_uring"})," won't happen before we release the first version of the VSR clustering anyway), but if you want to tick all the possible boxes, it's hard to find a generic framework that will meet your demands, especially when mixed altogether with VSR clustering, thread-per-core & shared-nothing design (if will turn out to be suitable), zero-copy deserialization libraries and other things we might even not be aware of yet."]}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"To innovate, one must experiment"}),", and although we do all these things in our spare time, it's been an exciting journey so far (and lots of experience gained in the meantime) for all of our team members building something fresh, from the very ground up, and regardless of the final outcome, we already know it was all worth it :)"]})]})}function c(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},4069:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/iggy_docker-37b72ad9d9a244e1464c94f03c162193.png"},3150:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/iggy_technology_radar-291413e3a6d4cb1a5b7832ab5865423e.png"},352:(e,t,n)=>{n.d(t,{A:()=>r});const r=n.p+"assets/images/iggy_vsr-3d747255ce17ecda927ccd4d258f7016.png"},8453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var r=n(6540);const i={},o=r.createContext(i);function s(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(o.Provider,{value:t},e.children)}},3151:e=>{e.exports=JSON.parse('{"permalink":"/blogs/2024/10/28/technology-radar-and-currrent-goals","source":"@site/blog/2024-10-28-technology-radar-and-currrent-goals.md","title":"Iggy.rs - Technology Radar & current goals","description":"Technology Radar","date":"2024-10-28T00:00:00.000Z","tags":[],"readingTime":6.575,"hasTruncateMarker":false,"authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png","socials":{},"key":null,"page":null}],"frontMatter":{"title":"Iggy.rs - Technology Radar & current goals","authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png"}],"tags":[],"hide_table_of_contents":false,"date":"2024-10-28T00:00:00.000Z"},"unlisted":false,"prevItem":{"title":"Iggy joins the Apache Incubator","permalink":"/blogs/2025/02/10/apache-incubator"},"nextItem":{"title":"Iggy.rs \u2014 one year of building the message streaming","permalink":"/blogs/2024/05/29/one-year-of-building-the-message-streaming"}}')}}]);