import type {
  DeleteCommandInput,
  DeleteCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import type { FlagType } from 'package/src/utils/OperationFactory'

import CompileConditionExpression from 'package/src/expressions/ConditionExpression'
import OperationErrorHandler from 'package/src/utils/OperationErrorHandler'
import OperationFactory from 'package/src/utils/OperationFactory'

type CommandInput = DeleteCommandInput

export default class DeleteOperation<
  TS extends TableSchema,
  FT extends FlagType,
  CIT extends CommandInput,
  OT extends string,
> extends OperationFactory<TS, FT, CIT> {
  #CLONE_INSTANCE<
    OmitMethodName extends string,
    PartialCommand extends Partial<CommandInput>,
  >(NewCommand: PartialCommand) {
    const { ddb, schema, flags, command: _command } = this
    const command = { ..._command, ...NewCommand } as const
    const props = { ddb, schema, flags, command }
    type CT = typeof command
    type FT = typeof this.flags
    type _OT = OT | OmitMethodName
    return new DeleteOperation(props) as Omit<
      DeleteOperation<TS, FT, CT, _OT>,
      _OT
    >
  }

  /**
   * A condition that must be satisfied in order for operation to succeed.
   *
   * Note - Subsequent call to this method shall replace the previous condition.
   *
   * @see {@link https://example.com/docs/expressions/conditional | Conditional Expression Docs}
   */
  ifCondition(expression: string) {
    const params = CompileConditionExpression(expression, this.schema.item)
    return this.#CLONE_INSTANCE<'ifCondition', typeof params>(params)
  }

  /**
   * Use this method if you want to get the item attributes as they appeared before they were deleted.
   *
   * Note - The values returned are strongly consistent and no RCUs are consumed.
   *
   * @param {boolean | "ON_CONDITION_FAILURE"} [value=true] -
   * - If `false`, returns nothing.
   * - If `true`, returns the old values if condition succeeds.
   * - If `"ON_CONDITION_FAILURE"`, returns the old values even if condition fails.
   */
  values<VT extends true | false | 'ON_CONDITION_FAILURE' = true>(
    values: VT = true as VT,
  ) {
    type RVT = VT extends true ? 'ALL_OLD' : 'NONE'
    type RVCFT = VT extends 'ON_CONDITION_FAILURE' ? 'ALL_OLD' : 'NONE'
    const params = {
      ReturnValues: (values ? 'ALL_OLD' : 'NONE') as RVT,
      ReturnValuesOnConditionCheckFailure: (values === 'ON_CONDITION_FAILURE'
        ? 'ALL_OLD'
        : 'NONE') as RVCFT,
    }
    return this.#CLONE_INSTANCE<'values', typeof params>(params)
  }

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
      .delete(this.command)
      .catch(OperationErrorHandler)
      .finally(() => {
        this.logger('Delete Operation Request: ', this.command)
        this.logger('Delete Operation Response: ', response)
      })
    if (!response) throw new Error('Unhandled Error')

    response.ItemCollectionMetrics

    const output = {
      data: this.flags.validate
        ? this.schema.validate(response.Attributes)
        : response.Attributes || null,
      metadata: {
        request: response.$metadata,
        metrics: response.ItemCollectionMetrics || null,
        consumedCapacity: response.ConsumedCapacity || null,
      },
    } as {
      data: ValidateValue extends true
        ? TS['_typings']['item']
        : TS['_typings']['item'] & Record<string, any>
      metadata: {
        request: DeleteCommandOutput['$metadata']
        metrics: CIT['ReturnItemCollectionMetrics'] extends 'SIZE'
          ? DeleteCommandOutput['ItemCollectionMetrics']
          : null
        consumedCapacity: CIT['ReturnConsumedCapacity'] extends
          | 'TOTAL'
          | 'INDEXES'
          ? DeleteCommandOutput['ConsumedCapacity']
          : null
      }
    }

    return output as ExcludeNullableProps<typeof output>
  }
}
