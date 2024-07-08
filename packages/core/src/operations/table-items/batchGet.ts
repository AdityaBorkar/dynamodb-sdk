import type { FlagType } from '@/utils/OperationFactory'
import type {
	BatchGetCommandInput,
	BatchGetCommandOutput,
} from '@aws-sdk/lib-dynamodb'

import OperationFactory from '@/utils/OperationFactory'

type CommandInput = BatchGetCommandInput

// TODO: Single operation has a limit of 100 items.
// If you request more than 100 items, BatchGetItem returns a ValidationException with the message "Too many items requested for the BatchGetItem call."
// CATCH: ValidationException ProvisionedThroughputExceededException
// CATCH: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.Errors.html#BatchOperations

export default class BatchGetOperation<
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
		return new BatchGetOperation(props) as Omit<
			BatchGetOperation<TS, FT, CT, _OT>,
			_OT
		>
	}

	get(props: {
		// TODO: tableName cannot be repeated
		tableName: string
		keys: string[]
		projection?: string[]
		consistentRead?: boolean
	}) {
		// RequestItems: { Keys ConsistentRead ProjectionExpression ExpressionAttributeNames }
		// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchGetItemCommand/
	}

	/**
	 * Metadata Options to be returned in `response.metadata`
	 *
	 * @param {boolean} [options.consumedCapacity=false] - Throughput Consumption
	 * - If `false` - No ConsumedCapacity details are included in the response.
	 * - If `true` - The response includes only the aggregate ConsumedCapacity for the operation.
	 * - If `'INDEXES'` - The response includes the aggregate ConsumedCapacity for the operation, together with ConsumedCapacity for each table and secondary index that was accessed.
	 */
	metadata<CCT extends 'NONE' | 'TOTAL' | 'INDEXES' = 'NONE'>({
		consumedCapacity,
	}: {
		consumedCapacity?: CCT
	}) {
		const params = {
			ReturnConsumedCapacity: (consumedCapacity ?? 'NONE') as CCT,
		}
		return this.#CLONE_INSTANCE<'metadata', typeof params>(params)
	}
}
