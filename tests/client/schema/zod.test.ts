import { z } from 'zod'
import { ZodSchemaResolver } from '@/index'

import { expect, describe, it } from 'vitest'

describe('Schema Typings: Zod', () => {
  it('should validate zod schema', () => {
    // Example:
    const UserVerifiedSchema = z.object({
      name: z.string(),
      phone: z.number(),
      verified: z.literal(true),
    })
    const UserUnverifiedSchema = z.object({
      email: z.string(),
      phone: z.undefined(),
      verified: z.literal(false),
    })
    const OrderSchema = z.object({
      discount: z.number().optional(),
      total: z.number(),
    })

    OrderSchema.merge(UserVerifiedSchema.or(UserUnverifiedSchema))

    const table = ZodSchemaResolver({
      keys: { id: z.string(), timestamp: z.string() },
      attributes: UserVerifiedSchema, // [UserVerifiedSchema, UserUnverifiedSchema, OrderSchema],
    })

    const debug = table.$typings.attributes
    // expect(table).toEqual({})
    const hello = UserVerifiedSchema.or(UserUnverifiedSchema)

    expect(
      table.validate({
        name: 'Aditya Borkar',
        phone: 9820748096,
        verified: false,
      }),
    ).toEqual({
      success: false,
      error: {},
    })

    // expectTypeOf(schema).toEqualTypeOf<{}>()
    // type SchemaType = infer <typeof schema>
    // type userInfoType = z.infer<typeof userInfoSchema>;
  })
})
