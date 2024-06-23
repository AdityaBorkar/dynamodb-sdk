import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import TableOperationsPrototype from './utils/TableOperationsPrototype'

// TODO: Enable multi-zone and multi-account access
// TODO: Manage multiple instances

// TODO: Support: ArkType, Zod, Superstruct
// TODO: Measure Typescript Benchmark:
// https://github.com/arktypeio/arktype/tree/main/ark/attest
// https://www.youtube.com/watch?v=AEA0K77qhS4

// TODO: Make this method a singleton
// class MyClass {
//   constructor() {
//     if (MyClass._instance) {
//       throw new Error("Singleton classes can't be instantiated more than once.")
//     }
//     MyClass._instance = this

//     // ... Your rest of the constructor code goes after this
//   }
// }

/**
 * Create a DynamoDB Client
 */
export default function DynamoDbClient<
  DbSchema extends DbSchemaType,
  VerboseType extends boolean,
  ValidateType extends boolean,
  SchemalessType extends boolean,
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
  schemaless: SchemalessType
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

      const tableName = prop
      const schema = tableName in dbSchema ? dbSchema[tableName] : null
      if (!schema && !schemaless) throw 'Table is not defined in the schema'
      return TableOperationsPrototype({ ddb, flags, schema, tableName })
    },
  }

  const client = new Proxy(globalOps, handler)

  type globalOpsType = typeof globalOps
  type schemalessTableOpsType = SchemalessType extends true
    ? {
        [key: string]: ReturnType<
          typeof TableOperationsPrototype<any, typeof flags>
        >
      }
    : // biome-ignore lint/complexity/noBannedTypes: Allow empty object
      {}
  type tableOpsType = {
    [key in keyof DbSchema]: ReturnType<
      typeof TableOperationsPrototype<DbSchema[key], typeof flags>
    >
  } & schemalessTableOpsType

  return client as globalOpsType & tableOpsType
}
