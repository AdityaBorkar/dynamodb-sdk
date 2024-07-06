import { DynamoDbClient, ZodSchemaResolver } from 'package/src/index'
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
    name: z.string(),
    creator: z.object({
      id: z.string(),
      name: z.string(),
    }),
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

const db = DynamoDbClient({
  dbSchema,
  verbose: false,
  validate: false,
  maxAttempts: 2,
  region: 'ap-south-1',
  schemaless: false,
})

// ---

const test1 = db.Projects.update({
  id: '1',
}).data({
  name: 'Project 1',
  slug: $ => $.createIfNotExists('Project 1'),
  // creator: {
  //   id: $ => $.delete(),
  // },
})

// const example1 = client.Projects.put({
//   id: '1',
//   name: 'Project 1',
//   creator: {
//     id: '1',
//     name: 'User 1',
//   },
// })
//   .values(true)
//   .execute({})

// example1.then(d => {
//   d.data
// })

// client.Projects.update({
//   id: '1',
// }).data({
//   name: 'Project 1',
//   slug: $ => $.createIfNotExists('Project 1'),
//   creator: {
//     id: $ => $.delete(),
//   },
//   // creator: $ => $.delete,
//   // creator: {
//   //   id: '1',
//   //   name: 'User 1',
//   // },
// })
// // .consistent()
// // .values(['slug', 'creator'])

// client.Projects.get({
//   id: '1',
// })
//   .consistent()
//   .values(['slug', 'creator'])
