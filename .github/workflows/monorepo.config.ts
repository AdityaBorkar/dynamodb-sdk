const MonoRepoConfig = {
	packages: [
		{
			name: 'Core',
			nickname: 'core',
			path: '/pkgs/core',
		},
		{
			name: 'Infra Resolver: sst',
			nickname: 'sst',
			path: '/pkgs/sst',
		},
		{
			name: 'Schema Resolver: arktype',
			nickname: 'arktype',
			path: '/pkgs/arktype',
		},
		{
			name: 'Schema Resolver: superstruct',
			nickname: 'superstruct',
			path: '/pkgs/superstruct',
		},
		{
			name: 'Schema Resolver: valibot',
			nickname: 'valibot',
			path: '/pkgs/valibot',
		},
		{
			name: 'Schema Resolver: zod',
			nickname: 'zod',
			path: '/pkgs/zod',
		},
	],
}

export default MonoRepoConfig

// Versioning - The process of determining the next version of your projects, and updating any projects that depend on them to use the new version.
// Changelog - The process of deriving a changelog from your commit messages, which can be used to communicate the changes to your users.
// Publishing - The process of publishing your projects to a registry, such as npm for TypeScript/JavaScript libraries.

// Once successfully integrated, make a release + push to a different github branch (staash) and mark it as head.
