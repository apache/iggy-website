(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89626,e=>{"use strict";var t=e.i(18050),n=e.i(22016),i=e.i(71645);let r=[0,.2,.4,.6,.8,1],s=[{label:"Avg",producer:"0.466",consumer:"0.357"},{label:"Median",producer:"0.349",consumer:"0.351"},{label:"P95",producer:"0.886",consumer:"0.446"},{label:"P99",producer:"0.976",consumer:"0.495"},{label:"P99.9",producer:"1.114",consumer:"0.566"}],a=[{value:"2M+",unit:"msg/s",label:"Throughput",detail:"Single node"},{value:"1",unit:"GB/s",label:"Producer throughput",detail:"Persisted writes"},{value:"2",unit:"GB/s",label:"Consumer throughput",detail:"Persistent log reads"},{value:"0.976",unit:"ms",label:"Producer P99",detail:"0.466 ms average"},{value:"0.495",unit:"ms",label:"Consumer P99",detail:"0.357 ms average"}],o=e=>20+(1-Math.min(e,1)/1)*180;function l(e,t,n,i){let r,s=(r=e>>>0,()=>{let e=r=r+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}),a=[];for(let r=0;r<160;r+=1){let l=r/159*800,c=Math.max(0,t+(Math.sin(.18*r+.31*e)*n*.55+Math.sin(.62*r+.11*e)*n*.4)+(s()-.5)*n*.6+(s()>.93?s()*i:0));a.push(`${l.toFixed(1)},${o(c).toFixed(1)}`)}return{line:`M${a.join(" L")}`,area:`M${a.join(" L")} L800,200 L0,200 Z`}}e.s(["BenchmarkSection",0,function(){let e=(0,i.useRef)(null),[c,d]=(0,i.useState)(!1),{producer:f,consumer:u}=(0,i.useMemo)(()=>({producer:l(11,.466,.09,.4),consumer:l(1,.357,.04,.1)}),[]);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return void d(!0);let n=new IntersectionObserver(([e])=>{e.isIntersecting&&(d(!0),n.unobserve(t))},{threshold:.15});return n.observe(t),()=>n.disconnect()},[]),(0,t.jsxs)("div",{ref:e,className:"min-w-0 max-w-full",children:[(0,t.jsx)("style",{children:`
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
      `}),(0,t.jsx)("div",{className:"mb-6 grid min-w-0 grid-cols-2 gap-4 md:grid-cols-5",children:a.map(e=>(0,t.jsxs)("div",{className:"min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-5 sm:px-5",children:[(0,t.jsxs)("div",{className:"mb-1 flex items-baseline gap-1.5",children:[(0,t.jsx)("span",{className:"text-2xl font-extrabold text-white sm:text-3xl",children:e.value}),(0,t.jsx)("span",{className:"text-xs font-medium text-neutral-300 sm:text-sm",children:e.unit})]}),(0,t.jsx)("div",{className:"text-sm text-neutral-300",children:e.label}),(0,t.jsx)("div",{className:"mt-1 text-xs text-neutral-400",children:e.detail})]},e.label))}),(0,t.jsxs)("div",{className:"grid min-w-0 max-w-full gap-4 lg:grid-cols-[minmax(0,1fr)_280px]",children:[(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#060a12]",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 border-b border-white/[0.06] px-5 py-3 sm:flex-row sm:items-center sm:justify-between",children:[(0,t.jsxs)("div",{className:"flex flex-wrap items-center gap-x-5 gap-y-1",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#ff9103]"}),(0,t.jsxs)("span",{className:"text-xs text-neutral-300",children:["Producer"," ",(0,t.jsx)("span",{className:"text-neutral-100",children:"0.466 ms avg"})]})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"h-[3px] w-5 rounded-full bg-[#38bdf8]"}),(0,t.jsxs)("span",{className:"text-xs text-neutral-300",children:["Consumer"," ",(0,t.jsx)("span",{className:"text-neutral-100",children:"0.357 ms avg"})]})]})]}),(0,t.jsx)("span",{className:"font-mono text-xs text-neutral-400",children:"Apache Iggy 0.8.0 · 40M messages"})]}),(0,t.jsxs)("div",{className:"flex",children:[(0,t.jsxs)("div",{className:"flex w-12 shrink-0 flex-col justify-between py-4 pr-2 text-right font-mono text-[10px] text-neutral-400 sm:w-14 sm:text-xs",children:[(0,t.jsx)("div",{className:"text-neutral-300",children:"ms"}),[...r].reverse().map(e=>(0,t.jsx)("div",{className:"leading-none",children:e.toFixed(1)},e))]}),(0,t.jsx)("div",{className:"min-w-0 flex-1 pt-4 pr-3 pb-3",children:(0,t.jsxs)("svg",{viewBox:"0 0 800 200",className:c?"iggy-chart-visible w-full":"w-full",preserveAspectRatio:"none",style:{aspectRatio:"800 / 200"},role:"img","aria-label":"Producer and consumer latency traces for the Apache Iggy 0.8.0 benchmark",children:[(0,t.jsxs)("defs",{children:[(0,t.jsxs)("linearGradient",{id:"iggy-producer-fill",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#ff9103",stopOpacity:"0.2"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#ff9103",stopOpacity:"0"})]}),(0,t.jsxs)("linearGradient",{id:"iggy-consumer-fill",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,t.jsx)("stop",{offset:"0%",stopColor:"#38bdf8",stopOpacity:"0.14"}),(0,t.jsx)("stop",{offset:"100%",stopColor:"#38bdf8",stopOpacity:"0"})]}),(0,t.jsx)("clipPath",{id:"iggy-chart-reveal",children:(0,t.jsx)("rect",{className:"iggy-chart-clip",x:"0",y:"0",height:"200"})})]}),r.map(e=>(0,t.jsx)("line",{x1:"0",y1:o(e),x2:800,y2:o(e),stroke:"white",strokeOpacity:"0.05"},e)),(0,t.jsxs)("g",{clipPath:"url(#iggy-chart-reveal)",children:[(0,t.jsx)("path",{d:f.area,fill:"url(#iggy-producer-fill)"}),(0,t.jsx)("path",{d:f.line,fill:"none",stroke:"#ff9103",strokeWidth:"1.8",strokeLinejoin:"round",strokeLinecap:"round"}),(0,t.jsx)("path",{d:u.area,fill:"url(#iggy-consumer-fill)"}),(0,t.jsx)("path",{d:u.line,fill:"none",stroke:"#38bdf8",strokeWidth:"1.5",strokeLinejoin:"round",strokeLinecap:"round"})]}),(0,t.jsxs)("g",{className:"iggy-chart-reference",children:[(0,t.jsx)("line",{x1:"0",y1:o(.466),x2:800,y2:o(.466),stroke:"#ff9103",strokeOpacity:"0.3",strokeDasharray:"6 6"}),(0,t.jsx)("line",{x1:"0",y1:o(.357),x2:800,y2:o(.357),stroke:"#38bdf8",strokeOpacity:"0.3",strokeDasharray:"6 6"})]})]})})]})]}),(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 sm:p-5",children:[(0,t.jsxs)("div",{className:"mb-4 font-mono text-sm text-neutral-300",children:["Latency breakdown ",(0,t.jsx)("span",{className:"text-neutral-400",children:"(ms)"})]}),(0,t.jsxs)("table",{className:"w-full table-fixed font-mono text-xs sm:text-sm",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"text-neutral-400",children:[(0,t.jsx)("th",{className:"w-[36%] pb-3 text-left font-normal",children:"Percentile"}),(0,t.jsx)("th",{className:"pb-3 text-right font-normal",children:"Producer"}),(0,t.jsx)("th",{className:"pb-3 text-right font-normal",children:"Consumer"})]})}),(0,t.jsx)("tbody",{children:s.map(e=>(0,t.jsxs)("tr",{className:"border-t border-white/[0.06]",children:[(0,t.jsx)("td",{className:"py-2.5 text-neutral-300",children:e.label}),(0,t.jsx)("td",{className:"py-2.5 text-right text-white",children:e.producer}),(0,t.jsx)("td",{className:"py-2.5 text-right text-white",children:e.consumer})]},e.label))})]})]})]}),(0,t.jsxs)("div",{className:"mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-white/[0.08] px-1 py-4",children:[(0,t.jsxs)("span",{className:"min-w-0 break-words font-mono text-sm text-neutral-300",children:[(0,t.jsx)("span",{className:"text-neutral-200",children:"Machine:"})," AWS i4i.4xlarge · persistent log workload"]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-5",children:[(0,t.jsx)(n.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/4bc63b0e-f0fb-44b5-8c42-6159603a5653",target:"_blank",rel:"noopener noreferrer",className:"font-mono text-sm text-[#ff9f22] no-underline hover:underline",children:"Producer result →"}),(0,t.jsx)(n.default,{href:"https://benchmarks.iggy.apache.org/benchmarks/6ed70d0a-de98-42da-84a9-16655152d4e8",target:"_blank",rel:"noopener noreferrer",className:"font-mono text-sm text-[#38bdf8] no-underline hover:underline",children:"Consumer result →"})]})]})]})}])},18870,e=>{"use strict";var t=e.i(18050),n=e.i(71645);let i="identifier keyword string class property entity jsxliterals sign comment break space".split(" "),[r,s,a,o,l,c,d,f,u,m,p]=i.map((e,t)=>t);i.map((e,t)=>[e,t]);let g={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"},h=e=>e.replace(/[&<>"']/g,e=>g[e]);function y(e){let t=Object.entries(e.style||{}).map(([e,t])=>`${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}:${t}`).join(";"),n=Object.entries(e).filter(([e,t])=>/^[\w:-]+$/.test(e)&&"className"!==e&&"style"!==e&&!1!==t&&null!=t).map(([e,t])=>!0===t?e:`${e}="${h(String(t))}"`).join(" ");return`class="${h(e.className||"")}"${t?` style="${h(t)}"`:""}${n?` ${n}`:""}`}let x=new Set("+-*/%=!&|^~?:.,;()[]{}<>#@\\".split("")),w=()=>0,b=e=>"_"===e||"$"===e||/[\p{L}\p{N}]/u.test(e);function v(e,t){if("function"==typeof t?.tokenize)return t.tokenize(e,t);let n=t?.keywords||new Set,i=t?.typeKeywords||new Set,c=t?.onCommentStart||w,d=t?.onCommentEnd||w,g=t?.caseInsensitive?e=>e.toLowerCase():e=>e,h=[],y="";function v(e,t){t&&(h.push([e,t]),e!==p&&e!==m&&(y=t))}for(let h=0;h<e.length;){let w=e[h],k=c(w,e[h+1],h,e);if(k){let t=h++;for(;h<e.length;){if(d(e[h-1],e[h],h,e)==k){h++;break}h++}v(u,e.slice(t,h));continue}let j=t?.onLiteral?.(w,h,e);if(j){v(a,e.slice(h,h+j)),h+=j;continue}if("function"==typeof t?.onQuote&&"'"===w){let n=t.onQuote(w,h,e);if("number"==typeof n&&n>=1){v(r,e.slice(h,h+n)),h+=n;continue}}if('"'===w||"'"===w||t?.templateStrings&&"`"===w){let n=h++;for(;h<e.length;){if(e[h]===w&&"\\"!==e[h-1]){h++;break}h++}let i=e.slice(n,h);v(t?.quotedKeys&&function(e,t){for(;t<e.length&&/\s/.test(e[t]);)t++;return":"===e[t]}(e,h)?l:a,i);continue}if("\n"===w){v(m,w),h++;continue}if(/[^\S\r\n]/.test(w)){let t=h++;for(;h<e.length&&/[^\S\r\n]/.test(e[h]);)h++;v(p,e.slice(t,h));continue}if(b(w)){let t=h++;for(;h<e.length&&b(e[h]);)h++;let a=e.slice(t,h),c=g(a);v(i.has(c)?o:n.has(c)?s:"."===y?l:/^\d/.test(a)||"null"===a||/^\p{Lu}/u.test(a)?o:r,a);continue}if(x.has(w)){v(f,w),h++;continue}v(a,w),h++}return h}let k=(e,t)=>{let n=e+t;return+("//"===n||"/*"===n)},j=(e,t)=>"\n"===t?1:+(e+t==="*/"),S=new Set(["void","char","short","int","long","float","double","signed","unsigned","_Bool","_Complex","_Imaginary"]),N=new Set(["auto","break","case","const","continue","default","do","else","enum","extern","for","goto","if","inline","register","restrict","return","sizeof","static","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local"]);e.s(["keywords",0,N,"typeKeywords",0,S],71022),e.i(71022),e.s(["keywords",0,N,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,S],56022);var C=e.i(56022);let _=new Set(["alignas","alignof","and","and_eq","asm","auto","bitand","bitor","break","case","catch","class","compl","concept","const","consteval","constexpr","constinit","const_cast","continue","co_await","co_return","co_yield","decltype","default","delete","do","dynamic_cast","else","enum","explicit","export","extern","false","for","friend","goto","if","inline","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","private","protected","public","register","reinterpret_cast","requires","return","sizeof","static","static_assert","static_cast","struct","switch","template","this","thread_local","throw","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"]),$=new Set(["bool","char","char8_t","char16_t","char32_t","double","float","int","long","short","signed","unsigned","void","wchar_t"]);e.s(["keywords",0,_,"typeKeywords",0,$],76912),e.i(76912),e.s(["keywords",0,_,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,$],87129);var I=e.i(87129);let L=new Set(["abstract","as","async","await","base","break","case","catch","checked","class","const","continue","default","delegate","do","else","enum","event","explicit","extern","false","finally","fixed","for","foreach","from","get","global","goto","if","implicit","in","init","interface","internal","into","is","join","let","lock","namespace","new","null","on","operator","orderby","out","override","params","partial","private","protected","public","readonly","record","ref","remove","required","return","sealed","select","set","sizeof","stackalloc","static","struct","switch","this","throw","true","try","typeof","unchecked","unsafe","using","value","virtual","volatile","when","where","while","with","yield"]),P=new Set(["bool","byte","char","decimal","double","dynamic","float","int","long","nint","nuint","object","sbyte","short","string","uint","ulong","ushort","void"]);e.s(["keywords",0,L,"typeKeywords",0,P],88098),e.i(88098),e.s(["keywords",0,L,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,P],29557);var A=e.i(29557);let E=new Set(["@media","@import","@keyframes","@font-face","@supports","@page","@counter-style","@font-feature-values","@viewport","@counter-style","@font-feature-values","@document"]),K=e=>e===p||e===m||e===u,M=([e,t])=>e===r||e===o||e===f&&"-"===t,z=(e,t)=>{let n=0,i=0;for(let r=t;r<e.length;r++){let[t,s]=e[r];if(t===f){if("("===s)n++;else if(")"===s)n--;else if("["===s)i++;else if("]"===s)i--;else if(!n&&!i&&"{"===s)return!0;else if(!n&&!i&&(";"===s||"}"===s))break}}return!1};e.s(["keywords",0,E,"onCommentEnd",0,(e,t)=>+("*/"===e+t),"onCommentStart",0,(e,t)=>+("/*"===e+t),"onLiteral",0,(e,t,n)=>"#"!==e?0:n.slice(t).match(/^#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})(?![\w-])/i)?.[0].length||0,"tokenize",0,(e,t)=>{let n=v(e,{...t,tokenize:void 0}),i=0,r=!1;for(let e=0;e<n.length;e++){let[t,s]=n[e];if(t===f&&"{"===s){i++,r=!0;continue}if(t===f&&"}"===s){i--,r=!1;continue}if(t===f&&";"===s){r=i>0;continue}if(!r||K(t))continue;let a=e,o=e;for(;o<n.length&&M(n[o]);)o++;let c=o;for(;c<n.length&&K(n[c][0]);)c++;if(o>a&&n[c]?.[0]===f&&":"===n[c][1]&&!z(n,c+1)){let e=n.slice(a,o).map(([,e])=>e).join("");n.splice(a,o-a,[l,e])}r=!1}return n}],60234);var q=e.i(60234);let T=new Set([]);e.s(["annotateLine",0,e=>{let t="";if(e.value.startsWith("+")&&!e.value.startsWith("+++"))t="diff-add";else if(e.value.startsWith("-")&&!e.value.startsWith("---"))t="diff-remove";else if(e.value.startsWith("@@"))t="diff-hunk";else if(/^(diff --git|index |--- |\+\+\+ )/.test(e.value))for(let n of(t="diff-meta",e.tokens))"property"===n.type&&(n.type="identifier");t&&e.annotations.push(t)},"keywords",0,T],56194);var O=e.i(56194);let B=e=>+("#"===e),W=(e,t)=>+("\n"===t),Z=new Set(["add","arg","cmd","copy","entrypoint","env","expose","from","healthcheck","label","maintainer","onbuild","run","shell","stopsignal","user","volume","workdir"]);e.s(["caseInsensitive",0,!0,"keywords",0,Z],40435),e.i(40435),e.s(["caseInsensitive",0,!0,"keywords",0,Z,"onCommentEnd",0,W,"onCommentStart",0,B],67443);var F=e.i(67443);let G=new Set(["bool","byte","complex64","complex128","error","float32","float64","int","int8","int16","int32","int64","rune","string","uint","uint8","uint16","uint32","uint64","uintptr"]),U=new Set(["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"]);e.s(["keywords",0,U,"typeKeywords",0,G],95322),e.i(95322),e.s(["keywords",0,U,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,G],76370);var R=e.i(76370);let D=new Set(["<",">","{","}","[","]"]),H=new Set(["for","do","while","if","else","return","function","var","let","const","true","false","undefined","this","new","delete","typeof","in","instanceof","void","break","continue","switch","case","default","throw","try","catch","finally","debugger","with","yield","async","await","class","extends","super","import","export","from","static"]),Q=new Set([...H,"type","interface","enum","implements","readonly","abstract","declare","namespace","module","private","protected","public","override","keyof","infer","is","asserts","satisfies","as","unknown","never","any","number","string","boolean","bigint","symbol","object"]),J=new Set(["+","-","*","/","%","=","!","&","|","^","~","!","?",":",".",",",";","'",'"',".","(",")","[","]","#","@","\\",...D]),V={keywords:H,onCommentStart:ea,onCommentEnd:function(e,t){return e+t==="*/"?2:+("\n"===t)},jsx:!0,regex:!0,templateStrings:!0};function Y(e){return/^[^\S\r\n]+$/g.test(e)}function X(e){return J.has(e)}function ee(e){return/^[\w_]+$/.test(e)||en(e)}function et(e){let t=e[0];return ee(t)&&t===t.toUpperCase()||"null"===e}function en(e){return/[^\u0000-\u007f]/.test(e)}function ei(e){return/^[a-zA-Z]$/.test(e)}function er(e){var t;return(ei(t=e[0])||en(t))&&(1===e.length||ee(e.slice(1)))}function es(e){return'"'===e||"'"===e}function ea(e,t){let n=e+t;return"/*"===n?2:+("//"===n)}function eo(e,t){var n;let i,g={...V,...t},h=g.keywords!==V.keywords,y="boolean"==typeof g.typescript?g.typescript:(i=0,/\binterface\s+[A-Za-z_$][\w$]*/.test(e)&&(i+=2),/\btype\s+[A-Za-z_$][\w$]*\s*=/.test(e)&&(i+=2),/\benum\s+[A-Za-z_$][\w$]*/.test(e)&&(i+=2),/\b(?:implements|readonly|declare|namespace|satisfies|infer|keyof|asserts)\b/.test(e)&&(i+=2),/:\s*[A-Za-z_$][\w$]*(?:<[^>\n]+>)?(?:\[\])?(?=\s*[,)=;{])/m.test(e)&&(i+=1),/\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*:\s*/.test(e)&&(i+=1),/\)\s*:\s*[A-Za-z_$][\w$]*(?:<[^>\n]+>)?(?:\[\])?\s*(?:=>|\{)/.test(e)&&(i+=1),i>=2),x=h?g.keywords:y?Q:H,{onCommentStart:w,onCommentEnd:b}=g,v=g.typeKeywords instanceof Set?g.typeKeywords:null,k=!1!==g.jsx,j=!1!==g.regex,S=!1!==g.templateStrings,N=g.caseInsensitive?e=>e.toLowerCase():e=>e,C=e=>S&&"`"===e,_="",$=-1,I=[-1,""],L=[-2,""],P=[],A=!1,E=0,K=!1,M=0,z=()=>A&&!K&&!E,q=()=>!E&&z()&&!K&&M>0,T=null,O=0,B=!1,W=0,Z=0,F=()=>null!==T,G=()=>B,U=()=>Z>W,R=()=>Z>0&&Z===W,eo=()=>F()||U(),el=(e,t)=>{if(t&&(_=t),_){let t=[$="number"==typeof e?e:function(e){let t="\n"===e;if(E&&!z()){if(F())return a;let[,t]=I;if(er(e)&&("<"===t||"</"===t))return c}if(q())return d;if(F()||U())return a;if(v&&v.has(N(e)))return"."===I[1]?r:o;if(x.has(N(e)))return"."===I[1]?r:s;if(t)return m;if(Y(e))return p;if(e.split("").every(X))return f;if(et(e))return E&&!z()?r:o;if(er(e)){let e="."===I[1]&&er(L[1]);if(!eo()&&!e)return r;if(e)return l}return a}(_),_];$!==p&&$!==m&&(L=I,I=t),P.push(t)}_=""};for(let t=0;t<e.length;t++){let i=e[t],s=e[t-1],c=e[t+1],d=s+i,m=i+c;if("function"==typeof g.onQuote&&"'"===i&&!F()&&!q()&&!U()){let n=g.onQuote(i,t,e);if("number"==typeof n&&n>=1&&!Number.isNaN(n)){let i=Math.min(n,e.length-t),s=t+i;el(),_=e.slice(t,s),el(r),t=s-1;continue}}if(es(i)&&!q()&&!U()){el();let n=!1;if("\\"!==s&&(T&&i===T?(T=null,n=!0):T||(T=i,O=P.length)),el(a,i),g.quotedKeys&&n&&function(e,t){let n=t+1;for(;n<e.length&&/\s/.test(e[n]);)n++;return":"===e[n]}(e,t))for(let e=O;e<P.length;e++)P[e][0]=l;continue}if(!U()&&"\\n"!==s&&C(i)){el(),el(a,i),Z++;continue}if(U()){if("\\n"!==s&&C(i)&&Z>0){el(),Z--,el(a,i);continue}if("${"===m){W++,el(a),el(f,m),t++;continue}}if(R()&&"}"===i){el(),W--,el(f,i);continue}if(z()&&"{"===i){el(),el(f,i),K=!0;continue}if(A){if(!E&&"<"===i){el(),"/"===c?(E=2,_=m,t++):(E=1,_=i),el(f);continue}if(E){if(">"===i&&!"/=".includes(s)){el(),1===E?(E=0,M++):(E=0,A=!1),el(f,i);continue}if("/>"===m||"</"===m){"<"!==_&&"/"!==_&&el(),"/>"===m?E=0:M--,M||(A=!1),_=m,t++,el(f);continue}if("<"===i){el(),_=i,el(f);continue}if("-"===i&&_&&!eo()&&!q()){let n=t+1;for(;n<e.length&&/[$\w-]/.test(e[n]);)n++;el(l,_+e.slice(t,n)),t=n-1;continue}if("="===c&&!eo()&&!Y(i)){Y(_)&&el();let e=_+i;if(er(e)){el(l,e);continue}}}}if(k&&!E&&("<"===i&&(ei(c)||en(c))||"</"===m)){let n=t-1;for(;n>=0&&/\s/.test(e[n]);)n--;let s=n>=0?e[n]:"",[a,l]=I,d=!1,u=!1;if(_&&!Y(_)){let e=_;et(e)||"true"===e||"false"===e?d=!0:x.has(e)&&er(e)?u=!0:er(e)&&(d=!0)}let m="<"===i&&/[$\w\]\)]/.test(s)&&(d||!u&&(a===r||a===o||a===f&&(")"===l||"]"===l))),p="<"===i&&function(e,t){if("<"!==e[t])return!1;let n=0,i=!1;for(let r=t;r<e.length;r++){let t=e[r];if("<"===t){n++;continue}if(">"===t){if(0==--n){let t=r+1;for(;t<e.length&&/\s/.test(e[t]);)t++;if(!(i&&"("===e[t]))return!1;let n=e.slice(t,t+320);return/\)\s*(?::[\s\S]{0,120}?)?=>/.test(n)}continue}if(0!==n){if(/[$A-Za-z_]/.test(t)){i=!0;continue}if(!/[\s,\.\=\?\:\|\&\[\]]/.test(t))break}}return!1}(e,t);m||p||(E="/"===c?2:1),!("<"===i&&("/"===c||ei(c)))||m||p||eo()||q()||G()||(A=!0)}let p=es(i)||C(i),h=U(),y=j&&!A&&"/"===(n=m)[0]&&!ea(n[0],n[1]),v=q();if(p||h||es(T))_+=i;else if(y){el();let[n,r]=I;if(y&&-1!==n&&(n!==f||")"===r)&&n!==u){_=i,el();continue}B=!0;let s=t++,o=()=>t>=e.length,l=()=>o()||"\n"===e[t],c=!1,d=!1;for(;!l();t++){let n=e[t],i="\\"===e[t-1];if(i||"["!==n||(d=!0),i||"]"!==n||(d=!1),"/"===n&&!d&&!i){for(c=!0;s!==t&&/^[a-z]$/.test(e[t+1])&&!l();)t++;break}}B=!1,s!==t&&c?(_=e.slice(s,t+1),el(a)):(_=i,el(),t=s)}else if(w(i,c,t,e)){el();let n=t,r=w(i,c,t,e);if(r)for(;t<e.length&&b(e[t-1],e[t],t,e)!=r;t++);_=e.slice(n,t+1),el(u)}else if(" "===i||"\n"===i)if(" "===i&&(Y(_)||!_||v)){let n=t+1;for(;" "===e[n];)n++;_+=e.slice(t,n),t=n-1,"<"===e[n]&&el()}else el(),_=i,el();else K&&"}"===i?(el(),_=i,el(),K=!1):v&&!D.has(i)||U()||(ee(i)===ee(_[_.length-1])||z())&&!J.has(i)?_+=i:("</"===d&&(_=d),el(),"</"!==d&&(_=i),"</"===m||"/>"===m?(_=m,el(),t++):D.has(i)&&el())}return el(),P}let el=new Set([]);e.s(["jsx",0,!0,"keywords",0,el,"onCommentEnd",0,(e,t,n,i)=>2*("-->"===i.slice(n-2,n+1)),"onCommentStart",0,(e,t,n,i)=>2*!!i.startsWith("<!--",n),"regex",0,!1,"templateStrings",0,!1,"tokenize",0,eo],44315);var ec=e.i(44315);let ed=new Set(["directive","enum","extend","fragment","implements","input","interface","mutation","on","query","repeatable","scalar","schema","subscription","type","union"]),ef=new Set(["Boolean","Float","ID","Int","String"]);e.s(["keywords",0,ed,"typeKeywords",0,ef],43720),e.i(43720),e.s(["keywords",0,ed,"onCommentEnd",0,W,"onCommentStart",0,B,"typeKeywords",0,ef],90069);var eu=e.i(90069);let em=new Set(["false","for","if","in","null","true"]);e.s(["keywords",0,em,"onCommentEnd",0,(e,t)=>"\n"===t?1:2*(e+t==="*/"),"onCommentStart",0,(e,t)=>"#"===e||e+t==="//"?1:2*(e+t==="/*")],38307);var ep=e.i(38307);let eg=new Set(["boolean","byte","char","double","float","int","long","short","void"]),eh=new Set(["abstract","assert","break","case","catch","class","const","continue","default","do","else","enum","extends","final","finally","for","goto","if","implements","import","instanceof","interface","native","new","package","private","protected","public","return","static","strictfp","super","switch","synchronized","this","throw","throws","transient","try","volatile","while"]);e.s(["keywords",0,eh,"typeKeywords",0,eg],80126),e.i(80126),e.s(["keywords",0,eh,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,eg],18946);var ey=e.i(18946);let ex=new Set(["true","false","null"]);e.s(["keywords",0,ex,"quotedKeys",0,!0],4803),e.i(4803),e.s(["keywords",0,ex,"onCommentEnd",0,j,"onCommentStart",0,k,"quotedKeys",0,!0],74241);var ew=e.i(74241);e.s(["tokenize",0,eo],71705);var eb=e.i(71705);let ev=new Set(["as","break","by","catch","class","companion","const","constructor","continue","data","do","else","enum","false","finally","for","fun","get","if","import","in","infix","init","interface","internal","is","lateinit","noinline","null","object","open","operator","out","override","package","private","protected","public","reified","return","sealed","set","suspend","tailrec","this","throw","true","try","typealias","val","var","vararg","when","where","while"]),ek=new Set(["Any","Boolean","Byte","Char","Double","Float","Int","Long","Nothing","Short","String","Unit"]);e.s(["keywords",0,ev,"typeKeywords",0,ek],20014),e.i(20014),e.s(["keywords",0,ev,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,ek],52303);var ej=e.i(52303);let eS=new Set([]),eN=e=>{let t="";/^#{1,6}\s/.test(e.value)?t="markdown-heading":/^\s*>/.test(e.value)?t="markdown-quote":/^\s*(?:[-*+] |\d+[.)] )/.test(e.value)?t="markdown-list":/^\s*```/.test(e.value)&&(t="markdown-fence"),t&&e.annotations.push(t)};e.s(["annotateLine",0,eN,"keywords",0,eS],24397),e.i(24397),e.s(["annotateLine",0,eN,"keywords",0,eS,"onCommentEnd",0,()=>0,"onCommentStart",0,()=>0],3387);var eC=e.i(3387);let e_=new Set(["abstract","and","array","as","break","callable","case","catch","class","clone","const","continue","declare","default","do","echo","else","elseif","empty","enddeclare","endfor","endforeach","endif","endswitch","endwhile","enum","eval","exit","extends","false","final","finally","fn","for","foreach","from","function","global","goto","if","implements","include","include_once","instanceof","insteadof","interface","isset","list","match","namespace","new","null","or","print","private","protected","public","readonly","require","require_once","return","static","switch","throw","trait","true","try","unset","use","var","while","xor","yield"]),e$=new Set(["bool","float","int","iterable","mixed","never","object","string","void"]);e.s(["keywords",0,e_,"onCommentEnd",0,(e,t)=>"\n"===t?1:2*(e+t==="*/"),"onCommentStart",0,(e,t)=>"#"===e||e+t==="//"?1:2*(e+t==="/*"),"typeKeywords",0,e$],18531);var eI=e.i(18531);let eL=new Set(["begin","break","catch","class","continue","data","define","do","dynamicparam","else","elseif","end","enum","exit","filter","finally","for","foreach","from","function","if","in","param","process","return","switch","throw","trap","try","until","using","while"]);e.s(["caseInsensitive",0,!0,"keywords",0,eL,"onCommentEnd",0,(e,t)=>"\n"===t?1:2*(e+t==="#>"),"onCommentStart",0,(e,t)=>"#"===e?1:2*(e+t==="<#")],93395);var eP=e.i(93395);let eA=new Set(["and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield"]);e.s(["keywords",0,eA,"onCommentEnd",0,(e,t)=>+("\n"===t),"onCommentStart",0,(e,t)=>+("#"===e)],43985);var eE=e.i(43985);let eK=new Set(["as","break","const","continue","crate","else","enum","extern","false","fn","for","if","impl","in","let","loop","match","mod","move","mut","pub","ref","return","self","Self","static","struct","super","trait","true","type","unsafe","use","where","while","async","await","dyn","abstract","become","box","do","final","macro","override","priv","typeof","unsized","virtual","yield","try"]);e.s(["keywords",0,eK,"onQuote",0,function(e,t,n){if("'"!==e||t+1>=n.length)return 1;let i=n[t+1];if("\\"===i){let e=t+2;for(;e<n.length;){if("\\"===n[e]){e+=2;continue}if("'"===n[e])return e-t+1;e++}return n.length-t}if("_"===i)return 2;if(/[a-zA-Z]/.test(i)){let e=t+2;for(;e<n.length&&/[a-zA-Z0-9_]/.test(n[e]);)e++;return e<n.length&&"'"===n[e]?e-t+1:e-t}return 1}],86904);var eM=e.i(86904);let ez=new Set(["case","coproc","do","done","elif","else","esac","export","fi","for","function","if","in","local","readonly","return","select","then","time","until","while"]);e.s(["keywords",0,ez],84112),e.i(84112),e.s(["keywords",0,ez,"onCommentEnd",0,W,"onCommentStart",0,B],9660);var eq=e.i(9660);let eT=new Set(["add","all","alter","and","as","asc","between","by","case","check","column","constraint","create","cross","database","default","delete","desc","distinct","drop","else","end","exists","foreign","from","full","group","having","in","index","inner","insert","into","is","join","key","left","like","limit","not","null","offset","on","or","order","outer","primary","references","right","select","set","table","then","union","unique","update","values","view","when","where","with"]),eO=new Set(["bigint","binary","bit","blob","boolean","char","date","datetime","decimal","double","float","int","integer","interval","json","numeric","real","smallint","text","time","timestamp","uuid","varchar"]);e.s(["caseInsensitive",0,!0,"keywords",0,eT,"onCommentEnd",0,(e,t)=>"\n"===t?1:2*(e+t==="*/"),"onCommentStart",0,(e,t)=>{let n=e+t;return"--"===n?1:2*("/*"===n)},"typeKeywords",0,eO],66071);var eB=e.i(66071);let eW=new Set(["as","associatedtype","break","case","catch","class","continue","convenience","default","defer","deinit","didSet","do","dynamic","else","enum","extension","fallthrough","false","fileprivate","final","for","func","get","guard","if","import","in","indirect","infix","init","inout","internal","is","lazy","let","mutating","nil","nonmutating","open","operator","override","precedencegroup","private","protocol","public","repeat","required","rethrows","return","self","set","some","static","struct","subscript","super","switch","throw","throws","true","try","typealias","unowned","var","weak","where","while","willSet"]),eZ=new Set(["Any","Bool","Character","Double","Float","Int","Never","String","UInt","Void"]);e.s(["keywords",0,eW,"typeKeywords",0,eZ],9860),e.i(9860),e.s(["keywords",0,eW,"onCommentEnd",0,j,"onCommentStart",0,k,"typeKeywords",0,eZ],94778);var eF=e.i(94778);let eG=new Set(["false","true"]);e.s(["keywords",0,eG,"quotedKeys",0,!0],7061),e.i(7061),e.s(["keywords",0,eG,"onCommentEnd",0,W,"onCommentStart",0,B,"quotedKeys",0,!0],94103);var eU=e.i(94103);e.s(["tokenize",0,(e,t)=>eo(e,{...t,typescript:!0})],55733);var eR=e.i(55733);let eD=new Set(["false","False","FALSE","no","No","NO","null","Null","NULL","off","Off","OFF","on","On","ON","true","True","TRUE","yes","Yes","YES"]);e.s(["keywords",0,eD,"quotedKeys",0,!0],75606),e.i(75606),e.s(["keywords",0,eD,"onCommentEnd",0,W,"onCommentStart",0,B,"quotedKeys",0,!0],31275);var eH=e.i(31275);function eQ(e){return{...e,jsx:!1,regex:!1,templateStrings:!1}}let eJ=[{id:"javascript",extension:"js",aliases:["js","jsx","node"],config:eb},{id:"typescript",extension:"ts",aliases:["ts","tsx"],config:eR},{id:"css",extension:"css",aliases:["scss"],config:eQ(q)},{id:"python",extension:"py",aliases:["py","python3"],config:eQ(eE)},{id:"c",extension:"c",aliases:[],config:eQ(C)},{id:"go",extension:"go",aliases:["golang"],config:eQ(R)},{id:"java",extension:"java",aliases:[],config:eQ(ey)},{id:"rust",extension:"rs",aliases:["rs"],config:eQ(eM)},{id:"json",extension:"json",aliases:["jsonc"],config:eQ(ew)},{id:"diff",extension:"diff",aliases:["patch"],config:eQ(O)},{id:"shell",extension:"sh",aliases:["sh","bash","zsh"],config:eQ(eq)},{id:"cpp",extension:"cpp",aliases:["c++","cc","cxx"],config:eQ(I)},{id:"csharp",extension:"cs",aliases:["c#","cs","dotnet"],config:eQ(A)},{id:"sql",extension:"sql",aliases:[],config:eQ(eB)},{id:"html",extension:"html",aliases:["htm","xml"],config:ec},{id:"yaml",extension:"yaml",aliases:["yml"],config:eQ(eH)},{id:"markdown",extension:"md",aliases:["md","mdx"],config:eQ(eC)},{id:"kotlin",extension:"kt",aliases:["kts"],config:eQ(ej)},{id:"swift",extension:"swift",aliases:[],config:eQ(eF)},{id:"php",extension:"php",aliases:[],config:eQ(eI)},{id:"toml",extension:"toml",aliases:[],config:eQ(eU)},{id:"powershell",extension:"ps1",aliases:["pwsh"],config:eQ(eP)},{id:"dockerfile",extension:"dockerfile",aliases:["docker"],config:eQ(F)},{id:"graphql",extension:"graphql",aliases:["gql"],config:eQ(eu)},{id:"hcl",extension:"hcl",aliases:["terraform","tf"],config:eQ(ep)}],eV=new Map;for(let e of eJ)for(let t of new Set([e.id,e.extension,...e.aliases])){let n=t.trim().toLowerCase().replace(/^\./,""),i=eV.get(n);if(i&&i!==e)throw Error(`Language name "${n}" is shared by "${i.id}" and "${e.id}"`);eV.set(n,e)}let eY={Rust:{install:"cargo add iggy",url:"https://crates.io/crates/iggy",label:"crates.io"},Python:{install:"pip install apache-iggy",url:"https://pypi.org/project/apache-iggy/",label:"PyPI"},Java:{install:"org.apache.iggy:iggy",url:"https://mvnrepository.com/artifact/org.apache.iggy/iggy",label:"Maven Central"},Go:{install:"go get github.com/apache/iggy/foreign/go",url:"https://pkg.go.dev/github.com/apache/iggy/foreign/go",label:"pkg.go.dev"},"Node.js":{install:"npm install apache-iggy",url:"https://www.npmjs.com/package/apache-iggy",label:"npm"},"C#":{install:"dotnet add package Apache.Iggy",url:"https://www.nuget.org/packages/Apache.Iggy/",label:"NuGet"},PHP:{install:"cargo php install --release --yes",url:"https://github.com/apache/iggy/tree/master/foreign/php",label:"GitHub"},"C++":{install:"git clone https://github.com/apache/iggy",url:"https://github.com/apache/iggy/tree/master/foreign/cpp",label:"GitHub"}},eX=[{lang:"Rust",file:"producer.rs",href:"/docs/sdk/rust/high-level-sdk",code:`use iggy::prelude::*;

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
);`},{lang:"C++",file:"producer.cpp",href:"/docs/sdk/cpp/intro",code:`#include "lib.rs.h"

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

iggy::ffi::delete_connection(client);`}];e.s(["LandingCodeTabs",0,function(){let[e,r]=(0,n.useState)(0),[s,a]=(0,n.useState)(!1),o=eX[e],l=eY[o.lang];return(0,t.jsxs)("div",{className:"min-w-0 max-w-full",children:[(0,t.jsxs)("div",{className:"min-w-0 max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c1220]",children:[(0,t.jsx)("div",{className:"flex max-w-full items-center overflow-x-auto border-b border-white/[0.06]",children:eX.map((n,i)=>(0,t.jsx)("button",{onClick:()=>r(i),className:`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${i===e?"text-[#ff9103] border-b-2 border-[#ff9103] bg-white/[0.03]":"text-[#8c959f] hover:text-[#c4c9cf]"}`,children:n.lang},n.lang))}),(0,t.jsxs)("div",{className:"min-w-0 p-5",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#ff5f57]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#febc2e]"}),(0,t.jsx)("div",{className:"w-3 h-3 rounded-full bg-[#28c840]"}),(0,t.jsx)("span",{className:"ml-2 text-xs text-[#8c959f] font-mono",children:o.file})]}),(0,t.jsx)("a",{href:o.href,target:o.href.startsWith("http")?"_blank":void 0,rel:o.href.startsWith("http")?"noopener noreferrer":void 0,className:"text-[10px] text-[#ff9103] no-underline hover:underline",children:"SDK docs →"})]}),(0,t.jsx)("pre",{className:"m-0 min-h-[360px] max-w-full overflow-x-auto whitespace-pre font-mono text-[13px] leading-relaxed",children:(0,t.jsx)("code",{dangerouslySetInnerHTML:{__html:function(e){let{lang:t,cx:n,mark:r,markLine:s}={};return function(e,t){let n,i,r;return(n=t?.cx,i=t?.mark,r=t?.markLine,e.lines.map(e=>{let t={index:e.index,value:e.value,tokens:e.tokens,annotations:e.annotations,className:`sh__line${e.annotations.map(e=>` sh__line--${e}`).join("")}`,style:{},properties:{}};return r?.(t),{type:"element",tagName:"span",children:e.tokens.map(({type:e,value:t})=>{let r=n?.[e],s={type:e,value:t,className:`sh__token--${e}${r?` ${r}`:""}`,style:{color:`var(--sh-${e})`},properties:{}};return i?.(s),{type:"element",tokenType:s.type,tagName:"span",children:[{type:"text",value:s.value}],properties:{...s.properties,className:s.className,style:s.style}}}),properties:{...t.properties,className:t.className,style:t.style}}})).map(e=>{let t=e.children.map(e=>`<${e.tagName} ${y(e.properties)}>${h(e.children[0].value)}</${e.tagName}>`).join("");return`<${e.tagName} ${y(e.properties)}>${t}</${e.tagName}>`}).join("\n")}(function(e,t){let n=function(e,t){let n=[],r=0,s=[],a=!1;function o(e){n.push({index:r++,value:e.map(([,e])=>e).join(""),tokens:e.map(([e,t])=>({type:i[e],value:t})),annotations:[]})}for(let e=0;e<t.length;e++){let n=t[e],[i,r]=n;if(i!==m){if(r.includes("\n")){let e=r.split("\n");for(let t=0;t<e.length;t++)s.push([i,e[t]]),t<e.length-1&&(o(s),s.length=0)}else s.push(n);a=!1}else a?o([]):(o(s),s.length=0),e===t.length-1&&o([]),a=!0}return s.length&&o(s),{value:e,lines:n}}(e,v(e,t));if(t?.annotateLine)for(let e of n.lines)t.annotateLine(e);return n}(e,eJ.find(({id:e})=>e===(t||"javascript"))?.config),{cx:n,mark:r,markLine:s})}(o.code)}})})]})]}),(0,t.jsxs)("div",{className:"mt-3 flex min-w-0 flex-wrap items-center gap-3",children:[(0,t.jsxs)("button",{onClick:()=>{navigator.clipboard.writeText(l.install),a(!0),setTimeout(()=>a(!1),1500)},className:"group flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 transition-colors hover:border-white/[0.15]",children:[(0,t.jsx)("code",{className:"font-mono text-xs text-[#aaafb6]",children:l.install}),(0,t.jsx)("svg",{className:"h-3.5 w-3.5 shrink-0 text-[#8c959f] transition-colors group-hover:text-[#c4c9cf]",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:2,children:s?(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 13l4 4L19 7"}):(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})]}),(0,t.jsxs)("a",{href:l.url,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-[#ff9103]/80 no-underline transition-colors hover:text-[#ff9103]",children:[l.label," →"]})]})]})}],18870)}]);