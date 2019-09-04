使用 Nuxt.js 发布纯静态网站
========

前言
========

如果开发需要复杂交互的 Web 应用，我们多半会选择 SPA；如果要做提供内容资讯的网站，更有利于 SEO、加载速度更快的服务器端渲染（Server-Side Rendering，SSR）自然是大家的首选；那么，如果是一个 CMS 生成纯静态网页呢？

前阵子公司官网升级，我尝试用 Webpack 多页配置，成功的升级了工具链，收获了比较理想的效果。我还基于这段经验写了一篇 Chat 来分享这期间的收获：[《升级工具链吧！使用 Webpack 开发企业官网》](https://gitbook.cn/new/gitchat/activity/5cf7ee6b7388a119e2a74d02)。实际运行一阵子之后，我发现一些新问题：这套技术链对于非前端开发者来说，还是算不上简单，有时候虽然只是一个小小的文案错误，也要找我来改；或者比如“加入我们”页面里的岗位信息，也需要熟悉代码的我来增删改。

于是我就想，能否把各页面以 Vue 组件的形式搭建起来，每个组件可以有“编辑/显示”两个状态，浏览器里打开时是“编辑”，用户可以修改里面的内容。然后以“显示”状态发布成静态页，继续使用纯静态的方式部署。这就相当于，我要基于原先的项目开发一个 CMS，把原先的静态页改造成 Vue 模板，发布成纯静态 HTML。以前我听说过很多关于 Vue SSR 的东西，一直没有实操过，有了这个想法之后，就想研究下这个过程，搞个最小用例，将来官网升级 3.0 的时候可以考虑。我本以为只是举手之劳，最多 1，2 个小时就搞定了，没想到最后折腾了大半天。所以我觉得，很有必要再写一篇 Chat，分享这个过程中的收获。

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
2. 希望了解静态化和 Nuxt.js

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

1. CMS：发布系统，没有特指的话，多数是前言中的这种发布静态页的系统

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
