<div align="center">

<br/>
<br/>

<h1>dynamodb-sdk</h1>


[![JSR](https://jsr.io/badges/@dynamodb/sdk)](https://jsr.io/@dynamodb/sdk) [![NPM Version](https://img.shields.io/npm/v/dynamodb-sdk)](https://npmjs.com/package/dynamodb-sdk) [![NPM Total Downloads](https://img.shields.io/npm/d18m/dynamodb-sdk)]((https://npmjs.com/package/dynamodb-sdk)) ![Minified GZipped Bundle Size](https://badgen.net/bundlephobia/minzip/dynamodb-sdk) Builds Coverage [![GitHub Repo stars](https://img.shields.io/github/stars/adityaborkar/dynamodb-sdk)](https://github.com/adityaborkar/dynamodb-sdk)

[Website](https://adityaborkar.com/dynamodb-sdk)&emsp;•&emsp;[Docs](https://adityaborkar.com/dynamodb-sdk/docs)&emsp;•&emsp;[Examples](https://adityaborkar.com/dynamodb-sdk/guides)&emsp;•&emsp;[Guides](https://adityaborkar.com/dynamodb-sdk/guides)&emsp;•&emsp;[Playground](https://adityaborkar.com/dynamodb-sdk/playround)&emsp;•&emsp;[Release Notes](https://adityaborkar.com/dynamodb-sdk/changelog)

<sub><em>
dynamodb-sdk is an open-source community project and NOT affiliated with AWS or Amazon.
</em></sub>

<br/>
<br/>
<br/>

</div>


## About

`dynamodb-sdk` is a wrapper around the `@aws-sdk/client-dynamodb` that uses data validation libraries to provide a more user-friendly interface for working with DynamoDB. It is designed to be used with TypeScript and provides a more intuitive way to interact with DynamoDB tables and indexes. It includes strongly typed classes and methods, query and scan builders, and much more.

> Note: While we are still BETA, we are feature-complete and ready to be included in small projects for production. We are collecting feedback until September 30th, 2024. Release v1 is tentatively scheduled for October 2024. Raise an issue on GitHub for feature requests or feedback.


- [x] Fully type-safe
- [x] Readable and composable code
- [x] Intuitive and easy documentation
- [x] <150 kb Raw File Size
- [x] <15 kB GZipped and Minified
- [x] Tree Shakable and Serverless in mind
- [x] AWS Multi-region and multi-account support.
- [x] Strict data modeling (validation, required attributes, and more)
- [x] Capture DynamoDB errors and make it easier to work with
- [x] Support for Single Table Design
- [Emoji] Bring in your favourite schema tool: Zod, Arktype, Superstruct and Valibot (more coming soon).
- [Emoji] Integrates directly with SST v3 (Ion)
- [Emoji] Coming Soon: Pulumi and Terraform support.
- [Emoji] Coming Soon: JS Pipeline Operators.

<br/>

## Getting Started

Visit https://adityaborkar.com/dynamodb-sdk/docs/getting-started to view the full documentation.

Note: This package does not supports legacy parameters while making API calls.

<br/>

## Community

The community can be found on GitHub Discussions where you can ask questions, voice ideas, and share your projects with other people. Do note that our Code of Conduct applies to all community channels. Users are highly encouraged to read and adhere to them to avoid repercussions.

<br/>

## Contributing

Contributions to `dynamodb-sdk` are welcome and highly appreciated. However, before you jump right into it, we would like you to review our Contribution Guidelines to make sure you have a smooth experience contributing to `dynamodb-sdk`.

<br/>

<!--
## Contributors

We would like to thank all the contributors who helped make `dynamodb-sdk` better

- Aditya Borkar (TWITTER)
-->

