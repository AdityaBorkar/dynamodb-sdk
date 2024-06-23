import { z } from 'zod'

import type { ZodNumber, ZodObject, ZodString, ZodUnion } from 'zod'
type ZodObjectAny = ZodObject<any>

// TODO: Each table in DynamoDB has a quota of 20 global secondary indexes (default quota) and 5 local secondary indexes.
// TODO: How to separate Hash Key and Sort Key?

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
>(schema: {
  keys: KT
  attributes: AT
  indices?: {
    [indexName: string]: TwoKeyRecord<string, ZodString | ZodNumber> & {
      type: 'local' | 'global'
    }
    // global?: {
    //   [indexName: string]: TwoKeyRecord<string, ZodString | ZodNumber>
    // }
    // local?: {
    //   [indexName: string]: TwoKeyRecord<string, ZodString | ZodNumber>
    // }
  }
}) {
  const keys = z.object(schema.keys as KT)

  const attributes = (
    Array.isArray(schema.attributes)
      ? z.union(schema.attributes)
      : schema.attributes
  ) as AT extends ZodObjectAny ? AT : ZodUnion<AT> // TODO: Prevent use of 'as'

  const item = Array.isArray(schema.attributes) // TODO: Add Proper Type Defination for item
    ? z.union(schema.attributes.map(schema => schema.merge(keys)))
    : schema.attributes.merge(keys)

  const validate = (data: any) => item.safeParse(data) //  as typeof $typings.item

  const _typings = {
    keys: null as unknown as z.infer<typeof keys>,
    attributes: null as unknown as z.infer<typeof attributes>,
    item: null as unknown as z.infer<typeof keys> & z.infer<typeof attributes>,
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
