import { describe, expect, it } from 'vitest'

import { ZodSchemaResolver } from '@/index'
import { Attributes, MultipleKey, SingleKey } from './schema-store'

describe('Zod (Multiple Schema):', () => {
	describe('Schema without index:', () => {
		it('should create schema', () => {
			const Schema_SingleKey_NoIndex = ZodSchemaResolver({
				keys: SingleKey,
				attributes: Attributes,
			})
			expect(Schema_SingleKey_NoIndex).toThrowError()

			const Schema_MultipleKey_NoIndex = ZodSchemaResolver({
				keys: MultipleKey,
				attributes: Attributes,
			})
			expect(Schema_MultipleKey_NoIndex).toThrowError()
		})

		it('should contain valid key names and attribute names', () => {})

		it('should not contain key in attributes', () => {})

		it('should return "keys", "attributes", and "item"', () => {})

		it('should return "$types"', () => {})

		it('should validate data', () => {})

		it('should fail gracefully', () => {
			const Schema_SingleKey_NoIndex = ZodSchemaResolver({
				keys: SingleKey,
				attributes: Attributes,
			})
			expect(Schema_SingleKey_NoIndex).toThrowError()
		})
	})

	describe('Schema with index:', () => {
		it('should create LSI', () => {})

		it('should create GSI', () => {})

		it('should create both - LSI and GSI', () => {})

		it('should not contain key in projection', () => {})

		it('should limit LSI to max 5', () => {})

		it('should limit GSI to max 20 or the quota defined in the client', () => {})

		it('should limit projection attributes in LSI and GSI to a max 100', () => {
			// TODO: The total count of attributes provided in `projection` summed across all of the secondary (both - lsi & gsi) indexes, must not exceed 100
		})
	})
})
