const MonoRepoConfig= {
    packages: [
        {
            name: 'Core',
            nickname:'core',
            path: '/pkgs/core'
        },
        {
            name: 'Infra Resolver: sst',
            nickname:'sst',
            path: '/pkgs/sst'
        },
        {
            name: 'Schema Resolver: arktype',
            nickname:'arktype',
            path: '/pkgs/arktype'
        },
        {
            name: 'Schema Resolver: superstruct',
            nickname:'superstruct',
            path: '/pkgs/superstruct'
        },
        {
            name: 'Schema Resolver: valibot',
            nickname:'valibot',
            path: '/pkgs/valibot'
        },
        {
            name: 'Schema Resolver: zod',
            nickname:'zod',
            path: '/pkgs/zod'
        },
    ]
}

export default MonoRepoConfig

// TODO: Use Turnopack to make this a monorepo

// Using NX

// * Pros of Monorepo
// Easier Collaboration
// Easier to manage dependencies
// Easier Refactoring
// Easy to keep standards across repos

// * Cons of Monorepo
// Problems of Monorepo
// Git operations are slow
// PR/Issue management - reviewers? AND Notification Management
