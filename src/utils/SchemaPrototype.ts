// /**
//  * @private
//  * @class SchemaPrototype - A class that provides a prototype for creating a schema
//  * @interface SchemaType - A type that defines the schema for a table
//  */
// export default class SchemaPrototype<ST extends SchemaType> {
//   keys: ST['keys']
//   item: ST['keys'] & ST['fields']
//   fields: ST['fields']

//   constructor(schema: ST) {
//     const { keys, fields } = schema
//     this.keys = keys
//     this.fields = fields
//     // @ts-expect-error
//     this.item = { ...keys, ...fields }
//   }

//   validate(data: any) {
//     // TODO: use superstruct to validate data
//     return data as ST['keys'] & ST['fields']
//   }
// }
