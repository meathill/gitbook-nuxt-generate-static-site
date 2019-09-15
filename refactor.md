重构现有项目
========

理解了 Nuxt.js 的定位，就不难判断，如果我们想集成 Nuxt.js 到现有项目，必须进行一些重构。

生命周期钩子
--------

服务器端渲染没有挂载（`amount`）DOM 的过程，所以自然也不支持 `beforeMount` 和 `mounted` 钩子。如果你跟我一样，习惯把初始化代码写在 `beforeMount` 里，那么可能有不少地方要修改。所以，以后如果有对时机要求不严的操作，最好放在 `created` 甚至 `beforeCreated` 里。

如果页面需要异步加载数据，就需要用 [`asyncData` 函数](https://nuxtjs.org/guide/async-data)。这个函数的用法和钩子函数类似，它需要返回 Promise 实例，真正的模板渲染会在这个 Promise 完成之后才开始。

不过需要注意，正常来说，静态页面里会包含完整的 JS，即包含完整的页面逻辑，所以钩子函数在浏览器里会照常执行。所以要避免同样的代码在 `asyncData` 和钩子函数里重复运行。

入口
--------

一般来说，如果使用 Vue CLI 创建项目，入口文件是 `src/main.js`，这个文件会 `import` `src/App.vue`，并且 `mount` 到 `#app` 元素上。

我们当然可以继续使用这个入口，不过考虑到静态页面的依赖跟 CMS 页面的需求不同，我认为重新定义一个入口比较好。在本项目中，我把两者都需要的依赖放在 `src/App.vue` 里，比如 Bootstrap 的样式；只有 CMS 需要的依赖放在 `src/main.js` 里，比如 CMS 路由和 Vuex。然后在 `nuxt.config.js` 里重新配置路由，以 `src/App.vue` 作为入口。

`head`
--------

网页的头信息，包括 `<title>`，关键词（keywords）、描述（description）对 SEO 非常重要。即使不考虑 SEO，只是方便用户使用浏览器前进后退，显示正确的 `<title>` 也是应该的。在 Vue 项目中，我们使用 [vue-meta](https://github.com/nuxt/vue-meta) 满足这个需求（vue-meta 也是 Nuxt.js 团队开发的）。

但是在 Nuxt.js 生成的静态页面里，我们需要使用 `head` 属性。它的用法和 `vue-meta` 基本一致，等下我会在具体配置里详细介绍。
