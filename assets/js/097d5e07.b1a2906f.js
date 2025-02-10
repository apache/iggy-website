"use strict";(self.webpackChunkiggy_website=self.webpackChunkiggy_website||[]).push([[1318],{6214:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>r,metadata:()=>n,toc:()=>d});var n=s(6047),i=s(4848),a=s(8453);const r={title:"Updated schemas",slug:"updated-schemas",authors:[{name:"Piotr Gankiewicz",title:"Iggy.rs founder",url:"https://github.com/spetz",image_url:"https://github.com/spetz.png"}],tags:["update","schema"],hide_table_of_contents:!1},o=void 0,c={authorsImageUrls:[void 0]},d=[{value:"Breaking changes",id:"breaking-changes",level:2},{value:"PollMessages",id:"pollmessages",level:2},{value:"GetConsumerOffset",id:"getconsumeroffset",level:2},{value:"Stream, Topic, Partition",id:"stream-topic-partition",level:2}];function h(e){const t={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(t.p,{children:["The latest update introduces the changes to the ",(0,i.jsx)(t.code,{children:"PollMessages"})," and ",(0,i.jsx)(t.code,{children:"GetConsumerOffset"})," commands response schema, as well as the ",(0,i.jsx)(t.code,{children:"Stream"}),", ",(0,i.jsx)(t.code,{children:"Topic"})," and ",(0,i.jsx)(t.code,{children:"Partition"})," structs extended with ",(0,i.jsx)(t.code,{children:"created_at"})," field."]}),"\n",(0,i.jsx)(t.h2,{id:"breaking-changes",children:"Breaking changes"}),"\n",(0,i.jsxs)(t.p,{children:["Breaking changes have been introduced with the commit ",(0,i.jsx)(t.a,{href:"https://github.com/iggy-rs/iggy/commit/670a8baba8617bb7e52bd51d556a621349e2e9f0",children:"#670a8ba"}),". The available ",(0,i.jsx)(t.a,{href:"https://crates.io/crates/iggy",children:"iggy crate"})," supports these changes since version 0.0.60."]}),"\n",(0,i.jsx)(t.h2,{id:"pollmessages",children:"PollMessages"}),"\n",(0,i.jsxs)(t.p,{children:["By default, the ",(0,i.jsx)(t.code,{children:"PollMessages"})," used to return ",(0,i.jsx)(t.code,{children:"Vec<Message>"})," as a response, which has been changed to ",(0,i.jsx)(t.code,{children:"PolledMessages"})," struct, that contains the ",(0,i.jsx)(t.code,{children:"partition_id"}),", ",(0,i.jsx)(t.code,{children:"current_offset"})," and ",(0,i.jsx)(t.code,{children:"messages"})," field. The reason for this change was to provide more information about the current offset, and the partition from which the messages have been fetched - this might be especially useful when using the consumer groups feature, where the partition is calculated on the server-side."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-rust",children:"pub struct PolledMessages {\n    pub partition_id: u32,\n    pub current_offset: u64,\n    pub messages: Vec<Message>,\n}\n"})}),"\n",(0,i.jsx)(t.p,{children:"Serialization:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"Partition ID (4 bytes) + Current offset (8 bytes) + Messages count (4 bytes) + Messages (N bytes)\n"})}),"\n",(0,i.jsx)(t.h2,{id:"getconsumeroffset",children:"GetConsumerOffset"}),"\n",(0,i.jsxs)(t.p,{children:["Previously, the ",(0,i.jsx)(t.code,{children:"GetConsumerOffset"})," command used to return ",(0,i.jsx)(t.code,{children:"u64"})," as a response, which has been changed to ",(0,i.jsx)(t.code,{children:"ConsumerOffsetInfo"})," struct, that contains the ",(0,i.jsx)(t.code,{children:"partition_id"}),", ",(0,i.jsx)(t.code,{children:"current_offset"})," and ",(0,i.jsx)(t.code,{children:"stored_offset"})," field. Similar to the ",(0,i.jsx)(t.code,{children:"PollMessages"})," response update, the additional data might be helpful when using the consumer groups feature."]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-rust",children:"pub struct ConsumerOffsetInfo {\n    pub partition_id: u32,\n    pub current_offset: u64,\n    pub stored_offset: u64,\n}\n"})}),"\n",(0,i.jsx)(t.p,{children:"Serialization:"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{children:"Partition ID (4 bytes) + Current offset (8 bytes) + Stored offset (8 bytes)\n"})}),"\n",(0,i.jsx)(t.h2,{id:"stream-topic-partition",children:"Stream, Topic, Partition"}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"Stream"}),", ",(0,i.jsx)(t.code,{children:"Topic"})," and ",(0,i.jsx)(t.code,{children:"Partition"})," structs (along with the additional ",(0,i.jsx)(t.code,{children:"Details"})," models when fetching the single object, not a list) have been extended with the ",(0,i.jsx)(t.code,{children:"created_at"})," field, which contains the timestamp of the creation time (EPOCH in microseconds)."]}),"\n",(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"created_at"})," field which is ",(0,i.jsx)(t.code,{children:"u64"})," (8 bytes) is always serialized right after the ",(0,i.jsx)(t.code,{children:"id"})," field, and then the remaining fields follow."]})]})}function l(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>o});var n=s(6540);const i={},a=n.createContext(i);function r(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),n.createElement(a.Provider,{value:t},e.children)}},6047:e=>{e.exports=JSON.parse('{"permalink":"/blogs/updated-schemas","source":"@site/blog/2023-08-31-updated-schemas.md","title":"Updated schemas","description":"The latest update introduces the changes to the PollMessages and GetConsumerOffset commands response schema, as well as the Stream, Topic and Partition structs extended with created_at field.","date":"2023-08-31T00:00:00.000Z","tags":[{"inline":true,"label":"update","permalink":"/blogs/tags/update"},{"inline":true,"label":"schema","permalink":"/blogs/tags/schema"}],"readingTime":1.51,"hasTruncateMarker":true,"authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png","socials":{},"key":null,"page":null}],"frontMatter":{"title":"Updated schemas","slug":"updated-schemas","authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png"}],"tags":["update","schema"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Users and permissions","permalink":"/blogs/users-and-permissions"},"nextItem":{"title":"Message expiry","permalink":"/blogs/message-expiry"}}')}}]);