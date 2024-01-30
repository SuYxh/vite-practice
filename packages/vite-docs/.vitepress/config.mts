import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vite study",
  description: "vite study",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '使用', link: '/use/index.md' },
      { text: '插件', link: '/plugin/index.md' },
      { text: '资源', link: '/resource/index.md' },
      { text: '参考', link: '/reference/index.md' },

    ],

    sidebar: {
      "/use/": [
        {
          text: '简介',
          items: [
            { text: '基础', link: '/use/index.md' },
            { text: '体积太大怎么拆包', link: '/use/体积太大怎么拆包.md' }
          ]
        }
      ],
      "/plugin/": [
        {
          text: '简介',
          items: [
            { text: '基础', link: '/plugin/index.md' },
            { text: '如何开发一个完整的Vite插件', link: '/plugin/如何开发一个完整的Vite插件.md' }
          ]
        }
      ],
    },

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
