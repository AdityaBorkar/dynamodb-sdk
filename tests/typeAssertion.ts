import { DynamoDbClient } from '@/index'
import { dbSchema } from './database'
import { describe, it } from 'vitest'
import { attest } from '@arktype/attest'
import { type } from 'arktype'

const client = DynamoDbClient({
  dbSchema,
  verbose: false,
  validate: false,
  maxAttempts: 2,
  region: 'ap-south-1',
  schemaless: false,
})

// const client1 = new DynamodbClient({
//   dbSchema,
//   verbose: false,
//   validate: false,
//   maxAttempts: 2,
//   region: 'ap-south-1',
//   allowUndefinedTable: false,
// })

client.Projects.get

// Example select an client according to customer location:
{
  const customerLocation = 'ap-south-1'
}

// ---

describe('attest features', () => {
  it('type and value assertions', () => {
    const even = type('number%2')
    attest<number>(even.infer)
    attest(even.infer).type.toString.snap('number')
    attest(even.json).snap({
      intersection: [{ domain: 'number' }, { divisor: 2 }],
    })
  })

  // it("error assertions", () => {
  // 	// Check type errors, runtime errors, or both at the same time!
  // 	// @ts-expect-error
  // 	attest(() => type("number%0")).throwsAndHasTypeError(
  // 		"% operator must be followed by a non-zero integer literal (was 0)"
  // 	)
  // 	// @ts-expect-error
  // 	attest(() => type({ "[object]": "string" })).type.errors(
  // 		"Indexed key definition 'object' must be a string, number or symbol"
  // 	)
  // })

  // it("completion snapshotting", () => {
  // 	// snapshot expected completions for any string literal!
  // 	// @ts-expect-error (if your expression would throw, prepend () =>)
  // 	attest(() => type({ a: "a", b: "b" })).completions({
  // 		a: ["any", "alpha", "alphanumeric"],
  // 		b: ["bigint", "boolean"]
  // 	})
  // 	type Legends = { faker?: "🐐"; [others: string]: unknown }
  // 	// works for keys or index access as well (may need prettier-ignore to avoid removing quotes)
  // 	// prettier-ignore
  // 	attest({ "f": "🐐" } as Legends).completions({ "f": ["faker"] })
  // })

  // it("integrate runtime logic with type assertions", () => {
  // 	const arrayOf = type("<t>", "t[]")
  // 	const numericArray = arrayOf("number | bigint")
  // 	// flexibly combine runtime logic with type assertions to customize your
  // 	// tests beyond what is possible from pure static-analysis based type testing tools
  // 	if (getTsVersionUnderTest().startsWith("5")) {
  // 		// this assertion will only occur when testing TypeScript 5+!
  // 		attest<(number | bigint)[]>(numericArray.infer)
  // 	}
  // })

  // it("integrated type performance benchmarking", () => {
  // 	const user = type({
  // 		kind: "'admin'",
  // 		"powers?": "string[]"
  // 	})
  // 		.or({
  // 			kind: "'superadmin'",
  // 			"superpowers?": "string[]"
  // 		})
  // 		.or({
  // 			kind: "'pleb'"
  // 		})
  // 	attest.instantiations([7574, "instantiations"])
  // })
})
