/**
 * This file is a collection of schemas to be used for testing purposes.
 */

import { ZodSchemaResolver } from '@/index'
import { z } from 'zod'

export const SingleKey = {
	id: z.string(),
}

export const MultipleKey = {
	id: z.string(),
	timestamp: z.string(),
}

export const Attributes = z.object({
	creator: z.object({
		id: z.string(),
		name: z.string(),
	}),
})

const LocalSecondaryIndex = {}

const GlobalSecondaryIndex = {}

// ---

// TABLE -> hashkey / hashkey + sortkey
// IN
// EVERY
// INDEX -> hashKey
// sortKey
// projection
// TABLE
// KEYS = Use
// normal
// attributes + nested
// attributes
// INDEX
// KEYS = Use
// normal
// attributes + nested
// attributes
