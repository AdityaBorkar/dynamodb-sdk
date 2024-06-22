import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import type { FlagType } from './OperationFactory'
import type SchemaPrototype from './SchemaPrototype'

import getSstTableName from './getSstTableName'

import BatchGetOperation from '../operations/table-items/batchGet'
import BatchWriteOperation from '../operations/table-items/batchWrite'
import DeleteOperation from '../operations/table-items/delete'
import GetOperation from '../operations/table-items/get'
import PutOperation from '../operations/table-items/put'
import QueryOperation from '../operations/table-items/query'
import ScanOperation from '../operations/table-items/scan'
import UpdateOperation from '../operations/table-items/update'

// TODO: Allow to override schema
export default function TableOperationsPrototype<
  ST extends SchemaType,
  FT extends FlagType,
>(props: {
  tableName: string
  ddb: DynamoDBDocument
  schema: SchemaPrototype<ST>
  flags: FT
}) {
  type SchemaType = SchemaPrototype<ST>

  const { tableName, ...prop } = props
  const TableName = getSstTableName(props.tableName)

  return {
    /**
     * The BatchGetItem operation returns the attributes of one or more items from one or more tables.
     * A single operation can retrieve up to 16 MB of data, which can contain as many as 100 items.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchGetItemCommand/ | AWS JS SDK (v3) API Reference}
     */
    batchGet: () => {
      const command = {}
      type CIT = typeof command
      return new BatchGetOperation<ST, FT, CIT, 'table'>(prop).table(tableName)
    },
    /**
     * The BatchWriteItem operation puts or deletes multiple items in one or more tables.
     * A single call to BatchWriteItem can transmit up to 16MB of data over the network, consisting of up to 25 item put or delete operations. While individual items can be up to 400 KB once stored, it's important to note that an item's representation might be greater than 400KB while being sent in DynamoDB's JSON format for the API call.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/ | AWS JS SDK (v3) API Reference}
     */
    batchWrite: () => {
      const command = {}
      type CIT = typeof command
      return new BatchWriteOperation<ST, FT, CIT, 'table'>(prop).table(
        tableName,
      )
    },
    /**
     * Deletes a single item in a table by primary key. You can perform a conditional delete operation that deletes the item if it exists, or if it has an expected attribute value.
     * Unless you specify conditions, the DeleteItem is an idempotent operation; running it multiple times on the same item or attribute does not result in an error response.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/DeleteItemCommand/ | AWS JS SDK (v3) API Reference}
     */
    delete: (Key: SchemaType['keys']) => {
      const command = { TableName, Key }
      type CIT = typeof command
      return new DeleteOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
    /**
     * The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data and there will be no Item element in the response.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/GetItemCommand/ | AWS JS SDK (v3) API Reference}
     */
    get: (Key: SchemaType['keys']) => {
      const command = { TableName, Key }
      type CIT = typeof command
      return new GetOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
    /**
     * Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item. You can perform a conditional put operation (add a new item if one with the specified primary key doesn't exist), or replace an existing item if it has certain attribute values. You can return the item's attribute values in the same operation, using the ReturnValues parameter.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/PutItemCommand/|AWS JS SDK (v3) API Reference}
     */
    put: (Item: SchemaType['item']) => {
      const command = { TableName, Item }
      type CIT = typeof command
      return new PutOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
    /**
     * You must provide the name of the partition key attribute and a single value for that attribute. Query returns all items with that partition key value. Optionally, you can provide a sort key attribute and use a comparison operator to refine the search results.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/QueryCommand/ | AWS JS SDK (v3) API Reference}
     */
    query: (props: { indexName?: string; condition: string }) => {
      const command = {}
      type CIT = typeof command
      return new QueryOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
    /**
     * The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation.
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/ScanCommand/ | AWS JS SDK (v3) API Reference}
     */
    scan: (props: { indexName?: string; condition: string }) => {
      const command = {}
      type CIT = typeof command
      return new ScanOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
    /**
     * Edits an existing item's attributes, or adds a new item to the table if it does not already exist. You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn't exist, or replace an existing name-value pair if it has certain expected attribute values).
     * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/ | AWS JS SDK (v3) API Reference}
     */ update: (Key: SchemaType['keys']) => {
      const command = { TableName, Key }
      type CIT = typeof command
      return new UpdateOperation<ST, FT, CIT, ''>({ ...prop, command })
    },
  }
}
