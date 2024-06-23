/**
 * @interal @private
 * Common Table Schema after resolving from Schema Builders:
 */
interface TableSchema {
  keys: Record<string, any> // TODO: Add Proper Type Defination
  item: Record<string, any> // TODO: Add Proper Type Defination
  attributes: Record<string, any> // TODO: Add Proper Type Defination
  _typings: {
    keys: any
    item: any
    attributes: any
  }
  validate: (data: any) =>
    | {
        success: false
        error: ZodError
      }
    | {
        success: true
        data: any // TODO: Add Proper Type Defination
      }
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
