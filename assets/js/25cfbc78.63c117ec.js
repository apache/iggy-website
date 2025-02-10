"use strict";(self.webpackChunkiggy_website=self.webpackChunkiggy_website||[]).push([[1223],{6397:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>g,frontMatter:()=>s,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"server/server-docker","title":"Docker","description":"You can easily run the Iggy server with Docker - the official images can be found here, simply type docker pull iggyrs/iggy.","source":"@site/docs/server/docker.md","sourceDirName":"server","slug":"/server/docker","permalink":"/docs/server/docker","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"id":"server-docker","slug":"/server/docker","title":"Docker","sidebar_position":3},"sidebar":"tutorialSidebar","previous":{"title":"Configuration","permalink":"/docs/server/configuration"},"next":{"title":"Schema","permalink":"/docs/server/schema"}}');var i=r(4848),o=r(8453);const s={id:"server-docker",slug:"/server/docker",title:"Docker",sidebar_position:3},c=void 0,a={},l=[];function d(e){const n={a:"a",code:"code",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.p,{children:["You can easily run the Iggy server with Docker - the official images can be found ",(0,i.jsx)(n.a,{href:"https://hub.docker.com/r/iggyrs/iggy",children:"here"}),", simply type ",(0,i.jsx)(n.code,{children:"docker pull iggyrs/iggy"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["Below is an example of the ",(0,i.jsx)(n.code,{children:"docker-compose.yml"})," file which additionally overrides the default configuration (described in the section below) with the environment variables. If you prefer using the configuration file, you can mount it as a volume and provide the path to it with the ",(0,i.jsx)(n.code,{children:"IGGY_CONFIG_PATH"})," environment variable."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'iggy:\n  image: iggyrs/iggy:latest\n  container_name: iggy\n  restart: unless-stopped\n  environment:\n    - IGGY_ROOT_USERNAME=iggy\n    - IGGY_ROOT_PASSWORD=Secret123!\n    - IGGY_HTTP_ENABLED=true\n    - IGGY_HTTP_ADDRESS=0.0.0.0:80\n    - IGGY_TCP_ENABLED=true\n    - IGGY_TCP_ADDRESS=0.0.0.0:3000\n    - IGGY_QUIC_ENABLED=false\n    - IGGY_HEARTBEAT_ENABLED=true\n    - IGGY_HEARTBEAT_INTERVAL=5s\n  ports:\n    - "3010:80"\n    - "5100:3000"\n  networks:\n    - iggy\n  volumes:\n    - iggy:/iggy/local_data\n\nnetworks:\n  iggy:\n\nvolumes:\n  iggy:\n'})})]})}function g(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>c});var t=r(6540);const i={},o=t.createContext(i);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);