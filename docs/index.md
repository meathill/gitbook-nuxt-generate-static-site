使用 Nuxt.js 发布纯静态网站
========

前言
========

如果开发需要复杂交互的 Web 应用，我们多半会选择 SPA；如果要做提供内容资讯的网站，更有利于 SEO、加载速度更快的服务器端渲染（Server-Side Rendering，SSR）自然是大家的首选；那么，如果是一个 CMS 生成纯静态网页呢？

前阵子公司官网升级，我尝试用 Webpack 多页配置，成功的升级了工具链，收获了比较理想的效果。我还写了一篇 Chat 分享这期间的收获：[《升级工具链吧！使用 Webpack 开发企业官网》](https://gitbook.cn/new/gitchat/activity/5cf7ee6b7388a119e2a74d02)。实际运行一阵子之后，我发现一些新问题：这套技术链对于非前端开发者来说，还真算不上简单，开发环境搭建、不同文件的功用，对后端同事来说仍然显得很复杂。于是，有时候虽然只是小小的文案错误，也要找我来改；或者“加入我们”页面里的岗位信息，也需要熟悉代码的前端负责增删。

于是我就想，能否把各页面以 Vue 组件的形式搭建起来，每个组件可以有“编辑/显示”两个状态，在本地启动开发环境，在浏览器里“编辑”内容，用户可以获得所见即所得的体验。最后以“显示”状态预渲染成静态页，继续使用纯静态的方式部署。这就相当于，基于原先的项目开发一个所见即所得 CMS，把原先的静态 HTML（或 Pug）页面改造成 Vue 页面，然后利用 Vue 的 SSR 机制发布成纯静态 HTML。我以前只是听说过 SSR，一直没有实操经验，有了这个想法之后，就想研究下这个过程，搞个最小用例，将来官网升级 3.0 的时候可以考虑。我本以为只是举手之劳，最多 1，2 个小时就搞定了，没想到最后折腾了大半天。所以我觉得，很有必要再写一篇 Chat，分享这个过程中的收获。

本次分享大纲如下：

1. 网页形态的历史
2. Vue CMS 的产品形态
3. 了解 Nuxt.js
4. 生成静态页的相关配置
5. 添加 SEO 关键信息
6. 注入专有 JS

面向读者
--------

1. 初中级开发者，熟悉 Vue
2. 希望了解前端工具链
3. 希望了解静态化和 Nuxt.js

名词及约定
--------

我假定所有读者都是有一定经验的开发者，大家至少都具备：

1. 能读懂 JavaScript
2. 了解 Vue，使用过 Vue 开发项目
3. 知道 Webpack，了解前端工具链中各工具的角色和基础用法

其它约定：

1. 为节省时间，范例代码中的 HTML 会以 pug 书写，这种语言很容易阅读，文中也用不到高级语法，应该问题不大。另外，如果你还在写原生 HTML 或 CSS，我建议你尽快切换到新语言。
2. 范例代码以 ES6+ 为基础，如果你对这些“新”语法不熟悉，附录里有一些资源方便你学习。

名词：

1. SEO：搜索引擎优化。指改进网页，让搜索引擎更容易理解它的内容，提高页面的排名。
2. CMS：发布系统，没有特指的话，多数是前言中的这种发布静态页的系统

文中代码的目标环境：

1. Vue >= 2.6
2. Vue-router >= 3.1
5. Nuxt.js >= 2.8

作者介绍
-------

大家好，我叫翟路佳，花名“肉山”，这个名字跟 Dota 没关系，从高中起伴随我到现在。

我热爱编程，喜欢学习，喜欢分享，从业十余年，投入的比较多，学习积累到的也比较多，对前端方方面面都有所了解，希望能与大家分享。

我兴趣爱好比较广泛，尤其喜欢旅游，欢迎大家相互交流。

我目前就职于 OpenResty Inc.，定居广州。

你可以在这里找到我：

* [博客](https://blog.meathill.com)
* [微博](https://weibo.com/meathill)
* [GitChat](https://gitbook.cn/gitchat/author/593cb520ef8d9c2863173543)

或者通过 [邮件](mailto:meathill@gmail.com) 联系我。

--------

限于个人能力、知识视野、文字技术不足，文中难免有疏漏差错，如果你有任何疑问，欢迎在任何时间通过任何形式向我提出，我一定尽快答复修改。

[GitHub issue](https://github.com/meathill/gitbook-nuxt-generate-static-site/issues)。

再次感谢大家。

--------

网页形态的发展
========

在正式开始之前，还是先介绍一下网页形态发展的历史，方便大家理解。

远古时期：纯静态
--------

发明 HTML 的目的是方便大家看论文文献，所以早期的 HTML 都是静态的，放在服务器上，直接映射本地文件目录结构。

当然那个时候也没多少网页，很多服务并没有网页版本，比如论坛，是以 Telnet 形式提供服务的；文件共享，大多使用 FTP。

古典时期：动态网站
--------

所谓“动态网站”，就是根据用户请求，返回合适的内容。或者换用技术的说法，接受请求之后，从数据库中读取数据，生成页面，返回给用户。其实现在没什么网站不是动态网站了，感觉这个词挺土的，比如去京东上搜“动态网站”，能搜到一大堆书，大多有着深刻的时代印记，比如《ASP+Dreamweaver动态网站开发》，简直辣眼睛。

文艺复兴：伪静态
--------

相比于纯静态网站而言，动态网站通常需要更长的响应时间，而且 URL 也经常难以阅读。比如：`/post?id=157`，没人知道它是什么意思。这个时期的搜索引擎也比较弱，面对类似的网页，会降低权重。所以网站运营方要想办法改进 SEO，就用服务器 rewrite 的方式，把形似静态页的路径指向动态路径，提升搜索排名。

伪静态常常和真静态共同工作，这个阶段 CDN 还不够普及，所以生成静态页面并部署到终端服务器的操作也很常见。

近代：SPA
--------

随着各项技术的发展，浏览器在整个互联网产品中的地位越来越重要，承担的职责也越来越多，最终单页应用（Single Page Application，简称 SPA）从竞争中脱颖而出，成为最流行的产品形态。关于它的好处我就不一一叙说了，相信大家都了解。

而接下来，MVVM 框架横空出世，一统江湖，更是大大提升了 SPA 的开发体验和入门门槛。然后，类似的产品如雨后春笋搬涌现。

现代：SPA + SSR
--------

SEO 的问题在 SPA 这里更明显：对于一些不思进取的搜索引擎爬虫来说，SPA 应用里什么内容都没有。而不思进取，是很多统治级公司、统治级产品的常态。所以没办法，它们不适配我们，我们就得去适配它们。然后，服务器端渲染（Server-Side Rendering，简称 SSR）就显得非常必要。

SPA 的 SSR 和以前的伪静态不同。伪静态时期，业务逻辑都是通过后端完成的，前端主要用来收集数据；SPA 时期，大部分业务逻辑已经移到前端，后端只负责数据校验和必要的存储。此时 SSR 的目的是让用户尽快看到第一波需要的数据，接下来的操作仍然由 SPA 负责。所以我们就面临两种选择：

1. 前后端共用一套模板，渲染后的页面拥有全部功能，可以继续与用户交互
2. 部分页面生成纯静态内容，可以部署在服务器上；其它重交互的部分保持 SPA，独立工作

现代分支：在本地写作的纯静态网站
--------

随着云服务发展，现在很多网站都提供基础的静态网站托管服务，比如 GitHub Pages，我们可以使用一些工具在本地完成静态页面的批量创建工作，然后上传到服务器，拥有自己的网站。

本文的工作实际应该算到这个分支。

--------

Vue CMS 的产品形态
========

回顾完历史，我们来看看业务需求。

看过我上一次 Chat [《升级工具链吧！使用 Webpack 开发企业官网》](https://gitbook.cn/gitchat/activity/5cf7ee6b7388a119e2a74d02)的同学应该知道，一切都源自我厂的官网要改版。

我厂[官网](https://openresty.com.cn/) v1.0 采用的是前文中“远古时期”的模式，由设计师设计、制作完网页之后，直接把纯静态资源上传到服务器，然后提供服务。这样的好处是：

1. 简单好操作，对人员要求低
2. 访问速度快，对机器配置要求低
3. 对搜索引擎友好

但是也有很多不足：

1. 纯静态，不利于调整内容
2. 不利于 i18n，没有多语言版

这些问题，我在 v2.0 时进行了修正。首先，我引入 Gulp 批处理，增加了“发布”环节，虽然最终还是部署纯静态内容，但是内容可以简单调整，也通过 DOM 查找，实现了 i18n，同步提供中英两个语言。

新版本上线一年半，效果不错，但也有很多不足：

1. 需要开发者手动管理所有资源，很累
2. 发布脚本很多很复杂，不便于理解；Gulp 采用 stream 模式，没搞过的新人很难接手
3. 没有好的开发环境

于是，当整个页面内容都要更新时，我决定升级到 v3.0。这次使用 Webpack 工具链，采用多页面模式，配合 Pug 的可编程特性，更好的实现了最终效果，还可以配合 webpack-dev-server 方便的在本地开发。新版本大大改善了开发效率。新同事打开项目看了看 Webpack 的配置文件，很快就搞明白它是怎么工作的，如果要做工作，应该从哪里入手。

不过正如《矛盾论》所说，当主要矛盾被解决，次要矛盾就会变成新的主要矛盾。此刻，新的问题出现：专业的前端开发能很快摸清项目结构，但对于后端同事来说，未知的新概念还是很多。教会他们理解所有框架、类库、工具没什么意义，如果能够给他们一个简单可操作的 UI，那才能真正提高效率。比如 `npm run edit`，然后浏览器就打开一个页面。他们按需编辑后，保存，提交仓库，发布。这样的流程才是真正要追求的流程。

所以，最合适的做法就是用 Vue 实现一些编辑器组件，它们有两种形态：编辑，静态。编辑态就不用解释了；我们只要把静态的 HTML 保存下来，生成静态页，即可。

好的，现在需求已经出来了：

1. 已有一个 Vue 项目
2. 这个项目大部分功能由 SPA 提供，不需要静态化，不需要预渲染
3. 这个项目部分路由需要生成静态页
4. 部署的时候，只需要部署静态页和其引用的资源

看到这个需求，我想大多数关注前端的同学可能跟我一样，第一反应就是：应该找一个 SSR 框架，添加到现有项目中。那么，就选最出名的 Nuxt.js 吧，这个框架的作者还跟 Vue 的作者一起看 NBA 呢。

--------

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

--------

重构现有项目
========

理解了 Nuxt.js 的定位，就不难判断，如果我们想集成 Nuxt.js 到现有项目，必须进行一些重构。

生命周期钩子
--------

服务器端渲染没有挂载（`amount`）DOM 的过程，所以自然也不支持 `beforeMount` 和 `mounted` 钩子。如果你跟我一样，习惯把初始化代码写在 `beforeMount` 里，那么可能有不少地方要修改。所以，以后如果有对时机要求不严的操作，最好放在 `created` 甚至 `beforeCreated` 里。

如果页面需要异步加载数据，就需要用 [`asyncData` 函数](https://nuxtjs.org/guide/async-data)。这个函数的用法和钩子函数类似，它需要返回 Promise 实例，真正的模板渲染会在这个 Promise 完成之后才开始。

不过需要注意，正常来说，静态页面里会包含完整的 JS，即包含完整的页面逻辑，所以钩子函数在浏览器里会照常执行。所以要避免类似的代码在 `asyncData` 和钩子函数里重复运行。

入口
--------

一般来说，如果使用 Vue CLI 创建项目，入口文件是 `src/main.js`，这个文件会 `import` `src/App.vue`，并且 `mount` 到 `#app` 元素上。

我们当然可以继续使用这个入口，不过考虑到静态页面的依赖跟 CMS 页面的需求不同，我认为重新定义一个入口比较好。在本项目中，我把两者都需要的依赖放在 `src/App.vue` 里，比如 Bootstrap 的样式；只有 CMS 需要的依赖放在 `src/main.js` 里，比如 CMS 路由和 Vuex。然后在 `nuxt.config.js` 里重新配置路由，以 `src/App.vue` 作为入口。

`head`
--------

网页的头信息，包括 `<title>`，关键词（keywords）、描述（description）对 SEO 非常重要。即使不考虑 SEO，只是方便用户使用浏览器前进后退，显示正确的 `<title>` 也是应该的。在 Vue 项目中，我们使用 [vue-meta](https://github.com/nuxt/vue-meta) 满足这个需求（vue-meta 也是 Nuxt.js 团队开发的）。

但是在 Nuxt.js 生成的静态页面里，我们需要使用 `head` 属性。它的用法和 `vue-meta` 基本一致，等下我会在具体配置里详细介绍。

--------

生成静态页的相关配置
======

接下来准备介绍配置。其实配置本身可说的部分不多，之所以铺垫这么久，正是因为前面那些内容都是我踩过的坑。当原本打算一两个小时搞定的事情，最后花费5、6个小时才摸索出来时，我就想，如果这些知识点我以前就知道，那该多好。

好吧，言归正传，最终的配置如下：

```js
const path = require('path');
const {
  promises: {
    copyFile,
  },
} = require('fs');
const {DefinePlugin} = require('webpack');
const pkg = require('./package');
const {POST_TABLE} = require('./src/model/Post');

module.exports = {
  // 用来输出 `<head>` 里面的信息
  head: {
    titleTemplate: '%s - Meathill',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'},
    ],
  },

  // build 配置，其实就是封装起来的 webpack 配置
  build: {
    extend(config) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    },
    extractCSS: true,
    plugins: [
      new DefinePlugin({
        VERSION: JSON.stringify(pkg.version),
      }),
    ],
  },

  // 重新构建路由。因为静态页对 URL 的需求和 CMS 完全不同，所以这里我只针对静态页添加了简单的路由设定。
  // 前文说过，这里我用 `src/App.vue` 作为入口
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'home',
        path: '/',
        component: resolve(__dirname, 'src/App.vue'),
        children: [
          {
            name: 'page.view',
            path: ':path',
            component: resolve(__dirname, 'src/modules/page/page.vue'),
          },
        ],
      });
    },
  },

  // 渲染配置，因为是纯静态页，所以我选择不注入业务逻辑（即 CMS 里的 JS）
  // 那么也就不需要 prefetch
  render: {
    injectScripts: false,
    resourceHints: false,
  },

  // `nuxt generate` 的配置，只有只作用于生成的配置才写在这里，所以其实是远远不够的
  generate: {
    dir: 'static',
    fallback: false,
    async routes() {
      const posts = await getAllPages();
      return result.map(item => `/${item.get('permanentLink')}`);
    },
  },

  // 钩子函数，复制文件，后面会解释
  hooks: {
    generate: {
      async done() {
        const from = path.resolve(__dirname, 'src/footer.js');
        const to = path.resolve(__dirname, 'static/footer.js');
        await copyFile(from, to);
        console.log('[CMS : Nuxt] Static files copied.');
      },
    },
  },
};
```

这里需要介绍一下 `generate` 属性，它的详细文档在这里：[Nuxt.js > Configuration > The generate Property](https://nuxtjs.org/api/configuration-generate)。它里面的信息是专门为 `nuxt generate` 准备的，但是只配置这个属性是不够的。

它的 `routes` 属性很重要，里面是所有要渲染的静态页。如我的例子所示，这里也可以使用异步函数，动态获取要渲染的页面列表，然后逐个渲染。Nuxt 还提供了一个优化方案，可以批量渲染页面，而不需要每次都访问数据源，不过我暂时没有用到。

--------

添加 SEO 关键信息
========

组件
--------

首先，在页面组件里，添加 `head` 属性，用来返回头信息。在本次项目中，它必须是个函数，根据页面数据动态返回值：

```js
export default {
  head() {
    if (!this.meta) {
      return;
    }
    return {
      title: this.meta.title,
      meta: [
        {
          vmid: 'keywords',
          name: 'keywords',
          content: this.meta.keywords,
        },
        {
          vmid: 'description',
          name: 'description',
          content: this.meta.description,
        },
      ],
      script: [
        {
          body: true,
          defer: true,
          src: 'https://unpkg.com/swiper@4.5.0/dist/js/swiper.min.js',
        },
        {
          body: true,
          defer: true,
          scr: '/footer.js',
        },
      ],
    };
  },
}
```

有些时候，我们会在 `nuxt.config.js` 里配置默认的 meta 信息，为了避免页面的 meta 信息和默认 meta 信息重复出现，所以要用到 `vmid`（在组件里） 和 `hid`（在配置里）。这样同样 id 的头信息就只出现一个，权重当然是页面更高。

接下来 `script` 的部分，可以通过 `body` 属性控制 `<script>` 插入的位置，默认为 `false`，插入 `<head>`。这里当然应该放在 `</body>` 之前。静态网页不需要 Vue 那些很复杂的交互，所以在上一章中，我通过 `render` 属性把它们去掉了。但是有一些其它交互要添加进来，比如头图切换用 swiper，还有统计代码。所以要插入一个 `footer.js` 进去。

这里需要注意，Nuxt.js 并不会调用 webpack 去处理这里的 JS，所以我们需要人工控制它们的路径。下一章你会看到，我是直接复制文件到 `static` 文件夹的，所以它的路径也就写成固定的 `/footer.js`。如果你有 `publicPath` 之类的需求，还要自己处理一下哦。

配置文件
--------

配置文件里的内容上一章展示过：

```js
module.exports = {
  head: {
    titleTemplate: '%s - Meathill',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'},
    ],
  },
}
```

好像没什么可说的……我暂时只用到标题模板，比如一个页面标题是“今天晚上吃什么？”，那么就会渲染成：“今天晚上吃什么？ - Meathill”。其它选项大家可以参考 [Vue Meta > API > metaInfo properties](https://vue-meta.nuxtjs.org/api/#base)。

渲染静态页的时候，vue-meta 似乎不是必须的；换言之，我一开始用了 vue-meta，没有配 `head`，也没有输出需要的 meta 信息。

--------

利用钩子注入 JS
========

Nuxt.js 提供了很多钩子，方便我们在特定的环节进行定制化操作。这些钩子跟不同的操作绑定，接受不同的参数，返回不同的结果，具体钩子列表请参考 [Nuxt.js > API > Hooks > List of hooks](https://nuxtjs.org/api/configuration-hooks#list-of-hooks)。

在本项目中，我的需求是生成静态页面需要的 JS。这个 JS 包含两个功能：

1. 初始化 swiper
2. 启动统计代码

因为功能非常简单，我暂时不打算用 webpack 打包，只想复制到目标文件夹里。启动复制操作的时机并不敏感，因为和主要的生成静态页工作不存在相互依赖的关系。不过 Nuxt.js 默认会清理生成目录，所以我觉得晚一些复制会比较好，最后选择 `generate:done` 这个钩子。代码如下：

```js
const {
  promises: {
    copyFile,
  },
} = require('fs');

module.exports = {
  hooks: {
    generate: {
      async done() {
        const from = path.resolve(__dirname, 'src/footer.js');
        const to = path.resolve(__dirname, 'static/footer.js');
        await copyFile(from, to);
        console.log('[CMS : Nuxt] Static files copied.');
      },
    },
  },
}
```

这段代码应该很容易看懂吧，就是一个简单的复制。不过需要注意，`copyFile` 函数是 v10 之后添加到 Node.js 里的，而预 promise 化的对象是 v12 之后添加的。

--------

后记 & 附录
========

先回顾一下本文的主要观点：

1. Nuxt.js 的目标是覆盖完整的网站开发场景，这个场景更有前（钱）途
2. 支持 Vue 模板的服务器渲染是必经之路
3. 所以在现有项目中集成 Nuxt.js 渲染静态页的成本比较高，很多文章也提供类似的观点
4. 但是如果有必要，这仍然是最好操作的方案

接下来，关于技术选型：

1. 如果是新项目，必须 SSR，那么建议从开始就用 Nuxt.js 创建项目
2. 如果是老项目，部分页面需要静态化，请参考本文

最后，如果要在现有项目中解成 Nuxt.js，我们应该：

1. 重构现有项目，一般要重构入口和路由
2. 新建 `nuxt.config.js`，添加基础配置
3. 配置 `generate` 属性，生成所有要静态化的路径
4. 如果不需要复杂的交互，可以用 `render` 属性移除老的 JS，然后手动添加其它的。

希望本文可以帮大家节省学习尝试踩坑的时间。

附录
--------

### Vue 服务器端渲染

* [Vue.js 服务器端渲染指南](https://ssr.vuejs.org/zh/)
* [Nuxt.js](https://zh.nuxtjs.org/)

ES6+
--------

### 《ES6 入门》 by 阮一峰

无论怎么黑阮先生，他为前端做出的贡献都是不能忽视的。这本书包含 ES6 之后到 ES2018 新增的语法和新特性，中文免费阅读，非常推荐。

链接：http://es6.ruanyifeng.com/

### 《深入理解 ES6》 by Nicolas C.Zakas

读完入门，最适合再来个深入。这本书是红宝书《JavaScript 高级程序设计》作者的又一力作，语言平实易懂，翻译质量也很高。

https://www.amazon.cn/dp/B071GW3JDP/ref=sr_1_1?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&keywords=%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3es6&qid=1554804466&s=gateway&sr=8-1
