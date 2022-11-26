利用钩子注入 JS
========

Nuxt.js 提供了很多钩子，方便我们在特定的环节进行定制化操作。这些钩子跟不同的操作绑定，接受不同的参数，返回不同的结果，具体钩子列表请参考 [Nuxt.js > API > Hooks > List of hooks](https://nuxtjs.org/api/configuration-hooks#list-of-hooks)。

在本项目中，我的需求是生成静态页面需要的 JS。这个 JS 包含两个功能：

1. 初始化 swiper
2. 启动统计代码

因为功能非常简单，我暂时不打算用 webpack 打包，只想复制到目标文件夹里。启动复制操作的时机并不敏感，因为和主要的生成静态页工作不存在相互依赖的关系。不过 Nuxt.js 默认会清理生成目录，所以我觉得晚一些复制会比较好，最后选择 `generate:done` 这个钩子（基本是最后才会执行）。代码如下：

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

<adsense />

这段代码应该很容易看懂吧，就是一个简单的复制。不过需要注意，`copyFile` 函数是 v10 之后添加到 Node.js 里的，而预 promise 化的 `fs.promises` 是 v12 之后添加的。
