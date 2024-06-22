import type {
  ZodDiscriminatedUnion,
  ZodNumber,
  ZodObject,
  ZodString,
  ZodUnion,
} from 'zod'

import { z } from 'zod'

type TwoKeyRecord<K extends string, V> = { [P in K]: V } & {
  [P in string]: P extends K ? V : never
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
} & (K extends any ? ([K] extends [string] ? {} : never) : never)

type ZodObjectAny = ZodObject<any>

// The partition key of an item is also known as its hash attribute. The term hash attribute derives from the use of an internal hash function in DynamoDB that evenly distributes data items across partitions, based on their partition key values.
// The sort key of an item is also known as its range attribute. The term range attribute derives from the way DynamoDB stores items with the same partition key physically close together, in sorted order by the sort key value.
// Each table in DynamoDB has a quota of 20 global secondary indexes (default quota) and 5 local secondary indexes.

/**
 * Note: Asynchronous refinements or transforms are not supported.
 */
export default function createSchema_zod<
  KT extends TwoKeyRecord<string, ZodString | ZodNumber>, // TODO: Add Binary
  AT extends ZodObjectAny | [ZodObjectAny, ZodObjectAny, ...ZodObjectAny[]],
>($schema: {
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
  // :
  const keys = z.object($schema.keys as KT)
  const attributes = Array.isArray($schema.attributes)
    ? z.discriminatedUnion('attributes', $schema.attributes)
    : $schema.attributes
  const item = Array.isArray($schema.attributes)
    ? z.discriminatedUnion(
        'item',
        $schema.attributes.map(schema => schema.merge(keys)),
      )
    : $schema.attributes.merge(keys)
  // TODO - FIX IT

  const validate = (data: any) => item.safeParse(data)

  // const debug = null as unknown as z.infer<typeof item>

  const $typings = {
    // debug,
    keys: null as unknown as z.infer<typeof keys>,
    item: null as unknown as z.infer<typeof item>,
    attributes: null as unknown as z.infer<typeof attributes>,
    // item: null as unknown as T['keys'] & T['attributes'],
    // fields: null as unknown as z.infer<(typeof schemaTypings)['fields']>,
  }

  type ReturnType = TableSchema<KT, AT>
  return { keys, item, $typings, validate, attributes } satisfies ReturnType
}
