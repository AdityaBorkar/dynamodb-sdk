import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

/**
 * @private
 * @class OperationFactory - A class that provides a factory for creating operations
 */
export default class OperationFactory<
  TS extends TableSchema,
  FT extends FlagType,
  CT,
> {
  protected ddb: DynamoDBDocument
  protected schema: TS
  protected command: CT
  protected flags: FT

  constructor(props: {
    ddb: DynamoDBDocument
    schema: TS
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

  protected logger(...msgs: any[]) {
    if (!this.flags.verbose) return
    if (this.flags.verbose) {
      // console.log(...msgs)
    }
  }
}

export type FlagType = {
  verbose: boolean
  validate: boolean
}
