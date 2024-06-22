import EscapeAttributeName from '../utils/EscapeAttributeName'

export default function CompileProjectionExpression(
  attributes: string[],
  schema: SchemaItemType,
) {
  // TODO: Support `[]`
  let ExpressionAttributeNames = {} as { [key: string]: string }
  const ProjectionExpression = attributes
    .map(attr => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      let $schema = schema as any
      let flag = false
      const path = attr.split('.')
      for (const key of path) {
        $schema = $schema?.[key]
        if (!$schema) {
          flag = true
          break
        }
      }
      if (flag) throw new Error(`Invalid attribute name: ${attr}`)

      const { AttrName, AttrNames } = EscapeAttributeName(attr)
      ExpressionAttributeNames = { ...ExpressionAttributeNames, ...AttrNames }
      return AttrName
    })
    .join(', ')
  return { ProjectionExpression, ExpressionAttributeNames }
}

export type ExtractSchemaAttributes<ST extends SchemaItemType> =
  ST extends object
    ? {
        [K in keyof ST]-?: K | `${K & string}.${ExtractSchemaAttributes<ST[K]>}`
      }[keyof ST]
    : never
