interface TableSchema<KT, AT> {
  keys: Record<string, any>
  fields: any[]
  validate: (data: any) =>
    | {
        success: false
        error: ZodError
      }
    | {
        success: true
        data: Schema
      }
}
