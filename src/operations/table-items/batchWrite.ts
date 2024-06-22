import type {
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb'

type CommandInput = BatchWriteCommandInput
type CommandOutput = BatchWriteCommandOutput

export default class BatchWriteOperation {
  // RequestItems: { (DeleteRequest: Key / PutRequest: Item)[] }
  // ReturnConsumedCapacity: "NONE" "TOTAL" "INDEXES"
  // ReturnItemCollectionMetrics: "NONE" "SIZE"
}

// * If one or more of the following is true, DynamoDB rejects the entire batch write operation:
// One or more tables specified in the BatchWriteItem request does not exist.
// Primary key attributes specified on an item in the request do not match those in the corresponding table's primary key schema.
// You try to perform multiple operations on the same item in the same BatchWriteItem request. For example, you cannot put and delete the same item in the same BatchWriteItem request.
// Your request contains at least two items with identical hash and range keys (which essentially is two put operations).
// There are more than 25 requests in the batch.
// Any individual items with keys exceeding the key length limits. For a partition key, the limit is 2048 bytes and for a sort key, the limit is 1024 bytes.
