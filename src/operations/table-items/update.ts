import type {
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import type { FlagType } from '@/utils/OperationFactory'

import CompileConditionExpression from '@/expressions/ConditionExpression'
import OperationErrorHandler from '@/utils/OperationErrorHandler'
import OperationFactory from '@/utils/OperationFactory'
import EvaluateUpdateExpression from '@/expressions/UpdateExpression'

type CommandInput = UpdateCommandInput

type UpdateDataOps<RT> = {
  delete: () => { $delete: true }
} & {
  createIfNotExists: (value: RT) => { $createIfNotExists: RT }
} & (RT extends number
    ? { $add: number } | { $subtract: number }
    : RT extends any[]
      ? { $push: RT } | { $unshift: RT }
      : // biome-ignore lint/complexity/noBannedTypes: <explanation>
        {})

type UpdateDataInput<T> = {
  [K in keyof T]?:
    | T[K]
    | UpdateDataInput<T[K]>
    | ((
        // TODO: THERE CAN BE MULTIPLE OPERATIONS FOR A SINGLE VARIABLE
        $: UpdateDataOps<T[K]>,
      ) =>
        | { $delete: true }
        | { $add: number }
        | { $subtract: number }
        | { $push: T[K] }
        | { $unshift: T[K] }
        | { $createIfNotExists: T[K] })
}

export default class UpdateOperation<
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
    return new UpdateOperation(props) as Omit<
      UpdateOperation<TS, FT, CT, _OT>,
      _OT
    >
  }

  /**
   * TODO: Write docs
   * Adds one or more attributes to an item. If any of these attributes already exists, they are overwritten by the new values.
   */
  data(
    command: UpdateDataInput<TS['_typings']['attributes']>,
    options?: { merge?: boolean | { array: boolean; object: boolean } },
  ) {
    const params = EvaluateUpdateExpression(command, this.schema.item, options)
    return this.#CLONE_INSTANCE<'data', typeof params>(params)
  }

  // delete(
  //   attributes: [
  //     ExtractSchemaAttributes<TS['_typings']['attributes']>,
  //     ...ExtractSchemaAttributes<TS['_typings']['attributes']>[],
  //   ],
  // ) {
  //   // TODO: DELETE THESE ATTRIBUTES
  //   // TODO: CHECK IF ATTRIBUTES ARE PRESENT.
  //   // const params = EvaluateUpdateExpression(command, this.schema.item)
  //   const params = {
  //     UpdateExpression: 'DELETE ' + attributes.join(', '),
  //   }
  //   // TODO: RESOLVE as REMOVE
  //   return this.#CLONE_INSTANCE<'data', typeof params>(params)
  // }

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
   * TODO: CLEAN AND UNIFORMITY + DOCS
   * Use this method if you want to get the item attributes as they appeared before they were updated.
   *
   * Note - The values returned are strongly consistent and no RCUs are consumed.
   *
   * @param {"NONE" | "ALL_OLD" | "UPDATED_OLD" | "ALL_NEW" | "UPDATED_NEW" | "ON_CONDITION_FAILURE"} [value="NONE"] -
   * - `"NONE"` - returns nothing
   * - `"UPDATED_OLD"` - only the updated attributes, as they appeared before the UpdateItem operation.
   * - `"UPDATED_NEW"` - only the updated attributes, as they appear after the UpdateItem operation.
   * - `"ALL_OLD"` - all of the attributes of the item, as they appeared before the UpdateItem operation.
   * - `"ALL_NEW"` - all of the attributes of the item, as they appear after the UpdateItem operation.
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
      .update(this.command)
      .catch(OperationErrorHandler)
      .finally(() => {
        this.logger('Update Operation Request: ', this.command)
        this.logger('Update Operation Response: ', response)
      })
    if (!response) throw new Error('Unhandled Error')

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
      data: CIT['ReturnValues'] extends 'ALL_OLD'
        ? ValidateValue extends true
          ? TS['_typings']['item']
          : TS['_typings']['item'] & Record<string, any>
        : null
      metadata: {
        request: UpdateCommandOutput['$metadata']
        metrics: CIT['ReturnItemCollectionMetrics'] extends 'SIZE'
          ? UpdateCommandOutput['ItemCollectionMetrics']
          : null
        consumedCapacity: CIT['ReturnConsumedCapacity'] extends
          | 'TOTAL'
          | 'INDEXES'
          ? UpdateCommandOutput['ConsumedCapacity']
          : null
      }
    }

    return output as ExcludeNullableProps<typeof output>
  }
}
