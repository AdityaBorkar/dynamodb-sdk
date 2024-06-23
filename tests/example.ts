import { DynamoDbClient, ZodSchemaResolver } from '@/index'
import { z } from 'zod'

const UsersSchema = ZodSchemaResolver({
  keys: { id: z.string() },
  attributes: z.object({
    slug: z.string().optional(),
  }),
})

const ProjectsSchema = ZodSchemaResolver({
  keys: { id: z.string() },
  attributes: z.object({
    slug: z.string().optional(),
  }),
})

const SyncStatusSchema = ZodSchemaResolver({
  keys: { id: z.string() },
  attributes: z.object({
    slug: z.string().optional(),
  }),
})

export const dbSchema = {
  Users: UsersSchema,
  Projects: ProjectsSchema,
  SyncStatus: SyncStatusSchema,
} as const

const client = DynamoDbClient({
  dbSchema,
  verbose: false,
  validate: false,
  maxAttempts: 2,
  region: 'ap-south-1',
  schemaless: false,
})

client.Projects.put({
  id: '1',
  slug: 'project-1',
})
