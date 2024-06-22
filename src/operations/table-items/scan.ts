import type { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

type CommandInput = ScanCommandInput
type CommandOutput = ScanCommandOutput

export default class ScanOperation {
  // TableName
  // IndexName
  // ConsistentRead
  // Limit
  // Select
  // Segment
  // TotalSegments
  // ExclusiveStartKey
  // FilterExpression
  // ProjectionExpression
  // ExpressionAttributeNames
  // ExpressionAttributeValues
  // ReturnConsumedCapacity: "NONE" "TOTAL" "INDEXES"
}

// Count and ScannedCount only return the count of items specific to a single scan request and, unless the table is less than 1MB, do not represent the total number of items in the table.
// DynamoDB does not provide snapshot isolation for a scan operation when the ConsistentRead parameter is set to true. Thus, a DynamoDB scan operation does not guarantee that all reads in a scan see a consistent snapshot of the table when the scan operation was requested.
