import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import type SchemaPrototype from './SchemaPrototype'

/**
 * @private
 * @class OperationBuilder - A class that provides a builder for creating operations
 * THIS CLASS IS NOT IMPLEMENTED YET. IT IS A WORK IN PROGRESS.
 * TODO: Add all functions used to create a method and then just call the method and construct objects.
 */
export default class OperationBuilder<
  ST extends TableSchemaType,
  FT extends FlagType,
  CT,
> {
  protected ddb: DynamoDBDocument
  protected schema: SchemaPrototype<ST>
  protected command: CT
  protected flags: FT

  constructor(props: {
    ddb: DynamoDBDocument
    schema: SchemaPrototype<ST>
    command: CT
    flags: FT
  }) {
    const { ddb, command, schema, flags } = props
    this.command = command
    this.schema = schema
    this.flags = flags
    this.ddb = ddb
  }

  public verbose(verbose?: boolean) {
    this.flags.verbose = verbose ?? true
    return this
  }
}

export type FlagType = {
  verbose: boolean
  validate: boolean
}
