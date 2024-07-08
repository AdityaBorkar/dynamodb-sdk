import type { FlagType } from '@/utils/OperationFactory'
import type {
	BatchWriteCommandInput,
	BatchWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb'

import OperationFactory from '@/utils/OperationFactory'

type CommandInput = BatchWriteCommandInput

// TODO: Limit up to 25 item put or delete operations

// * If one or more of the following is true, DynamoDB rejects the entire batch write operation:
// One or more tables specified in the BatchWriteItem request does not exist.
// Primary key attributes specified on an item in the request do not match those in the corresponding table's primary key schema.
// You try to perform multiple operations on the same item in the same BatchWriteItem request. For example, you cannot put and delete the same item in the same BatchWriteItem request.
// Your request contains at least two items with identical hash and range keys (which essentially is two put operations).
// There are more than 25 requests in the batch.
// Any individual items with keys exceeding the key length limits. For a partition key, the limit is 2048 bytes and for a sort key, the limit is 1024 bytes.

export default class BatchWriteOperation<
	TS extends TableSchema,
	FT extends FlagType,
	CIT extends CommandInput,
	OT extends string,
> extends OperationFactory<TS, FT, CIT> {
	#CLONE_INSTANCE<
		OmitMethodName extends string,
		PartialCommand extends Partial<CommandInput>,
	>(newCommand: PartialCommand) {
		const { ddb, schema, flags, command: _command } = this
		const command = { ..._command, ...newCommand } as const
		const props = { ddb, schema, flags, command }
		type CT = typeof command
		type FT = typeof this.flags
		type _OT = OT | OmitMethodName
		return new BatchWriteOperation(props) as Omit<
			BatchWriteOperation<TS, FT, CT, _OT>,
			_OT
		>
	}

	// RequestItems: { (DeleteRequest: Key / PutRequest: Item)[] }
	// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/
	delete() {}
	put() {}

	/**
	 * Metadata Options to be returned in `response.metadata`
	 *
	 * @param {boolean} [options.metrics=false] - Item Collection Metrics
	 * - If `false`, returns nothing.
	 * - If `true`, returns statistics about item collections, if any, that were modified during the operation are returned in the response.
	 *
	 * @param {boolean } [options.consumedCapacity=false] - Throughput Consumption
	 * - If `false` - No ConsumedCapacity details are included in the response.
	 * - If `true` - The response includes only the aggregate ConsumedCapacity for the operation.
	 * - If `'INDEXES'` - The response includes the aggregate ConsumedCapacity for the operation, together with ConsumedCapacity for each table and secondary index that was accessed.
	 */
	metadata<
		MT extends boolean = false,
		CCT extends 'NONE' | 'TOTAL' | 'INDEXES' = 'NONE',
	>({
		metrics,
		consumedCapacity,
	}: {
		metrics?: MT
		consumedCapacity?: CCT
	}) {
		type $MT = MT extends true ? 'SIZE' : 'NONE'
		const params = {
			ReturnConsumedCapacity: (consumedCapacity ?? 'NONE') as CCT,
			ReturnItemCollectionMetrics: (metrics ? 'SIZE' : 'NONE') as $MT,
		}
		return this.#CLONE_INSTANCE<'metadata', typeof params>(params)
	}
}
