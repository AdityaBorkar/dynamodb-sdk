/**
 * @interal @private
 * Standard Table Schema after resolving from Schema Builders:
 */
interface TableSchema {
	// TODO: Add Proper Type Defination
	keys: Record<string, any>
	item: Record<string, any>
	attributes: Record<string, any>
	validate: (
		data: any | any[],
	) => { error: any[]; data: any[] } | { error: any; data: any }
	_types: {
		keys: any
		item: any
		attributes: any
		indices: Record<string, Record<string, any>>
	}
}

/**
 * @interal @private
 * Standard Database Schema after resolving from Schema Builders:
 * TODO: Enforce tableName restrictions on `string`
 */
type DbSchemaType = Record<string, TableSchema>

/**
 * @interal @private
 * Standard Error Type:
 */
type ValidationError = z.ZodError<any>

// ------------------------------

// Utility Types:

type TwoKeyRecord<K extends string, V> = { [P in K]: V } & {
	[P in string]: P extends K ? V : never
	// biome-ignore lint/complexity/noBannedTypes: `{}` is an exception
} & (K extends any ? ([K] extends [string] ? {} : never) : never)

type MaxKeys<
	T,
	Max extends number,
	Count extends any[] = [],
> = Count['length'] extends Max ? T : T & { [key: string]: any }
