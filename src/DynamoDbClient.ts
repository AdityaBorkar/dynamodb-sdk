import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

import SchemaPrototype from './utils/SchemaPrototype'
import TableOperationsPrototype from './utils/TableOperationsPrototype'

type DbSchemaType = Record<string, SchemaType>

// TODO: Import Pre-build schemas from plugins
// TODO: Multiple Schema for single table (with type narrowing)
// TODO: Enable multi-zone and multi-account access
// TODO: Manage multiple instances
// TODO: Make this method a singleton
// TODO: Support: ArkType, Zod, Superstruct
// TODO: Measure Typescript Benchmark:
// https://github.com/arktypeio/arktype/tree/main/ark/attest
// https://www.youtube.com/watch?v=AEA0K77qhS4

export default function DynamoDbClient<
  DbSchema extends DbSchemaType,
  VerboseType extends boolean,
  ValidateType extends boolean,
>({
  region,
  dbSchema,
  maxAttempts,
  verbose,
  validate,
  schemaless,
}: {
  region: AwsRegion
  dbSchema: DbSchema
  verbose: VerboseType
  validate: ValidateType
  maxAttempts: number
  schemaless: boolean
}) {
  const ddb_client = new DynamoDBClient({ region, maxAttempts })
  const ddb = DynamoDBDocument.from(ddb_client)
  // TODO: Check if connection was successful

  const flags = { verbose, validate } as const

  const globalOps = {
    batchGet: () => {},
    batchWrite: () => {},
    transactGet: () => {},
    transactWrite: () => {},
  }
  type globalOpsType = typeof globalOps
  type tableOpsType = {
    // TODO: Allow undefined table names
    [key in keyof DbSchema]: ReturnType<
      typeof TableOperationsPrototype<DbSchema[key], typeof flags>
    >
  }

  const handler = {
    get: <T extends string>(
      target: globalOpsType,
      prop: T,
      receiver: T extends keyof globalOpsType ? globalOpsType[T] : any,
    ) => {
      //   T extends keyof globalOpsType
      //   ? ReturnType<(typeof globalOps)[T]>
      //   : ReturnType<typeof TableOperationsPrototype<DbSchema[T], typeof flags>>

      if (prop in target) return Reflect.get(target, prop, receiver)

      const tableName = prop // as keyof DbSchema
      const schema = tableName in dbSchema ? dbSchema[tableName] : null
      if (!schema) throw 'Table is not defined in the schema' // TODO: Override and allow access
      return TableOperationsPrototype({ ddb, flags, schema, tableName })
    },
  }

  const client = new Proxy(globalOps, handler)
  return client as globalOpsType & tableOpsType
}
