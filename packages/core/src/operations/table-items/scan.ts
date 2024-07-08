import type { FlagType } from '@/utils/OperationFactory'
import type { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { ExtractSchemaAttributes } from '@/expressions/ProjectionExpression'

import CompileProjectionExpression from '@/expressions/ProjectionExpression'
import OperationErrorHandler from '@/utils/OperationErrorHandler'
import OperationFactory from '@/utils/OperationFactory'

type CommandInput = ScanCommandInput

export default class ScanOperation<
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
		return new ScanOperation(props) as Omit<ScanOperation<TS, FT, CT, _OT>, _OT>
	}

	// Segment
	// TotalSegments
	// FilterExpression

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
	 * Maximum number of items to evaluate (upto 1 MB). You can use the {@linkcode ScanOperation#next() | next()} method to fetch more items.
	 */
	limit<L extends number>(limit: L) {
		const params = { Limit: limit as L }
		return this.#CLONE_INSTANCE<'limit', typeof params>(params)
	}

	/**
	 * Start key to begin the scan. Use the {@linkcode ScanOperation#next() | next()} method to fetch more items.
	 */
	cursor(
		startKey: CIT['IndexName'] extends keyof TS['_types']['indices']
			? TS['_types']['indices'][CIT['IndexName']]
			: never,
	) {
		const params = { ExclusiveStartKey: startKey }
		return this.#CLONE_INSTANCE<'cursor', typeof params>(params)
	}

	/**
	 * Attributes to retrieve from the table. These attributes can include scalars, sets, or elements of a JSON document.
	 * If no attribute names are specified, then all attributes are returned. If any of the requested attributes are not found, they do not appear in the result.
	 *
	 * @param {object} props
	 *
	 * @param {string[]} props.attributes - A list of attributes to retrieve. Requires at-least one attribute.
	 *
	 * @param {string} props.select - A list of attributes to retrieve. Requires at-least one attribute.
	 * - If `ALL_ATTRIBUTES` - Returns all of the item attributes from the specified table or index.
	 * - If `SPECIFIC_ATTRIBUTES` - Returns only the attributes listed in ProjectionExpression.
	 * - If `ALL_PROJECTED_ATTRIBUTES` - (Only when index name is present) Retrieves all attributes that have been projected into the index.
	 * - If `COUNT` - Returns the number of matching items, rather than the matching items themselves.
	 *
		// If LSI and request only attributes that are projected into that index, the operation will read only the index and not the table. If any of the requested attributes are not projected into the local secondary index, DynamoDB fetches each of these attributes from the parent table. This extra fetching incurs additional throughput cost and latency.
		// If GSI, you can only request attributes that are projected into the index. Global secondary index queries cannot fetch attributes from the parent table.
		// If neither Select nor ProjectionExpression are specified, DynamoDB defaults to ALL_ATTRIBUTES when accessing a table, and ALL_PROJECTED_ATTRIBUTES when accessing an index. You cannot use both Select and ProjectionExpression together in a single request, unless the value for Select is SPECIFIC_ATTRIBUTES. (This usage is equivalent to specifying ProjectionExpression without any value for Select.)
		// If you use the ProjectionExpression parameter, then the value for Select can only be SPECIFIC_ATTRIBUTES. Any other value for Select will return an error.
   	*/
	values<
		ST extends
			| 'ALL_ATTRIBUTES'
			| 'SPECIFIC_ATTRIBUTES'
			| 'ALL_PROJECTED_ATTRIBUTES'
			| 'COUNT' = 'ALL_ATTRIBUTES',
	>({
		select,
		attributes,
	}: {
		select?: ST
		attributes?: [
			ExtractSchemaAttributes<TS['_types']['attributes']>,
			...ExtractSchemaAttributes<TS['_types']['attributes']>[],
		]
	}) {
		const projection = CompileProjectionExpression(
			attributes as string[],
			this.schema.item,
		)
		const params = { ...projection, Select: select }
		return this.#CLONE_INSTANCE<'metadata', typeof params>(params)
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
			.scan(this.command)
			.catch(OperationErrorHandler)
			.finally(() => {
				this.logger('Scan Operation Request: ', this.command)
				this.logger('Scan Operation Response: ', response)
			})
		if (!response) throw new Error('Unhandled Error')

		const output = {
			count: response.Count || null,
			// TODO: response.ScannedCount,
			data: this.flags.validate
				? this.schema.validate(response.Items)
				: response.Items || null,
			metadata: {
				request: response.$metadata,
				lastEvaluatedKey: response.LastEvaluatedKey,
				consumedCapacity: response.ConsumedCapacity || null,
			},
		} as {
			count: CIT['Select'] extends 'COUNT' ? number : null
			data: CIT['Select'] extends 'COUNT'
				? null
				: ValidateValue extends true
					? TS['_types']['item']
					: TS['_types']['item'] & Record<string, any>
			metadata: {
				request: ScanCommandOutput['$metadata']
				lastEvaluatedKey: ScanCommandOutput['LastEvaluatedKey']
				consumedCapacity: CIT['ReturnConsumedCapacity'] extends
					| 'TOTAL'
					| 'INDEXES'
					? NonNullable<ScanCommandOutput['ConsumedCapacity']>
					: null
			}
		}

		return {
			data: output as ExcludeNullableProps<typeof output>,
			eof: !response.LastEvaluatedKey,
			next: () => {
				const command = this.command
				command.ExclusiveStartKey = response.LastEvaluatedKey
				if (!response.LastEvaluatedKey) return null
				return this.execute({})
			},
		}
	}
}
