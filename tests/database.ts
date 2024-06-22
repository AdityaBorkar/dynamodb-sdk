import { ZodSchemaResolver } from '@/index'
import { z } from 'zod'

const $UsersSchema = ZodSchemaResolver({
  keys: {
    id: z.string(),
  },
  attributes: {
    slug: z.string().optional(),
  },
})

const UsersSchema = {
  keys: { id: '' },
  fields: { slug: '' },
} as {
  keys: { id: string }
  fields: { slug?: string }
}

const ProjectsSchema = {
  keys: { id: '' },
  fields: {
    slug: '',
    lastUpdated: {
      time: '',
      date: '',
    },
  },
} as {
  keys: { id: string }
  fields: {
    slug?: string
    lastUpdated?: {
      time?: string
      date?: string
    }
  }
}

const SyncStatusSchema = {
  keys: { id: '' },
  fields: { slug: '' },
} as {
  keys: { id: string }
  fields: { slug?: string }
}

export const dbSchema = {
  Users: UsersSchema,
  Projects: ProjectsSchema,
  SyncStatus: SyncStatusSchema,
} as const

// const schema = new SchemaPrototype(schema)
