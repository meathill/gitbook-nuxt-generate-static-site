import{_ as a,r as s,o as c,c as u,a as e,b as t,d as n,e as d}from"./app-cbd08a8c.js";const l={},i=e("h1",{id:"了解-nuxt-js",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#了解-nuxt-js","aria-hidden":"true"},"#"),t(" 了解 Nuxt.js")],-1),h={href:"https://nuxtjs.org",target:"_blank",rel:"noopener noreferrer"},p=d('<p>言归正传，接下来，我们来了解下 Nuxt.js。</p><h2 id="定位" tabindex="-1"><a class="header-anchor" href="#定位" aria-hidden="true">#</a> 定位</h2><p>相信大家都用 Vue 开发过不止一个项目，各种组件库、工具库也都用过不少。那么 Nuxt.js 在整个 Vue 生态里，大约是个什么定位呢？</p><p>读罢官方文档的介绍，我们明白，Nuxt.js，定位于<strong>在服务器端提供 UI 渲染的通用框架</strong>。它的应用层级高于 Vue，并不打算对 Vue 的功能进行补强，而是利用 Vue 的数据双向绑定，提供更强的 B/S 架构中服务器（Server）一端的开发环境。换句话说，它就是 Node.js 版的 Laravel。而静态页发布，也就是 <code>nuxt generate</code> 功能，只是服务器端渲染衍生出的一个子功能。</p><p>坦率的说，这并不是一个好消息。看过前面产品设计的同学应该明白，我想要的，实际上是<strong>类似 Vue-Router 或者 Webpack 插件一样的东西</strong>，我只要引用它，然后启动一个开关，然后 <code>npm run build</code>，就能<strong>生成我需要到的静态页，还有静态需要的各种静态资源</strong>。</p><p>但是在服务器端实现 Vue 模板渲染太过复杂，为了这样简单的目的，开发 Nuxt.js 这种规模的工具，实在太不划算。所以无论是 Next.js 也好，Nuxt.js 也好，他们的团队都渴望更有挑战性更有成长空间的项目，比如挑战 Laravel。（偷偷说一句，Nuxt.js 的网站上广告真多……）</p><p>作为一般用户，我只能去适应他们。</p><h2 id="结构" tabindex="-1"><a class="header-anchor" href="#结构" aria-hidden="true">#</a> 结构</h2><p>Nuxt.js 里面集成了 Vue 全家桶和 Webpack 全家桶。好消息是这些组件我都常用，应该不会遭遇什么困难。Nuxt.js 团队还提供了脚手架创建工具，方便初始化项目。不过我的项目是现成的，所以作用不大，这个部分跳过不看。</p><p>直接在项目根目录安装 Nuxt.js：<code>npm i nuxt -D</code>，完成之后可以使用 <code>nuxt -h</code> 查看 <code>nuxt</code> 命令的各项参数。<code>nuxt</code> 命令和 <code>vue-cli-service</code> 一样，提供启动开发环境、build 等功能。<code>nuxt</code> 使用 <code>nuxt.config.js</code> 作为配置文件，它的地位和 <code>vue.config.js</code> 一样，包含了 Webpack 的默认配置，和一大堆私有配置。</p><p>所以，使用 Vue CLI 创建项目时，最好选择把所有工具的配置分散在各自的配置文件里，比如 babel 就是 .babelrc，这样复用起来更加方便。</p><p>Nuxt.js 有一套默认目录结构，使用这套目录结构可以最大限度的利用 Nuxt.js 的工作机制，不过对于我们来说，暂时排不上用场，也不需要关注。</p>',12),x=e("h2",{id:"nuxt-generate",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#nuxt-generate","aria-hidden":"true"},"#"),t(),e("code",null,"nuxt generate")],-1),_={href:"https://zh.nuxtjs.org/guide/commands#%E9%9D%99%E6%80%81%E5%BA%94%E7%94%A8%E9%83%A8%E7%BD%B2",target:"_blank",rel:"noopener noreferrer"},g={href:"https://zh.nuxtjs.org/api/configuration-generate",target:"_blank",rel:"noopener noreferrer"},j=e("code",null,"nuxt.config.js",-1),f=e("p",null,"使用这个命令，会在指定的文件夹里生成预渲染文件。它的过程大概是这样：",-1),N=e("ol",null,[e("li",null,"nuxt 启动一个本地服务"),e("li",null,"根据配置中的预渲染路径，生成静态页面"),e("li",null,"把页面保存成 .html 文件，其中引用的静态资源也都保存下来"),e("li",null,"预渲染的页面当中，包含完整的 JS 功能代码")],-1),b=e("p",null,"然后我们就可以把这些静态资源整个部署到服务器上。",-1),m=e("hr",null,null,-1),V=e("p",null,"接下来，我们先来重构下老项目。",-1);function k(v,E){const o=s("ExternalLinkIcon"),r=s("adsense");return c(),u("div",null,[i,e("p",null,[t("Nuxt.js 的官方网站在此："),e("a",h,[t("https://nuxtjs.org"),n(o)]),t("，大家可以先看一下。有中文版。不过需要注意，我看的时候，中文翻译并不全，而且不是一半中文一半英文的那种不全，是少了一大部分内容。后来通过 Google 搜索找到了需要的内容，我才发现中文翻译有缺失，浪费我不少时间。所以我建议，大家尽量看英文，或者，先看一遍英文，再看中文。")]),p,n(r),x,e("p",null,[t("这就是最终我们要使用的命令，其实只能算作 Nuxt.js 的衍生功能。大家可以先看一下它的文档："),e("a",_,[t("静态应用部署"),n(o)]),t("以及"),e("a",g,[t("generate 属性配置"),n(o)]),t("，后者需要写在 "),j,t(" 里。")]),f,N,b,m,V])}const L=a(l,[["render",k],["__file","nuxt.html.vue"]]);export{L as default};
