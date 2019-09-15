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
