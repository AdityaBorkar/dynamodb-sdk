type TableSchemaType = {
  keys: SchemaKeyType
  fields: SchemaItemType
}

type SchemaKeyType = Record<string, string | number>

type SchemaItemType = Record<string, _DbFieldType>

type _DbFieldType =
  | undefined
  | boolean
  | string
  | number
  | _DbFieldType[]
  | { [key: string]: _DbFieldType }

type OptionalObj<Object> = { [K in keyof Object]?: Object[K] }

// import type { _LocalSyncInitType } from '../idb/types'
// import type { DbFieldType, ReplocalDbMigrationSchema } from '../utils'

// type ReferenceType = {
//   tableName: string
//   hashKey: string
//   rangeKey?: string
//   projection?: string
// }

// type DocumentType =
//   | { refId: number }
//   | {
//       tableName: string
//       hashKey: string
//       rangeKey?: string
//     }

// export type ReplocalDynamoDBQuery = {
//   References: ReferenceType[]
//   BatchRead: DocumentType[]
//   Query: DocumentType[]
//   Scan: DocumentType[]
// }

// export type ReplocalDynamoDBSchema = {
//   version: number | 'dev'
//   localDb: {
//     dbType: 'IDB' | 'MEMDB'
//     encrypt: boolean
//     compress: boolean
//     validate: boolean | { read: boolean; write: boolean }
//     syncStrategy: 'DEVICE-RECORDS' | 'DEVICE-COMMITS' | 'CDC-CURSOR' // = Store CDC in DDB-IA Class + Great for Version History / Audit Trails
//   }
//   tables: {
//     [storeName: string]: {
//       fields: DbFieldType
//       hashKey: string // TODO: TS DROPDOWN
//       rangeKey?: string
//       indexes?: {
//         name: string
//         key: {
//           hash: string
//           range?: string
//         }
//       }[]
//       // pushLive?: boolean
//       localSync?: {
//         strategy: 'CONSTANT' | 'RANGE'
//         init: _LocalSyncInitType
//         indexes?: {
//           [indexName: string]: string
//         }
//       }
//     }
//   }
//   migration: {
//     [version: number]: ReplocalDbMigrationSchema
//   }
// }
