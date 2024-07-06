import type {
  BatchGetCommandInput,
  BatchGetCommandOutput,
} from '@aws-sdk/lib-dynamodb'

type CommandInput = BatchGetCommandInput
type CommandOutput = BatchGetCommandOutput

export default class BatchGetOperation {
  // RequestItems: { Keys ConsistentRead ProjectionExpression ExpressionAttributeNames }
  // ReturnConsumedCapacity: "NONE" "TOTAL" "INDEXES"
}

// TODO: Single operation has a limit of 100 items.

// If you request more than 100 items, BatchGetItem returns a ValidationException with the message "Too many items requested for the BatchGetItem call."
// CATCH: ValidationException ProvisionedThroughputExceededException
// CATCH: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.Errors.html#BatchOperations
