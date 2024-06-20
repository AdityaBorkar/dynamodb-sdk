import { Resource } from 'sst'

export default function getSstTableName(tableName: string) {
  // @ts-expect-error
  const resource = Resource[tableName]
  if (!resource) throw new Error(`${tableName} Table Not Found.`)
  if (resource.type !== 'sst.aws.Dynamo')
    throw new Error(
      `${tableName} Table Not Found. Expected: DynamoDB Table. Found: ${resource.type}`,
    )

  return resource.name
}
