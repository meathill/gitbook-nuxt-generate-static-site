import{_ as r,r as d,o as s,c as i,a as e,b as o,d as c,e as a}from"./app-cbd08a8c.js";const h={},u=a('<h1 id="重构现有项目" tabindex="-1"><a class="header-anchor" href="#重构现有项目" aria-hidden="true">#</a> 重构现有项目</h1><p>理解了 Nuxt.js 的定位，就不难判断，如果我们想集成 Nuxt.js 到现有项目，必须进行一些重构。</p><h2 id="生命周期钩子" tabindex="-1"><a class="header-anchor" href="#生命周期钩子" aria-hidden="true">#</a> 生命周期钩子</h2><p>服务器端渲染没有挂载（<code>amount</code>）DOM 的过程，所以自然也不支持 <code>beforeMount</code> 和 <code>mounted</code> 钩子。如果你跟我一样，习惯把初始化代码写在 <code>beforeMount</code> 里，那么可能有不少地方要修改。所以，以后如果有对时机要求不严的操作，最好放在 <code>created</code> 甚至 <code>beforeCreated</code> 里。</p>',4),l={href:"https://nuxtjs.org/guide/async-data",target:"_blank",rel:"noopener noreferrer"},_=e("code",null,"asyncData",-1),p=a('<p>不过需要注意，正常来说，静态页面里会包含完整的 JS，即包含完整的页面逻辑，所以钩子函数在浏览器里会照常执行。所以要避免同样的代码在 <code>asyncData</code> 和钩子函数里重复运行。</p><h2 id="入口" tabindex="-1"><a class="header-anchor" href="#入口" aria-hidden="true">#</a> 入口</h2><p>一般来说，如果使用 Vue CLI 创建项目，入口文件是 <code>src/main.js</code>，这个文件会 <code>import</code> <code>src/App.vue</code>，并且 <code>mount</code> 到 <code>#app</code> 元素上。</p><p>我们当然可以继续使用这个入口，不过考虑到静态页面的依赖跟 CMS 页面的需求不同，我认为重新定义一个入口比较好。在本项目中，我把两者都需要的依赖放在 <code>src/App.vue</code> 里，比如 Bootstrap 的样式；只有 CMS 需要的依赖放在 <code>src/main.js</code> 里，比如 CMS 路由和 Vuex。然后在 <code>nuxt.config.js</code> 里重新配置路由，以 <code>src/App.vue</code> 作为入口。</p>',4),m=e("h2",{id:"head",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#head","aria-hidden":"true"},"#"),o(),e("code",null,"head")],-1),f=e("code",null,"<title>",-1),x=e("code",null,"<title>",-1),b={href:"https://github.com/nuxt/vue-meta",target:"_blank",rel:"noopener noreferrer"},v=e("p",null,[o("但是在 Nuxt.js 生成的静态页面里，我们需要使用 "),e("code",null,"head"),o(" 属性。它的用法和 "),e("code",null,"vue-meta"),o(" 基本一致，等下我会在具体配置里详细介绍。")],-1);function j(N,k){const t=d("ExternalLinkIcon"),n=d("adsense");return s(),i("div",null,[u,e("p",null,[o("如果页面需要异步加载数据，就需要用 "),e("a",l,[_,o(" 函数"),c(t)]),o("。这个函数的用法和钩子函数类似，它需要返回 Promise 实例，真正的模板渲染会在这个 Promise 完成之后才开始。")]),p,c(n),m,e("p",null,[o("网页的头信息，包括 "),f,o("，关键词（keywords）、描述（description）对 SEO 非常重要。即使不考虑 SEO，只是方便用户使用浏览器前进后退，显示正确的 "),x,o(" 也是应该的。在 Vue 项目中，我们使用 "),e("a",b,[o("vue-meta"),c(t)]),o(" 满足这个需求（vue-meta 也是 Nuxt.js 团队开发的）。")]),v])}const V=r(h,[["render",j],["__file","refactor.html.vue"]]);export{V as default};
