/**
 * @interal @private
 * Common Table Schema after resolving from Schema Builders:
 */
interface TableSchema {
	// TODO: Add Proper Type Defination
	keys: Record<string, any>
	item: Record<string, any>
	attributes: Record<string, any>
	_typings: {
		keys: any
		item: any
		attributes: any
		indices: Record<string, Record<string, any>>
	}
	validate: (
		data: any | any[],
	) => { error: any[]; data: any[] } | { error: any; data: any }
}

/**
 * @interal @private
 * Common Database Schema after resolving from Schema Builders:
 * TODO: Enforce tableName restrictions on `string`
 */
type DbSchemaType = Record<string, TableSchema>

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
