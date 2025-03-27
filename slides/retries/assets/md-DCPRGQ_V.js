import{_ as y}from"./slidev/CodeBlockWrapper.vue_vue_type_script_setup_true_lang-BiEvtvP6.js";import{aK as h,b as g,o as t,w as r,g as i,ah as a,ad as l,f as e,e as c,m as D,v as B,x as u,D as n}from"./modules/vue-CQgeQ0W-.js";import{I as E}from"./slidev/default-CsN6QSls.js";import{u as m,f as C}from"./slidev/context-BY4Txrd-.js";import"./modules/unplugin-icons-BuEIV_o9.js";import"./index-DjcPfP7W.js";import"./modules/shiki-BEsVBpME.js";const I={__name:"slides.md__slidev_9",setup(f){const{$clicksContext:p,$frontmatter:o}=m();return p.setup(),(v,s)=>{const d=y,k=h("mark"),A=h("click");return t(),g(E,B(u(n(C)(n(o),8))),{default:r(()=>[s[5]||(s[5]=i("h1",null,"Coding the retry strategy",-1)),s[6]||(s[6]=i("p",null,[i("small",null,[l("using "),i("a",{href:"https://github.com/cb372/cats-retry",target:"_blank"},"cats-retry")])],-1)),i("ul",null,[i("li",null,[a((t(),e("span",null,s[0]||(s[0]=[l("5ms between retries initially")]))),[[k,{at:1,color:"#234",type:"strike-through"}]])]),i("li",null,[a((t(),e("span",null,s[1]||(s[1]=[l("Fibonacci backoff")]))),[[k,{at:2,color:"#234",type:"strike-through"}]])]),i("li",null,[a((t(),e("span",null,s[2]||(s[2]=[l("each delay capped at 700ms")]))),[[k,{at:3,color:"#234",type:"strike-through"}]])]),i("li",null,[a((t(),e("span",null,s[3]||(s[3]=[l("cumulative delay max 5s")]))),[[k,{at:4,color:"#234",type:"strike-through"}]])])]),a((t(),e("div",null,[c(d,D({at:2},{ranges:["6","5-7","3-8","*"]}),{default:r(()=>s[4]||(s[4]=[i("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[i("code",{class:"language-scala"},[i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#4D9375","--shiki-light":"#1E754F"}},"val"),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}}," retryPolicy"),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},":"),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}}," RetryPolicy"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"["),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"IO"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},", "),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"Throwable"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"] "),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"="),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}}," RetryPolicies"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".limitRetriesByCumulativeDelay(")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"  threshold "),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"="),i("span",{style:{"--shiki-dark":"#4C9A91","--shiki-light":"#2F798A"}}," 5"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".seconds,")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"  policy "),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"="),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}}," RetryPolicies"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".capDelay(")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"    cap "),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"="),i("span",{style:{"--shiki-dark":"#4C9A91","--shiki-light":"#2F798A"}}," 700"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".millis,")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"    RetryPolicies"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".fibonacciBackoff["),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"IO"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"](")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"      baseDelay "),i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"="),i("span",{style:{"--shiki-dark":"#4C9A91","--shiki-light":"#2F798A"}}," 5"),i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},".milliseconds")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"    )")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},"  )")]),l(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#DBD7CAEE","--shiki-light":"#393A34"}},")")])])],-1)])),_:1},16)])),[[A,1]])]),_:1},16)}}};export{I as default};
