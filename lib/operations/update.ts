import type {
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import type { FlagType } from '../utils/OperationFactory'
import type SchemaPrototype from '../utils/SchemaPrototype'
import type { AnyObject, ExcludeNullableProps, _DbFieldType } from './types'

import CompileConditionExpression from '../expressions/ConditionExpression'
import OperationErrorHandler from '../utils/OperationErrorHandler'
import OperationFactory from '../utils/OperationFactory'

type CommandInput = UpdateCommandInput

export default class UpdateOperation<
  ST extends SchemaType,
  FT extends FlagType,
  CIT extends CommandInput,
  OT extends string,
> extends OperationFactory<ST, FT, CIT> {
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
      UpdateOperation<ST, FT, CT, _OT>,
      _OT
    >
  }

  // TODO: COMMA SEPARATED

  /**
   * Adds one or more attributes to an item. If any of these attributes already exists, they are overwritten by the new values.
   * You can also use SET to add or subtract from an attribute that is of type Number. Example: SET myNum = myNum + :val
   */
  data(
    c: SchemaPrototype<ST>['fields'],
    command: {
      [attribute: string]:
        | { $action: 'APPEND_LIST'; $value: (string | number | boolean)[] } // TODO: extends [] ?
        | { $action: 'ADD' | 'SUBTRACT'; $value: number } // TODO: extends number ?
        | (
            | { $action: 'CREATE_IF_NOT_EXISTS'; $value: _DbFieldType }
            | { $action: 'DELETE' }
            | _DbFieldType
          )
    },
  ) {
    // ...
  }

  /**
   * Adds the specified value to the item, if the attribute does not already exist. If the attribute already exists, the behavior of ADD depends on the attribute's data type:
   * - If the attribute is a number, and the value you are adding is also a number, Arithmetic operation occurs withb default value as 0.
   * - If the attribute is a set, and the value you are adding is also a set, the value is appended to the existing set.
   * TODO: ADD can only be used on top-level attributes, not nested attributes.
   * TODO: Merge with the above
   */
  add(command: {
    [attribute: string]: (string | number | boolean)[] | number
  }) {
    //     add-action ::=
    //     path value
  }

  /**
   * Removes one or more attributes from an item.
   * TODO: TRY TO MERGE BOTH of them:
   */
  remove(command: {
    [attribute: string]: (string | number | boolean)[]
  }) {}

  /**
   * Removes one or more elements from a set.
   * TODO: Specifying an empty set is an error
   * TODO: DELETE can only be used on top-level attributes, not nested attributes.
   */
  delete(command: {
    [attribute: string]: (string | number | boolean)[]
  }) {
    // DELETE Color :p
    // :p = {"SS": ["Yellow", "Purple"]}
  }

  // You can have many actions in a single expression, such as the following: SET a=:value1, b=:value2 DELETE :value3, :value4, :value5

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

  // TODO: CLEAN AND UNIFORMITY + DOCS
  /**
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
        if (!this.flags.verbose) return
        console.log('Update Operation Request: ', this.command)
        console.log('Update Operation Response: ', response)
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
          ? SchemaPrototype<ST>['item']
          : SchemaPrototype<ST>['item'] & AnyObject
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
