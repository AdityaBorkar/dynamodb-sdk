import type { GetCommandInput, GetCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { ExtractSchemaAttributes } from '@/expressions/ProjectionExpression'
import type { FlagType } from '@/utils/OperationFactory'

import CompileProjectionExpression from '@/expressions/ProjectionExpression'
import OperationErrorHandler from '@/utils/OperationErrorHandler'
import OperationFactory from '@/utils/OperationFactory'

type CommandInput = GetCommandInput

export default class GetOperation<
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
		return new GetOperation(props) as Omit<GetOperation<TS, FT, CT, _OT>, _OT>
	}

	/**
	 * Attributes to retrieve from the table. These attributes can include scalars, sets, or elements of a JSON document.
	 * If no attribute names are specified, then all attributes are returned. If any of the requested attributes are not found, they do not appear in the result.
	 *
	 * @param {string[]} attributes - A list of attributes to retrieve. Requires at-least one attribute.
	 */
	values(
		attributes: [
			ExtractSchemaAttributes<TS['_types']['attributes']>,
			...ExtractSchemaAttributes<TS['_types']['attributes']>[],
		],
	) {
		const params = CompileProjectionExpression(
			attributes as string[],
			this.schema.item,
		)
		return this.#CLONE_INSTANCE<'metadata', typeof params>(params)
	}

	/**
	 * Determines the read consistency model
	 *
	 * @params {boolean} [read=true] -
	 * - If `true` - the operation uses strongly consistent reads.
	 * - If `false` - the operation uses eventually consistent reads.
	 */
	consistent(read?: boolean) {
		const params = { ConsistentRead: read ?? true }
		return this.#CLONE_INSTANCE<'consistent', typeof params>(params)
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

	/**
	 * Execute the operation.
	 *
	 * @throws {TODO} Documentation shall be added soon
	 */
	async execute<ValidateValue extends boolean = FT['validate']>({
		validate,
		verbose,
	}: {
		validate?: ValidateValue
		verbose?: boolean
	}) {
		this.flags.verbose ??= verbose ?? false
		this.flags.validate ??= validate ?? false

		const response = await this.ddb
			.get(this.command)
			.catch(OperationErrorHandler)
			.finally(() => {
				this.logger('Get Operation Request: ', this.command)
				this.logger('Get Operation Response: ', response)
			})
		if (!response) throw new Error('Unhandled Error')

		const output = {
			data: this.flags.validate
				? this.schema.validate(response.Item)
				: response.Item || null,
			metadata: {
				request: response.$metadata,
				consumedCapacity: response.ConsumedCapacity || null,
			},
		} as {
			data: ValidateValue extends true
				? TS['_types']['item']
				: TS['_types']['item'] & Record<string, any>
			metadata: {
				request: GetCommandOutput['$metadata']
				consumedCapacity: CIT['ReturnConsumedCapacity'] extends
					| 'TOTAL'
					| 'INDEXES'
					? NonNullable<GetCommandOutput['ConsumedCapacity']>
					: null
			}
		}

		return output as ExcludeNullableProps<typeof output>
	}
}
