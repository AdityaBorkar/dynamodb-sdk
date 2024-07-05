import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globalSetup: ['vitest.setup.ts'],
    root: '.',
    alias: {
      '@/*': 'src/*',
    },
  },
  plugins: [tsconfigPaths()],
  // resolve: {
  //   alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
  // },
})
