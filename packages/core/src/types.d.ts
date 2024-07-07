type SchemaItemType = Record<string, _DbFieldType>

type _DbFieldType =
	| undefined
	| boolean
	| string
	| number
	| _DbFieldType[]
	| { [key: string]: _DbFieldType }
// TODO: _DbFieldType = NativeAttributeValue (SEE DIFFERENCES AND INCORPORATE THEM)

type ExcludeNullableProps<T> = {
	[K in keyof T as Exclude<T[K], null> extends never
		? never
		: K]: T[K] extends object ? ExcludeNullableProps<T[K]> : T[K]
}
