"use strict";(self.webpackChunkiggy_website=self.webpackChunkiggy_website||[]).push([[6056],{9632:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>i,contentTitle:()=>c,default:()=>d,frontMatter:()=>r,metadata:()=>t,toc:()=>l});var t=s(725),a=s(4848),o=s(8453);const r={title:"Personal access tokens",slug:"personal-access-tokens",authors:[{name:"Piotr Gankiewicz",title:"Iggy.rs founder",url:"https://github.com/spetz",image_url:"https://github.com/spetz.png"}],tags:["new-features","personal-access-tokens","pat"],hide_table_of_contents:!1},c=void 0,i={authorsImageUrls:[void 0]},l=[{value:"Breaking changes",id:"breaking-changes",level:2},{value:"Personal access tokens",id:"personal-access-tokens",level:2},{value:"Configuration",id:"configuration",level:2}];function h(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"Since the most recent update, Iggy.rs supports personal access tokens, which can be used to authenticate the clients, instead of the username and password. The tokens can be created and deleted using the available APIs."}),"\n",(0,a.jsx)(n.h2,{id:"breaking-changes",children:"Breaking changes"}),"\n",(0,a.jsxs)(n.p,{children:["No breaking changes have been introduced in neither Iggy server, nor Iggy SDK. The server does support the new ",(0,a.jsx)(n.code,{children:"PAT"})," authentication method since version ",(0,a.jsx)(n.code,{children:"0.0.40"}),", and the SDK since version ",(0,a.jsx)(n.code,{children:"0.0.100"}),". The initial changes are part of the commit ",(0,a.jsx)(n.a,{href:"https://github.com/iggy-rs/iggy/commit/e74c25e058b1f39119ee89b5ada5d93f171cb221",children:"#e74c25e"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"personal-access-tokens",children:"Personal access tokens"}),"\n",(0,a.jsx)(n.p,{children:"PAT is a simple idea, which allows authenticating the clients using a token, instead of the regular credentials (username and password). This approach might feel safer for some users, as the token can be deleted at any time, and it's not tied to the user's password. The tokens can be created, listed and deleted using the available APIs. PAT has an optional expiry, which can be set when creating the token."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-rust",children:"pub struct CreatePersonalAccessToken {\n    pub name: String,\n    pub expiry: Option<u32>,\n}\n\npub struct DeletePersonalAccessToken {\n    pub name: String,\n}\n\npub struct GetPersonalAccessTokens {}\n\npub struct LoginWithPersonalAccessToken {\n    pub token: String,\n}\n"})}),"\n",(0,a.jsxs)(n.p,{children:["Each token must have a unique ",(0,a.jsx)(n.code,{children:"name"}),", which is used to identify the token. The ",(0,a.jsx)(n.code,{children:"expiry"})," field is optional, and if set, it must be the amount of seconds since the token creation on the server side, after which the token will expire. A single user may create the maximum of 100 tokens."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-rust",children:"async fn get_personal_access_tokens(\n    &self,\n    command: &GetPersonalAccessTokens,\n) -> Result<Vec<PersonalAccessTokenInfo>, Error>;\n\nasync fn create_personal_access_token(\n    &self,\n    command: &CreatePersonalAccessToken,\n) -> Result<RawPersonalAccessToken, Error>;\n\nasync fn delete_personal_access_token(\n    &self,\n    command: &DeletePersonalAccessToken,\n) -> Result<(), Error>;\n\nasync fn login_with_personal_access_token(\n    &self,\n    command: &LoginWithPersonalAccessToken,\n) -> Result<IdentityInfo, Error>;\n"})}),"\n",(0,a.jsxs)(n.p,{children:["When creating the token, the server returns the ",(0,a.jsx)(n.code,{children:"RawPersonalAccessToken"})," struct, which contains the string ",(0,a.jsx)(n.code,{children:"token"})," value."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-rust",children:"pub struct RawPersonalAccessToken {\n    pub token: String,\n}\n"})}),"\n",(0,a.jsxs)(n.p,{children:["This is returned ",(0,a.jsx)(n.strong,{children:"only once"}),", as it's a raw, secure token, which should be stored by the client. The server only stores the hashed version of the token, and it's not possible to retrieve the original value. The token can be used to authenticate the client using the ",(0,a.jsx)(n.code,{children:"LoginWithPersonalAccessToken"})," command."]}),"\n",(0,a.jsxs)(n.p,{children:["The following structure is returned when listing the tokens. It contains the ",(0,a.jsx)(n.code,{children:"name"})," and an optional ",(0,a.jsx)(n.code,{children:"expiry"})," fields. Please note that the ",(0,a.jsx)(n.code,{children:"expiry"})," is the actual timestamp (Epoch in microseconds) of when the token will expire, and not the amount of seconds since the token creation (like provided in the ",(0,a.jsx)(n.code,{children:"CreatePersonalAccessToken"})," command)."]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-rust",children:"pub struct PersonalAccessTokenInfo {\n    pub name: String,\n    pub expiry: Option<u64>,\n}\n"})}),"\n",(0,a.jsxs)(n.p,{children:["Login with PAT is very similar to the regular login with user credentials, and it returns the same ",(0,a.jsx)(n.code,{children:"IdentityInfo"})," structure."]}),"\n",(0,a.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,a.jsx)(n.p,{children:"On the server side, you can enable the background task responsible for deleting the expired tokens."}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-toml",children:"[personal_access_token_cleaner]\nenabled = true\ninterval = 60\n"})})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>c});var t=s(6540);const a={},o=t.createContext(a);function r(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),t.createElement(o.Provider,{value:n},e.children)}},725:e=>{e.exports=JSON.parse('{"permalink":"/blogs/personal-access-tokens","source":"@site/blog/2023-10-12-personal-access-tokens.md","title":"Personal access tokens","description":"Since the most recent update, Iggy.rs supports personal access tokens, which can be used to authenticate the clients, instead of the username and password. The tokens can be created and deleted using the available APIs.","date":"2023-10-12T00:00:00.000Z","tags":[{"inline":true,"label":"new-features","permalink":"/blogs/tags/new-features"},{"inline":true,"label":"personal-access-tokens","permalink":"/blogs/tags/personal-access-tokens"},{"inline":true,"label":"pat","permalink":"/blogs/tags/pat"}],"readingTime":2.35,"hasTruncateMarker":true,"authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png","socials":{},"key":null,"page":null}],"frontMatter":{"title":"Personal access tokens","slug":"personal-access-tokens","authors":[{"name":"Piotr Gankiewicz","title":"Iggy.rs founder","url":"https://github.com/spetz","image_url":"https://github.com/spetz.png","imageURL":"https://github.com/spetz.png"}],"tags":["new-features","personal-access-tokens","pat"],"hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Iggy 0.1.0 release","permalink":"/blogs/iggy-0-1-0-release"},"nextItem":{"title":"Consumer identifier","permalink":"/blogs/consumer-identifier"}}')}}]);