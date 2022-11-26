import {resolve} from 'path';
import {defineUserConfig} from 'vuepress';
import {defaultTheme} from '@vuepress/theme-default';
import {googleAnalyticsPlugin} from '@vuepress/plugin-google-analytics';
import {registerComponentsPlugin} from '@vuepress/plugin-register-components';
import book from '../book.json';

export default defineUserConfig({
  lang: 'zh-CN',
  title: book.title,
  description: book.description,
  base: '/gitbook-nuxt-generate-static-site/',
  head: [
    [
      'script',
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9946806099979342",
        crossOrigin: "anonymous",
      },
    ],
  ],
  theme: defaultTheme({
    docsBranch: 'master',
    navbar: [
      {
        text: '山维空间',
        link: 'https://blog.meathill.com',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/meathill',
      },
      {
        text: 'Bilibili',
        link: 'https://space.bilibili.com/7409098',
      },
    ],
    repo: 'meathill/gitbook-nuxt-generate-static-site',
    sidebar: [
      {
        'text': '前言',
        'link': '/',
      },
      'web-history.md',
      'cms-product-design.md',
      'nuxt.md',
      'refactor.md',
      'config.md',
      'seo-meta.md',
      'inject-js.md',
      'appendix.md',
    ]
  }),
  plugins: [
    googleAnalyticsPlugin({
      id: 'G-6X03SBJR88',
    }),
    registerComponentsPlugin({
      components: {
        Adsense: resolve(__dirname, './components/adsense.vue'),
      },
    }),
  ],
});
