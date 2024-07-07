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
		name: z.string(),
		creator: z.object({
			id: z.string(),
			name: z.string(),
		}),
		slug: z.string().optional(),
	}),
	lsi: {
		'index-name': {
			hashKey: 'name',
			sortKey: 'slug',
			projection: 'ALL',
		},
		'index-name2': {
			hashKey: 'slug',
			projection: 'ALL',
		},
	},
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
	schemaless: false,
	maxAttempts: 2,
	region: 'ap-south-1',
})

// ---

const test2 = db.Projects.update({
	id: '1',
}).data({
	name: 'Project 1',
	slug: $ => $.createIfNotExists('Project 1'),
	// creator: {
	//   id: $ => $.delete(),
	// },
})

const debug = ProjectsSchema._typings.indices

const test1 = db.Projects.query({
	indexName: 'index-name2',
	ifCondition: '',
}).cursor({ slug: 'Project 1' })

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
