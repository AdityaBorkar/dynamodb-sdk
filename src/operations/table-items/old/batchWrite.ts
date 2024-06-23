import type {
  BatchWriteCommandInput,
  DynamoDBDocument,
} from '@aws-sdk/lib-dynamodb'

import MethodBuilder from './MethodBuilder'
export default class BatchWriteOperation extends MethodBuilder<BatchWriteCommandInput> {
  #limitToOneTable: boolean
  constructor(props: {
    ddb: DynamoDBDocument
    verbose: boolean
    schema: TableSchemaType
    limitToOneTable: boolean
  }) {
    const { ddb, verbose, schema, limitToOneTable } = props
    const command = { RequestItems: {} }
    super({ ddb, verbose, command, schema })
    this.#limitToOneTable = limitToOneTable
  }
}
