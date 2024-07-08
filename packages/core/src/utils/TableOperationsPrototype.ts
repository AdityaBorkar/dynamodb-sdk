import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import type { FlagType } from './OperationFactory'

import ResolveTableName from './ResolveTableName'

import BatchGetOperation from '@/operations/table-items/batchGet'
import BatchWriteOperation from '@/operations/table-items/batchWrite'
import DeleteOperation from '@/operations/table-items/delete'
import GetOperation from '@/operations/table-items/get'
import PutOperation from '@/operations/table-items/put'
import QueryOperation from '@/operations/table-items/query'
import ScanOperation from '@/operations/table-items/scan'
import UpdateOperation from '@/operations/table-items/update'

/**
 * @internal @private
 * Provides wrappers around the table operations
 */
export default function TableOperationsPrototype<
	TS extends TableSchema,
	FT extends FlagType,
>(props: {
	tableName: string
	ddb: DynamoDBDocument
	schema: TS
	flags: FT
}) {
	const { tableName, ...prop } = props
	const TableName = ResolveTableName(props.tableName)

	return {
		/**
		 * Returns the attributes of upto 100 items from one or more tables.
		 * Single operation call has a limit of 16 MB of data.
		 * @docs {@link https://www.example.com/docs/table-items/batch-get | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/batch-get | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchGetItemCommand/ | AWS JS SDK (v3) API Reference}
		 */
		batchGet: () => {
			const command = {}
			type CIT = typeof command
			return new BatchGetOperation<TS, FT, CIT, 'table'>(prop).table(tableName)
		},
		/**
		 * Puts or deletes upto 25 items in one or more tables.
		 * Single operation call has a limit of 16 MB of data, with individual items being limited to 400 KB.
		 * @docs {@link https://www.example.com/docs/table-items/batch-write | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/batch-write | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/ | AWS JS SDK (v3) API Reference}
		 */
		batchWrite: () => {
			const command = {}
			type CIT = typeof command
			return new BatchWriteOperation<TS, FT, CIT, 'table'>(prop).table(
				tableName,
			)
		},
		/**
		 * Deletes a single item in a table by primary key. You can perform a conditional delete operation that deletes the item if it exists, or if it has an expected attribute value.
		 * Unless you specify conditions, the DeleteItem is an idempotent operation; running it multiple times on the same item or attribute does not result in an error response.
		 * @docs {@link https://www.example.com/docs/table-items/delete | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/delete | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/DeleteItemCommand/ | AWS JS SDK (v3) API Reference}
		 */
		delete: (Key: TS['_types']['keys']) => {
			const command = { TableName, Key }
			type CIT = typeof command
			return new DeleteOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
		/**
		 * The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data and there will be no Item element in the response.
		 * @docs {@link https://www.example.com/docs/table-items/delete | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/delete | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/GetItemCommand/ | AWS JS SDK (v3) API Reference}
		 */
		get: (Key: TS['_types']['keys']) => {
			const command = { TableName, Key }
			type CIT = typeof command
			return new GetOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
		/**
		 * Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item. You can perform a conditional put operation (add a new item if one with the specified primary key doesn't exist), or replace an existing item if it has certain attribute values. You can return the item's attribute values in the same operation, using the ReturnValues parameter.
		 * @docs {@link https://www.example.com/docs/table-items/put | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/put | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/PutItemCommand/|AWS JS SDK (v3) API Reference}
		 */
		put: (Item: TS['_types']['item']) => {
			const command = { TableName, Item }
			type CIT = typeof command
			return new PutOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
		/**
		 * Returns all items with the partition key value with maximum of 1 MB of data and then apply any filtering to the results using FilterExpression.
		 * Optionally, you can provide a sort key attribute and use a comparison operator to refine the search results.
		 * @docs {@link https://www.example.com/docs/table-items/query | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/query | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/QueryCommand/ | AWS JS SDK (v3) API Reference}
		 */
		query: <IT extends keyof TS['_types']['indices']>(props: {
			indexName?: IT
			ifCondition: string
		}) => {
			// TODO: `ifCondition` should be a KEY condition expression
			// TODO: Do some processing of 'KeyConditionExpression'
			const command = {
				TableName,
				IndexName: props.indexName,
				KeyConditionExpression: props.ifCondition,
			} as const
			type CIT = typeof command
			return new QueryOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
		/**
		 * The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation.
		 * @docs {@link https://www.example.com/docs/table-items/scan | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/scan | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/ScanCommand/ | AWS JS SDK (v3) API Reference}
		 * 
		 * 
			// Count and ScannedCount only return the count of items specific to a single scan request and, unless the table is less than 1MB, do not represent the total number of items in the table.
			// DynamoDB does not provide snapshot isolation for a scan operation when the ConsistentRead parameter is set to true. Thus, a DynamoDB scan operation does not guarantee that all reads in a scan see a consistent snapshot of the table when the scan operation was requested.
		 */
		scan: <IT extends keyof TS['_types']['indices']>(props: {
			indexName?: IT
			ifCondition: string
		}) => {
			// TODO: `ifCondition` should be a KEY condition expression
			// TODO: Do some processing of 'KeyConditionExpression'
			const command = {
				TableName,
				IndexName: props.indexName,
				KeyConditionExpression: props.ifCondition,
			} as const
			type CIT = typeof command
			return new ScanOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
		/**
		 * Edits an existing item's attributes, or adds a new item to the table if it does not already exist. You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn't exist, or replace an existing name-value pair if it has certain expected attribute values).
		 * @docs {@link https://www.example.com/docs/table-items/update | dynamodb-sdk Documentation}
		 * @api {@link https://www.example.com/api/table-items/update | dynamodb-sdk API Reference}
		 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/UpdateItemCommand/ | AWS JS SDK (v3) API Reference}
		 */
		update: (Key: TS['_types']['keys']) => {
			const command = { TableName, Key }
			type CIT = typeof command
			return new UpdateOperation<TS, FT, CIT, ''>({ ...prop, command })
		},
	}
}
