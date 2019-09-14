生成静态页的相关配置
======

接下来准备介绍配置。其实配置本身可说的部分不多，之所以铺垫这么久，正是因为前面那些内容都是我踩过的坑。当原本打算一两个小时搞定的事情，最后花费5、6个小时才摸索出来时，我就想，如果这些知识点我以前就知道，那该多好。

好吧，言归正传，最终的配置如下：

```js
/* global __dirname */

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
        console.log('[Salboy : Nuxt] Static files copied.');
      },
    },
  },
};
```

这里需要介绍一下 `generate` 属性，它的详细文档在这里：[Nuxt.js > Configuration > The generate Property](https://nuxtjs.org/api/configuration-generate)。它里面的信息是专门为 `nuxt generate` 准备的，但是只配置这个属性是不够的。

它的 `routes` 属性很重要，里面是所有要渲染的静态页。如我的例子所示，这里也可以使用异步函数，动态获取要渲染的页面列表，然后逐个渲染。Nuxt 还提供了一个优化方案，可以批量渲染页面，而不需要每次都访问数据源，不过我暂时没有用到。
