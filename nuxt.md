了解 Nuxt.js
========

Nuxt.js 的官方网站在此：[https://nuxtjs.org](https://nuxtjs.org)，大家可以先看一下。有中文版。不过需要注意，我看的时候，中文翻译并不全，而且不是一半中文一半英文的那种不全，是少了一大部分内容。后来通过 Google 搜索找到了需要的内容，我才发现中文翻译有缺失，浪费我不少时间。所以我建议，大家尽量看英文，或者，先看一遍英文，再看中文。

言归正传，接下来，我们来了解下 Nuxt.js。

定位
--------

相信大家都用 Vue 开发过不止一个项目，各种组件库、工具库也都用过不少。那么 Nuxt.js 在整个 Vue 生态里，大约是个什么定位呢？

读罢官方文档的介绍，我们明白，Nuxt.js，定位于**在服务器端提供 UI 渲染的通用框架**。它的应用层级高于 Vue，并不打算对 Vue 的功能进行补强，而是利用 Vue 的数据双向绑定，提供更强的 B/S 架构中服务器（Server）一端的开发环境。换句话说，它就是 Node.js 版的 Laravel。而静态页发布，也就是 `nuxt generate` 功能，只是服务器端渲染衍生出的一个子功能。

坦率的说，这并不是一个好消息。看过前面产品设计的同学应该明白，我想要的，实际上是**类似 Vue-Router 或者 Webpack 插件一样的东西**，我只要引用它，然后启动一个开关，然后 `npm run build`，就能**生成我需要到的静态页，还有静态需要的各种静态资源**。

但是在服务器端实现 Vue 模板渲染太过复杂，为了这样简单的目的，开发 Nuxt.js 这种规模的工具，实在太不划算。所以无论是 Next.js 也好，Nuxt.js 也好，他们的团队都渴望更有挑战性更有成长空间的项目，比如挑战 Laravel。（偷偷说一句，Nuxt.js 的网站上广告真多……）

作为一般用户，我只能去适应他们。

结构
--------

Nuxt.js 里面集成了 Vue 全家桶和 Webpack 全家桶。好消息是这些组件我都常用，应该不会遭遇什么困难。Nuxt.js 团队还提供了脚手架创建工具，方便初始化项目。不过我的项目是现成的，所以作用不大，这个部分跳过不看。

直接在项目根目录安装 Nuxt.js：`npm i nuxt -D`，完成之后可以使用 `nuxt -h` 查看 `nuxt` 命令的各项参数。`nuxt` 命令和 `vue-cli-service` 一样，提供启动开发环境、build 等功能。`nuxt` 使用 `nuxt.config.js` 作为配置文件，它的地位和 `vue.config.js` 一样，包含了 Webpack 的默认配置，和一大堆私有配置。

所以，使用 Vue CLI 创建项目时，最好选择把所有工具的配置分散在各自的配置文件里，比如 babel 就是 .babelrc，这样复用起来更加方便。

Nuxt.js 有一套默认目录结构，使用这套目录结构可以最大限度的利用 Nuxt.js 的工作机制，不过对于我们来说，暂时排不上用场，也不需要关注。

`nuxt generate`
--------

这就是最终我们要使用的命令，其实只能算作 Nuxt.js 的衍生功能。大家可以先看一下它的文档：[静态应用部署](https://zh.nuxtjs.org/guide/commands#静态应用部署)以及[generate 属性配置](https://zh.nuxtjs.org/api/configuration-generate)，后者需要写在 `nuxt.config.js` 里。

使用这个命令，会在指定的文件夹里生成预渲染文件。它的过程大概是这样：

1. nuxt 启动一个本地服务
2. 根据配置中的预渲染路径，生成静态页面
3. 把页面保存成 .html 文件，其中引用的静态资源也都保存下来
4. 预渲染的页面当中，包含完整的 JS 功能代码

然后我们就可以把这些静态资源整个部署到服务器上。

--------

接下来，我们先来重构下老项目。