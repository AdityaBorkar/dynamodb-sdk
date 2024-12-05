import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  // https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema
})

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    section: z.string(),
    // description: z.string(),
    // date: z.string(),
  }),
})

export const collections = {
  ref: blogCollection,
  docs,
  tree: blogCollection,
  guides: blogCollection,
}
