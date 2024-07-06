# @dymamodb-sdk Development

If you've made it this far, **thank you**! We appreciate your contribution, and hope that this document helps you along the way. If you have any questions or problems, don't hesitate to [file an issue](https://github.com/AdityaBorkar/dynamodb-sdk/issues/new).

## Structure

dynamodb-sdk is a monorepo (managed using nx) that contains the following directories:

- `/docs`: Contains the documentation for the DynamoDB SDK. Files are nested under `/content` folder.
- `/examples`: Contains example code for using the DynamoDB SDK.
- `/packages`: Contains the source code for the DynamoDB SDK packages.
- `/scripts`: Contains scripts for building and testing the DynamoDB SDK.

dynamodb-sdk is a monorepo that contains multiple packages. Each package is a separate npm module that can be published and versioned independently. The packages are:

- `@dynamodb-sdk/core`: The core DynamoDB SDK package that contains the core functionality.
- `@dynamodb-sdk/sst`: Helper package to build serverless applications using SST Ion.
- `@dynamodb-sdk/zod`: Helper package to build database schemas in zod.
- `@dynamodb-sdk/superstruct`: Helper package to build database schemas in superstruct.
- `@dynamodb-sdk/arktype`: Helper package to build database schemas in arktype.

## Workflow

- Clone this repository using ``
- Run `pnpm install` to install the dependencies for all the packages.
- Depending on the package you want to work on, you can run `pnpm run start <package-name>` to start the development server for that package.
- Open a "Draft Pull Request" to the main branch.
- Make the changes you want to make.
- You can test these changes locally:
  - Run `pnpm run test` to run the tests for all the packages.
  - Run `pnpm run test <package-name>` to run the tests for that package.
  - Run `pnpm run build <package-name>` to build the package.
- Add documentation for the changes you made in the PR.
- Once you are satisfied with the changes you made, you can convert the Draft Pull Request to "Pull Request".
- GitHub Workflows shall run and mention if any changes are needed from your end.

## Scripts

Our [`package.json`](package.json) houses a collection of [run-scripts] that we use to maintain, test, build, and publish Primer CSS. Run `npm run <script>` with any of the following values for `<script>`:

- `dist` runs `script/dist`, which creates CSS bundles of all the `index.scss` files in `src/`.
- `stylelint` lints the CSS source files.