type SchemaType = {
  keys: SchemaKeyType
  fields: SchemaItemType
}

type SchemaKeyType = Record<string, string | number>

type SchemaItemType = Record<string, _DbFieldType>

type _DbFieldType =
  | undefined
  | boolean
  | string
  | number
  | _DbFieldType[]
  | { [key: string]: _DbFieldType }

// ---

export type ExcludeNullableProps<T> = {
  [K in keyof T as Exclude<T[K], null> extends never
    ? never
    : K]: T[K] extends object ? ExcludeNullableProps<T[K]> : T[K]
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AnyObject = Record<string, any>

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type EmptyObject = {}
