import type { DynamoDBDocument, ScanCommandInput } from '@aws-sdk/lib-dynamodb'

import getSstTableName from '../utils/getSstTableName'
import MethodBuilder from './MethodBuilder'
import CompileConditionExpression from './compiler/ConditionExpression'
import CompileProjectionExpression from './compiler/ProjectionExpression'

export default class ScanOperation extends MethodBuilder<ScanCommandInput> {
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
    const command = { TableName, IndexName: indexName }
    super({ ddb, verbose, command, schema })
  }

  consistent(read?: boolean) {
    this.command.ConsistentRead = read || true
    return this
  }

  values(expression: string) {
    const { ProjectionExpression, ExpressionAttributeNames } =
      CompileProjectionExpression(expression, this.schema.item)
    this.command.ProjectionExpression = ProjectionExpression
    this.command.ExpressionAttributeNames = ExpressionAttributeNames
    return this
  }

  filter(expression: string) {
    // A string that contains conditions that DynamoDB applies after the Query operation, but before the data is returned to you. Items that do not satisfy the FilterExpression criteria are not returned.
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

  withStartKey(key: Record<string, string | number | 0 | 1>) {
    // = LastEvaluatedKey. Used for pagination
    this.command.ExclusiveStartKey = key
    return this
  }

  #next() {}

  parallel(segments: number) {
    if (segments <= 1 || segments >= 1000000)
      throw new Error('Segments must be greater than 1 and less than 1000000')
    // For a parallel Scan request, Segment identifies an individual segment to be scanned by an application worker.
    // Segment IDs are zero-based, so the first segment is always 0. For example, if you want to use four application threads to scan a table or an index, then the first thread specifies a Segment value of 0, the second thread specifies 1, and so on.
    // The value of LastEvaluatedKey returned from a parallel Scan request must be used as ExclusiveStartKey with the same segment ID in a subsequent Scan operation.
    // The value for Segment must be greater than or equal to 0, and less than the value provided for TotalSegments.
    // Segment
    // TotalSegments
  }

  metadata({
    consumedCapacity = 'NONE',
  }: {
    consumedCapacity?: 'NONE' | 'TOTAL' | 'INDEXES'
  }) {
    this.command.ReturnConsumedCapacity = consumedCapacity
    return this
  }

  // async execute() {
  //   if (this.verboseEnabled)
  //     console.log('REQUEST Get Operation: ', this.command)
  //   const response = await this.ddb
  //     .scan(this.command)
  //     .then(data => {
  //       if (this.verboseEnabled) console.log('RESPONSE Get Operation: ', data)
  //       // TODO: Type Safety to the results returned from the parameter inputs.
  //       return data
  //     })
  //     .catch(error => {
  //       // TODO: Pretty Return Errors
  //     })

  //   return response
  // }
}

// type ScanProps = {
//   tableName: TableType
//   where?: [ConditionType, ...ConditionType[]]
// }

// export function scan<RT>(props: ScanProps) {
//   const FilterExpressions: any = []
//   const ExpressionAttributeNames: Record<string, string> = {}
//   const ExpressionAttributeValues: Record<string, any> = {}

//   if (!props.where) throw new Error('SCAN REQUIRES WHERE CLAUSE')

//   for (const condition of props.where) {
//     const operator = condition.op === 'equal' ? '=' : '>'

//     const SanitizedFieldNames = SanitizeFieldNames(condition.name)
//     if (!SanitizedFieldNames) continue
//     const AttrName = SanitizedFieldNames.Expression
//     const AttrNames = SanitizedFieldNames.AttrNames
//     const AttrValue = `:value${FilterExpressions.length}`

//     Object.assign(ExpressionAttributeNames, AttrNames)
//     FilterExpressions.push(`${AttrName} ${operator} ${AttrValue}`)
//     ExpressionAttributeValues[AttrValue] = condition.value
//   }

//   const command = (
//     Object.keys(ExpressionAttributeNames).length
//       ? {
//           TableName: Resource[props.tableName].name,
//           FilterExpression: FilterExpressions.join(' AND '), // TODO: Support more operators
//           ExpressionAttributeNames: ExpressionAttributeNames,
//           ExpressionAttributeValues: ExpressionAttributeValues,
//         }
//       : { TableName: Resource[props.tableName].name }
//   ) satisfies ScanCommandInput

//   return ddb
//     .scan(command)
//     .then(res => ({
//       cursor: res.LastEvaluatedKey as RT,
//       items: (res.Items || []) as RT[],
//       count: res.Count as number,
//     }))
//     .catch(ErrorHandler('SCAN'))
// }
