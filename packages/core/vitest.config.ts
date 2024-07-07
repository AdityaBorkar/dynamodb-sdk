import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	test: {
		globalSetup: ['vitest.setup.ts'],
		root: '.',
		alias: {
			'@/*': './src/*',
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
	},
	plugins: [tsconfigPaths()],
	// resolve: {
	// 	alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
	// },
})
