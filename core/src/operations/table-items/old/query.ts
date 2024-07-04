import type { DynamoDBDocument, QueryCommandInput } from '@aws-sdk/lib-dynamodb'

import getSstTableName from '@/utils/getSstTableName'
import MethodBuilder from './MethodBuilder'
import CompileConditionExpression from './compiler/ConditionExpression'
import CompileProjectionExpression from './compiler/ProjectionExpression'

export default class QueryOperation extends MethodBuilder<QueryCommandInput> {
  constructor(props: {
    ddb: DynamoDBDocument
    tableName: string
    verbose: boolean
    schema: TableSchemaType
    indexName?: string
    condition: string
  }) {
    const { ddb, verbose, schema, tableName, indexName, condition } = props
    const TableName = getSstTableName(tableName)
    const {
      ConditionExpression: KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = CompileConditionExpression(condition, schema.keys)
    const command = {
      TableName,
      IndexName: indexName,
      KeyConditionExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    }
    super({ ddb, verbose, command, schema })
  }

  consistent(read?: boolean) {
    this.command.ConsistentRead = read || true
    return this
  }

  values(expression: string) {
    const { ProjectionExpression, ExpressionAttributeNames } =
      CompileProjectionExpression(expression, this.schema.item)
    this.command = {
      ...this.command,
      ProjectionExpression,
      ExpressionAttributeNames,
    }
    return this
  }

  /**
   * Filters are applied after returning all results. It only helps saving network bandwidth. You still pay for reads.
   * @param expression
   * @returns
   */
  filter(expression: string) {
    const {
      ConditionExpression: FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    } = CompileConditionExpression(expression, this.schema.fields)
    this.command = {
      ...this.command,
      FilterExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    }
    return this
  }

  // count() {}

  /**
   * Defaults: ALL_ATTRIBUTES when accessing a table, and ALL_PROJECTED_ATTRIBUTES when accessing an index
   * If values() is used, this defaults to "SPECIFIC_ATTRIBUTES". select() CANNOT BE USED THEN.
   * If all values are required from parent table, then use "ALL_ATTRIBUTES"
   */
  select() {
    // The attributes to be returned in the result. You can retrieve all item attributes, specific item attributes, the count of matching items, or in the case of an index, some or all of the attributes projected into the index.
    // ALL_PROJECTED_ATTRIBUTES - Allowed only when querying an index. Retrieves all attributes that have been projected into the index. If the index is configured to project all attributes, this return value is equivalent to specifying ALL_ATTRIBUTES.
    // If you query or scan a local secondary index and request only attributes that are projected into that index, the operation will read only the index and not the table. If any of the requested attributes are not projected into the local secondary index, DynamoDB fetches each of these attributes from the parent table. This extra fetching incurs additional throughput cost and latency.
    // If you query or scan a global secondary index, you can only request attributes that are projected into the index. Global secondary index queries cannot fetch attributes from the parent table.
  }

  limit(count: number) {
    this.command.Limit = count
    return this
  }

  reverse(reverse?: boolean) {
    this.command.ScanIndexForward = reverse === undefined ? false : !reverse
    return this
  }

  withStartKey(key: Record<string, string | number | 0 | 1>) {
    // = LastEvaluatedKey. Used for pagination
    this.command.ExclusiveStartKey = key
    return this
  }

  #next() {}

  metadata({
    consumedCapacity = 'NONE',
  }: { consumedCapacity?: 'NONE' | 'TOTAL' | 'INDEXES' }) {
    this.command.ReturnConsumedCapacity = consumedCapacity
    return this
  }

  async execute() {
    if (this.flags.verbose) console.log('REQUEST Get Operation: ', this.command)
    const response = await this.ddb.query(this.command).then(data => {
      if (this.flags.verbose) console.log('RESPONSE Get Operation: ', data)
      // TODO: Type Safety to the results returned from the parameter inputs.
      return data
    })
    // .catch(error => {
    //   // TODO: Pretty Return Errors
    // })

    return {
      response,
      cursor: response.LastEvaluatedKey,
      next: response.LastEvaluatedKey ? this.#next : undefined,
    }
  }
}

// function query<RT>(props: QueryProps) {
//   return ddb.query(_DbCommands.query(props)).then(res => ({
//     cursor: res.LastEvaluatedKey as RT,
//     items: (res.Items || []) as RT[],
//     count: res.Count as number,
//   }))
//   // .catch(ErrorHandler('QUERY'))
// }

// function query(props: QueryProps) {
//   const command = {
//     IndexName: props.index.name,
//     KeyConditionExpression: '#fieldName = :fieldValue',
//     ExpressionAttributeNames: {
//       '#fieldName': props.index.key,
//     },
//     ExpressionAttributeValues: {
//       ':fieldValue': props.index.value,
//     },
//     TableName: Resource[props.table].name,
//   } satisfies
//   return command
// }
