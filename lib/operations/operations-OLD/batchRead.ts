import type {
  BatchGetCommandInput,
  DynamoDBDocument,
} from '@aws-sdk/lib-dynamodb'

import getSstTableName from '../utils/getSstTableName'
import MethodBuilder from './MethodBuilder'
import CompileProjectionExpression from './compiler/ProjectionExpression'

// TODO: WORK ON STRUCTURE

export default class BatchReadOperation extends MethodBuilder<BatchGetCommandInput> {
  #limitToOneTable: boolean
  constructor(props: {
    ddb: DynamoDBDocument
    verbose: boolean
    schema: SchemaType
    limitToOneTable: boolean
  }) {
    const { ddb, verbose, schema, limitToOneTable } = props
    const command = { RequestItems: {} }
    super({ ddb, verbose, command, schema })
    this.#limitToOneTable = limitToOneTable
  }

  table(tableName: string) {
    // ! DO NOT ALLOW SAME TABLES TO GET REPEATED
    const TableName = getSstTableName(tableName)
    return { keys: (keys: KeyType[]) => this.#keys(TableName, keys) }
  }

  #keys(tableName: string, keys: KeyType[]) {
    if (this.command.RequestItems) {
      const ExistingRequest = this.command.RequestItems[tableName] ?? {}
      const ExistingKeys = ExistingRequest?.Keys ?? []
      this.command.RequestItems[tableName] = {
        ...ExistingRequest,
        Keys: [ExistingKeys, ...keys],
      }
    }
    return {
      ...(this.#limitToOneTable
        ? this
        : {
            metadata: this.metadata,
            verbose: this.verbose,
            execute: this.execute,
          }),
      values: (expression: string) => this.#values(tableName, expression),
      consistent: (read?: boolean) => this.#consistent(tableName, read),
    }
  }

  #consistent(tableName: string, read?: boolean) {
    if (!this.command.RequestItems?.[tableName])
      throw new Error('Internal Fatal Error')
    this.command.RequestItems[tableName].ConsistentRead = read || true
    return {
      ...this,
      values: (expression: string) => this.#values(tableName, expression),
      consistent: (read?: boolean) => this.#consistent(tableName, read),
    }
  }

  #values(tableName: string, expression: string) {
    if (!this.command.RequestItems?.[tableName])
      throw new Error('Internal Fatal Error')
    const schema = { ...this.schema.keys, ...this.schema.fields }
    const { ProjectionExpression, ExpressionAttributeNames } =
      CompileProjectionExpression(expression, schema)
    this.command.RequestItems[tableName] = {
      ...this.command.RequestItems[tableName],
      ExpressionAttributeNames,
      ProjectionExpression,
    }
    return {
      ...this,
      values: (expression: string) => this.#values(tableName, expression),
      consistent: (read?: boolean) => this.#consistent(tableName, read),
    }
  }

  metadata({
    consumedCapacity = 'NONE',
  }: {
    consumedCapacity?: 'NONE' | 'TOTAL' | 'INDEXES'
  }) {
    this.command.ReturnConsumedCapacity = consumedCapacity
    return this
  }

  async execute(props?: { verbose: boolean }) {
    this.flags.verbose = props?.verbose || this.flags.verbose
    if (this.flags.verbose)
      console.log('REQUEST Batch Read Operation: ', this.command)

    const response = await this.ddb.batchGet(this.command).then($data => {
      if (this.flags.verbose)
        console.log('RESPONSE Batch Read Operation: ', $data)

      const schema = this.itemSchema

      // TODO: DATA STRUCTURE CHECK:  $data.Attributes

      // $data.Responses
      // $data.UnprocessedKeys

      //       // Changing the Table Names:
      //       const success: Record<string, Record<string, any>[]> = {}
      //       for (const table in Responses) {
      //         const tableName = TableMap[table]
      //         if (!tableName) throw new Error('Table Name not found')
      //         success[tableName] = Responses[table]
      //       }
      //       const failure: Record<string, any> = {}
      //       for (const table in UnprocessedKeys) {
      //         const tableName = TableMap[table]
      //         if (!tableName) throw new Error('Table Name not found')
      //         failure[tableName] = UnprocessedKeys[table]
      //       }
      //       return { success, failure }

      return {
        data: $data.Attributes as typeof schema,
        metadata: {
          request: $data.$metadata,
          consumedCapacity: $data.ConsumedCapacity,
        },
      }
    })
    return response
  }
}
