import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  base: '/lindencms/docs/', // Docs at /docs/
  outDir: './dist/docs',
  title: "LindenCMS",
  
  description: "A modern, open-source CMS built to accelerate development.",
  themeConfig: {
    sidebar: [
      {
        items: [
          { text: 'Quick start', link: '/' },
          { text: 'Introduction', link: '/introduction' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Config', link: '/config' },
          { text: 'Attributes', link: '/attributes' }, // Docs in porogress
          { text: 'Contexts', link: '/contexts' }, // Docs in porogress
          { text: 'Customization', link: '/customization' }, // Docs in porogress
          { text: 'Ui examples', link: '/ui-examples' },
          { text: 'Client site', link: '/client-site' }, // sections: Do as you want, Pages as defaul
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kolodochka-dev/lindencms' }
    ]
  }
})
