export default class SchemaPrototype<ST extends SchemaType> {
  keys: ST['keys']
  item: ST['keys'] & ST['fields']
  fields: ST['fields']

  constructor(schema: ST) {
    const { keys, fields } = schema
    this.keys = keys
    this.fields = fields
    // @ts-expect-error
    this.item = { ...keys, ...fields }
  }

  // biome-ignore lint/suspicious/noExplicitAny: Input Data can be of any type
  validate(data: any) {
    // TODO: use superstruct to validate data
    return data as ST['keys'] & ST['fields']
  }
}
