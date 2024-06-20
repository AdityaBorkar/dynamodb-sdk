import type {
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb'

type CommandInput = TransactWriteCommandInput
type CommandOutput = TransactWriteCommandOutput

/**
 * TransactWriteItems is a synchronous write operation that groups up to 100 action requests. These actions can target items in different tables, but not in different Amazon Web Services accounts or Regions, and no two actions can target the same item. For example, you cannot both ConditionCheck and Update the same item. The aggregate size of the items in the transaction cannot exceed 4 MB.
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/TransactWriteItemsCommand/ | AWS JS SDK (v3) API Reference}
 */
class TransactWriteOperation {
  // TransactItems: (
  //   ConditionCheck: { Key TableName ConditionExpression ExpressionAttributeNames ExpressionAttributeValues ReturnValuesOnConditionCheckFailure }
  //   Delete: { Key TableName ConditionExpression ExpressionAttributeNames ExpressionAttributeValues ReturnValuesOnConditionCheckFailure }
  //   Update: { Key TableName UpdateExpression ConditionExpression ExpressionAttributeNames ExpressionAttributeValues ReturnValuesOnConditionCheckFailure }
  //   Put: { Item TableName ConditionExpression ExpressionAttributeNames ExpressionAttributeValues ReturnValuesOnConditionCheckFailure }
  // )[100]
  // ClientRequestToken
  // ReturnItemCollectionMetrics
  // ReturnConsumedCapacity: "NONE" "TOTAL" "INDEXES"
}

// * DynamoDB rejects the entire TransactWriteItems request if any of the following is true:
// A condition in one of the condition expressions is not met.
// An ongoing operation is in the process of updating the same item.
// There is insufficient provisioned capacity for the transaction to be completed.
// An item size becomes too large (bigger than 400 KB), a local secondary index (LSI) becomes too large, or a similar validation error occurs because of changes made by the transaction.
// The aggregate size of the items in the transaction exceeds 4 MB.
// There is a user error, such as an invalid data format.
