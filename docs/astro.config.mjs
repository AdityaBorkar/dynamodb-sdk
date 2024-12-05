import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'

import solidJs from '@astrojs/solid-js'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    solidJs({
      include: ['**/solid/*', '**/node_modules/@suid/material/**'],
    }),
  ],
  redirects: {
    '/docs': '/docs/about',
  },
})
