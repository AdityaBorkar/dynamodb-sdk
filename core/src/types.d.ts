type SchemaItemType = Record<string, _DbFieldType>

type _DbFieldType =
  | undefined
  | boolean
  | string
  | number
  | _DbFieldType[]
  | { [key: string]: _DbFieldType }

type ExcludeNullableProps<T> = {
  [K in keyof T as Exclude<T[K], null> extends never
    ? never
    : K]: T[K] extends object ? ExcludeNullableProps<T[K]> : T[K]
}
