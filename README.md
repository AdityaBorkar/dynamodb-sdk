Logo (ddb-js)

NPM Version | Downloads | Stars | Coverage | Discord | License

<sub><em>
ddb-js is an open-source community project and NOT affiliated with AWS or Amazon.
</em></sub>

---

## Features

- Supports SST 3.0+
- Readable and composable code

## Documentation

Read more and compile from
- https://github.com/alexdebrie/awesome-dynamodb
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
- CODE_OF_CONDUCT.md
- CONTRIBUTING.md
- BRANCHES.md -> stable, v1-wip, v2-rc, v2-beta, v2-wip

Visit https://adityaborkar.com/ddb-js/docs to view the full documentation.

## Community

The community can be found on GitHub Discussions where you can ask questions, voice ideas, and share your projects with other people. To chat with other community members you can join the Discord server.

Do note that our Code of Conduct applies to all community channels. Users are highly encouraged to read and adhere to them to avoid repercussions.

## Contributing

Contributions to `ddb-js` are welcome and highly appreciated. However, before you jump right into it, we would like you to review our Contribution Guidelines to make sure you have a smooth experience contributing to `ddb-js`.

## Contributors

<!-- We would like to thank all the contributors who helped make `ddb-js` better -->

- Aditya Borkar (TWITTER)

---

### Supported Operations

- PutItemCommand
- GetItemCommand
- UpdateItemCommand
- DeleteItemCommand
- BatchGetItemCommand
- BatchWriteItemCommand
- QueryCommand
- ScanCommand
- TransactGetItemsCommand
- TransactWriteItemsCommand
- ExecuteStatementCommand
- ExecuteTransactionCommand

### Unsupported Operations

- [Tables]:
   - ImportTableCommand
   - ListTablesCommand
   - CreateTableCommand
   - UpdateTableCommand
   - DeleteTableCommand
   - DescribeTableCommand
- [Kinesis Streaming]:
   - UpdateKinesisStreamingDestinationCommand
   - EnableKinesisStreamingDestinationCommand
   - DisableKinesisStreamingDestinationCommand
   - DescribeKinesisStreamingDestinationCommand
- [Global Tables]:
   - CreateGlobalTableCommand
   - ListGlobalTablesCommand
   - UpdateGlobalTableCommand
   - DescribeGlobalTableCommand
   - UpdateGlobalTableSettingsCommand
   - DescribeGlobalTableSettingsCommand
- [Tables Others]:
   - DescribeLimitsCommand
   - DescribeEndpointsCommand
   - DescribeTimeToLiveCommand
   - UpdateTimeToLiveCommand
   - UpdateTableReplicaAutoScalingCommand
   - DescribeTableReplicaAutoScalingCommand
   - [Resource Policy]:
   - PutResourcePolicyCommand
   - GetResourcePolicyCommand
   - DeleteResourcePolicyCommand
- [Backups]:
   - ListBackupsCommand
   - CreateBackupCommand
   - DeleteBackupCommand
   - DescribeBackupCommand
   - RestoreTableFromBackupCommand
   - RestoreTableToPointInTimeCommand
   - DescribeContinuousBackupsCommand
   - UpdateContinuousBackupsCommand
- [Tags]:
   - ListTagsOfResourceCommand
   - TagResourceCommand
   - UntagResourceCommand
- [Insights]:
   - ListContributorInsightsCommand
   - UpdateContributorInsightsCommand
   - DescribeContributorInsightsCommand
- [Import/Export]:
   - ListImportsCommand
   - DescribeImportCommand
   - ListExportsCommand
   - DescribeExportCommand
   - ExportTableToPointInTimeCommand

