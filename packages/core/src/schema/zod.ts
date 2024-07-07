import type { ExtractSchemaAttributes } from '@/expressions/ProjectionExpression'
import type { ZodNumber, ZodObject, ZodString, ZodUnion } from 'zod'

import { z } from 'zod'

// TODO: Make sure Typescript proerties are validated by JS functions

// TODO: Attribute Name Type Checking
// You can use any attribute name in a document path as long as they meet these requirements:
// - The attribute name must begin with a pound sign (#)
// - The first character is a-z or A-Z and or 0-9
// - The second character (if present) is a-z, A-Z

type ZodObjectAny = ZodObject<any>

type LSI<
	AT extends ZodObjectAny | [ZodObjectAny, ZodObjectAny, ...ZodObjectAny[]],
> = {
	// TODO: hashKey & sortKey must not be the same
	hashKey: ExtractSchemaAttributes<z.infer<AT>>
	sortKey?: ExtractSchemaAttributes<z.infer<AT>>
	// TODO: projection attributes must not contain keys
	projection: 'KEYS' | 'ALL' | ExtractSchemaAttributes<z.infer<AT>>[]
}

type GSI<
	AT extends ZodObjectAny | [ZodObjectAny, ZodObjectAny, ...ZodObjectAny[]],
> = {
	// TODO: hashKey & sortKey must not be the same
	hashKey: ExtractSchemaAttributes<z.infer<AT>>
	sortKey?: ExtractSchemaAttributes<z.infer<AT>>
	// TODO: projection attributes must not contain keys
	projection: 'KEYS' | 'ALL' | ExtractSchemaAttributes<z.infer<AT>>[]
	// TODO: Throughput
}

/**
 * We support only a subset of Zod and we request you to import that from `dynamodb-sdk-resolvers` package.
 * In the future, we shall support more Zod types and allow imports from Zod directly.
 * Note: Asynchronous refinements or transforms are not supported.
 * @params schema - Zod Object
 * @params schema.keys - Zod Object
 * @params schema.attributes - Zod Object
 * @params schema.indices - Zod Object
 *
 */
export default function createSchema_zod<
	KT extends TwoKeyRecord<string, ZodString | ZodNumber>, // TODO: Add Binary
	AT extends ZodObjectAny | [ZodObjectAny, ZodObjectAny, ...ZodObjectAny[]],
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	LSIT extends Record<string, LSI<AT>> = {},
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	GSIT extends Record<string, GSI<AT>> = {},
>(schema: {
	keys: KT
	attributes: AT
	// TODO: Limit LSI to 5
	lsi?: LSIT
	// TODO: Limit GST to 20 (this quota can be increased)
	gsi?: GSIT
	// TODO: The total count of attributes provided in `projection` summed across all of the secondary (both - lsi & gsi) indexes, must not exceed 100
}) {
	const keys = z.object(schema.keys as KT)

	const attributes = (
		Array.isArray(schema.attributes)
			? z.union(schema.attributes)
			: schema.attributes
	) as AT extends ZodObjectAny ? AT : ZodUnion<AT>

	const item = Array.isArray(schema.attributes) // TODO: Add Proper Type Defination for item
		? z.union(schema.attributes.map(schema => schema.merge(keys)))
		: schema.attributes.merge(keys)

	const validate = (data: any | any[]) => {
		// TODO: Covert ZodError to standard error

		type DataType = typeof _typings.item
		if (!Array.isArray(data)) {
			const result = item.safeParse(data)
			return {
				error: result.error,
				data: result.data as DataType,
			}
		}

		type ValidationResult = {
			error: z.ZodError<any>[]
			data: DataType[]
		}
		const result: ValidationResult = { data: [], error: [] }
		for (const d of data) {
			const res = item.safeParse(d) as DataType
			if (res.success) result.data.push(res.data)
			else result.error.push(res.error)
		}
		return result
	}

	// Types:
	type KeysType = z.infer<typeof keys>
	type AttributesType = z.infer<typeof attributes>
	type ItemType = KeysType & AttributesType

	type LsiKeys<IndexType extends Record<string, LSI<AT>>> = {
		[indexName in keyof IndexType]-?: {
			[key in IndexType[indexName]['hashKey']]: NonNullable<ItemType[key]>
		} & {
			[key in IndexType[indexName]['sortKey']]: NonNullable<ItemType[key]>
		}
	}
	type GsiKeys<IndexType extends Record<string, GSI<AT>>> = {
		[indexName in keyof IndexType]-?: {
			[key in IndexType[indexName]['hashKey']]: NonNullable<ItemType[key]>
		} & {
			[key in IndexType[indexName]['sortKey']]: NonNullable<ItemType[key]>
		}
	}

	const _typings = {
		item: null as unknown as ItemType,
		keys: null as unknown as KeysType,
		attributes: null as unknown as AttributesType,
		indices: null as unknown as LsiKeys<LSIT> & GsiKeys<GSIT>,
	}

	return {
		/**
		 * Zod schema for table keys
		 */
		keys,
		/**
		 * Zod schema for table attributes (except keys)
		 */
		attributes,
		/**
		 * Zod schema for table item
		 */
		item,
		/**
		 * Zod schema validation function for table item
		 */
		validate,
		/**
		 * @private @internal
		 * Exclusive for internal type inference and are not meant to be used directly.
		 */
		_typings,
	}
}
