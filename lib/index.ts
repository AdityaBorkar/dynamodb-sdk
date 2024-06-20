import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import SchemaPrototype from './utils/SchemaPrototype'
import TableOperationsPrototype from './utils/TableOperationsPrototype'

type RegionCodes = 'ap-south-1'
type DbSchemaType = Record<string, SchemaType>

// TODO: Make this method a singleton

export default function CreateDatabaseClient<
  DbSchema extends DbSchemaType,
  VerboseType extends boolean,
  ValidateType extends boolean,
>({
  region,
  dbSchema,
  maxAttempts,
  verbose,
  validate,
}: {
  region: RegionCodes
  dbSchema: DbSchema
  verbose: VerboseType
  validate: ValidateType
  maxAttempts: number
}) {
  const ddb_client = new DynamoDBClient({ region, maxAttempts })
  const ddb = DynamoDBDocument.from(ddb_client)
  // TODO: Check if connection was successful

  const flags = { verbose, validate } as const
  const tables = {
    // TODO: ADD get () {} that can call any of the tableName even if not exists and the call this goes ahead, only with a verbose output.
  } as {
    [key in keyof DbSchema]: ReturnType<
      typeof TableOperationsPrototype<DbSchema[key], typeof flags>
    >
  }
  for (const tableName of Object.keys(dbSchema)) {
    const tableSchema = dbSchema[tableName]
    const schema = new SchemaPrototype(tableSchema)
    const props = { ddb, flags, schema, tableName }
    // @ts-expect-error
    tables[tableName] = TableOperationsPrototype<typeof tableSchema>(props)
  }

  const GlobalOperations = {
    // TODO: batchGet batchWrite transact
  }

  return { ...GlobalOperations, ...tables }
}
