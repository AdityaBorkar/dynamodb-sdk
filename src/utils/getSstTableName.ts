import { Resource } from 'sst'

/**
 * @private
 * Internal function to get the DynamoDB Table Name from SST.
 */
export default function getSstTableName(tableName: string): string {
  // @ts-expect-error: Bug in SST v3 Typings (`Resource`).
  // POST A BUG AND ATTACH LINK HERE
  // Warning: resource is defined as `any` in `resource` `resource.type` `resource.name`
  const resource = Resource[tableName]
  if (!resource) throw new Error(`${tableName} Table Not Found.`)
  if (resource.type !== 'sst.aws.Dynamo')
    throw new Error(
      `${tableName} Table Not Found. Expected: DynamoDB Table. Found: ${resource.type}`,
    )

  return resource.name
}
