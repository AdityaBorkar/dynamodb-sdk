import { z } from 'zod'
import { ZodSchemaResolver } from '@/index'

import { expect, describe, it } from 'vitest'

// describe('', () => {
//   // Schemas:
//   const UserVerifiedSchema = z.object({
//     name: z.string(),
//     phone: z.number(),
//     verified: z.literal(true),
//   })
//   const UserUnverifiedSchema = z.object({
//     email: z.string(),
//     phone: z.undefined(),
//     verified: z.literal(false),
//   })
//   const OrderSchema = z.object({
//     discount: z.number().optional(),
//     total: z.number(),
//   })

//   // Data:
//   const data_truthy = {
//     id: 'helllo',
//     timestamp: 'world',
//     name: 'Aditya Borkar',
//     phone: 9820748096,
//     verified: true,
//   }
//   const data_falsy = {
//     id: 'helllo',
//     timestamp: 'world',
//     name: 'Aditya Borkar',
//     phone: 9820748096,
//     verified: true,
//   }

//   it('supports single schema per table', () => {
//     it('supports single schema per table', () => {
//       const table1 = ZodSchemaResolver({
//         keys: { id: z.string(), timestamp: z.string() },
//         attributes: [UserVerifiedSchema, UserUnverifiedSchema, OrderSchema],
//       })

//       expect(table1.validate(data_truthy)).toEqual({
//         success: true,
//         data: data_truthy,
//       })
//     })
//   })

//   it('supports multiple schema per table', () => {
//     const table = ZodSchemaResolver({
//       keys: { id: z.string(), timestamp: z.string() },
//       attributes: [UserVerifiedSchema, UserUnverifiedSchema, OrderSchema],
//     })
//     expect(table.validate(data_truthy)).toEqual({
//       success: true,
//       data: data_truthy,
//     })
//   })

//   //   expect(table.validate(response)).toEqual({ success: true, data: response })

//   // A deep equality will not be performed for Error objects. Only the message property of an Error is considered for equality. To customize equality to check properties other than message, use expect.addEqualityTesters. To test if something was thrown, use toThrowError assertion.

//   // expect(table).toEqual({})

//   // expectTypeOf(schema).toEqualTypeOf<{}>()
//   // type SchemaType = infer <typeof schema>
//   // type userInfoType = z.infer<typeof userInfoSchema>;

//   // Type Narrowing:
//   // if ('verified' in debug) debug

//   it.todo('unimplemented test')
// })

describe('Zod Schema Typings - Single Schema:', () => {
  const UserSchema = {
    keys: {
      id: z.string(),
      timestamp: z.string(),
    },
    attributes: z.object({
      name: z.string(),
      age: z.number(),
    }),
  }
  const data_truthy = {
    id: '123',
    timestamp: '2022-01-01',
    name: 'John Doe',
    age: 30,
  }
  const data_falsy = {
    id: '123',
    timestamp: '2022-01-01',
    name: 'John Doe',
    age: '30', // Invalid type
  }

  const schema = ZodSchemaResolver(UserSchema)

  it('creates a schema with keys, attributes and item', () => {
    const result = schema.validate(data_truthy)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(data_truthy)
    expect(result_falsy.error).toBeUndefined()
  })

  it('returns validation', () => {
    // TODO: CHECK TYPINGS
    const result_truthy = schema.validate(data_truthy)
    expect(result_truthy.success).toBe(true)
    expect(result_truthy.data).toEqual(data_truthy)
    expect(result_truthy.error).toBeUndefined()

    const result_falsy = schema.validate(data_falsy)
    expect(result_falsy.success).toBe(false)
    expect(result_falsy.error).toBe({})
    expect(result_falsy.data).toBeUndefined()
  })

  it('returns typings', () => {
    // TODO: CHECK TYPINGS
    const result = schema.validate(data_truthy)
    expect(result.success).toBe(true)
    expect(result.data).toEqual(data_truthy)
  })
})

// describe('Zod Schema Typings - Multiple Schema:', () => {
//   const UserSchema = {
//     keys: {
//       id: z.string(),
//       timestamp: z.string(),
//     },
//     attributes: z.object({
//       name: z.string(),
//       age: z.number(),
//     }),
//   }
//   const data_truthy = {
//     id: '123',
//     timestamp: '2022-01-01',
//     name: 'John Doe',
//     age: 30,
//   }
//   const data_falsy = {
//     id: '123',
//     timestamp: '2022-01-01',
//     name: 'John Doe',
//     age: '30', // Invalid type
//   }

//   const schema = ZodSchemaResolver({
//     keys: {
//       id: z.string(),
//       timestamp: z.string(),
//     },
//     attributes: [
//       z.object({
//         name: z.string(),
//         age: z.number(),
//       }),
//       z.object({
//         email: z.string().email(),
//       }),
//     ],
//   })
// })
