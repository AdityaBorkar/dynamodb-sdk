import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import TableOperationsPrototype from './utils/TableOperationsPrototype'

// TODO: Enable multi-zone and multi-account access
// TODO: Manage multiple instances even in schemaless
// TODO: Make this method a singleton
// class MyClass {
//   constructor() {
//     if (MyClass._instance)
//       throw new Error("Singleton classes can't be instantiated more than once.")
//     MyClass._instance = this
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

	type flagsType = typeof flags
	type globalOpsType = typeof globalOps
	type schemalessTableOpsType = SchemalessType extends true
		? {
				[key: string]: ReturnType<
					typeof TableOperationsPrototype<any, flagsType>
				>
			}
		: // biome-ignore lint/complexity/noBannedTypes: Allow empty object
			{}
	type tableOpsType = {
		[key in keyof DbSchema]: ReturnType<
			typeof TableOperationsPrototype<DbSchema[key], flagsType>
		>
	} & schemalessTableOpsType

	const client = new Proxy(globalOps, {
		get: <T extends string>(
			target: globalOpsType,
			prop: T,
			receiver: T extends keyof globalOpsType ? globalOpsType[T] : any,
		) => {
			if (prop in target) return Reflect.get(target, prop, receiver)

			const tableName = prop
			const schema = tableName in dbSchema ? dbSchema[tableName] : null
			if (!schema && !schemaless) throw 'Table is not defined in the schema'
			// @ts-expect-error `schema` can be null. Need to fix this.
			return TableOperationsPrototype({ ddb, flags, schema, tableName })
		},
	})

	return client as globalOpsType & tableOpsType
}
