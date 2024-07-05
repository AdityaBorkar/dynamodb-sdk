// jsr publish --dry-run
// Get data from Changelog & Commits

import MonoRepoConfig from "./monorepo.config"

// ON MERGE: `main`
// TODO: Check if changelog is published


// ON NEW (DRAFT) PR:
function GenerateChangelog() {
    // npm run prepublish

    MonoRepoConfig.packages.forEach((pkg) => {
// TODO: Search for edits
const commits = true
if (!commits) return

        const ReleaseTag = 'core/v1.0.0'
        const ReleaseMessage = `
        ## Core (npmjs.com/@dynamodb-sdk/core)
        
        ### Changelog
        
        - 
        - 
        - 
        
        
        ### Commits:
        
        - feat(workspace): new feature added by @USERNAME (#PR)
        - 
        - 
        `

        // TODO: Push Release
    })
}

// TODO: PREVENT MERGE IF NO CHANGELOG
// ON MERGE: `stable`


// * PUBLISH ONLY THOSE PACKAGES THAT HAVE CHANGES
// install bun
// bunx npm publish
// bunx jsr publish

// https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages
// GITHUB_TOKEN
