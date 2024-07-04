import EscapeAttributeName from 'package/src/utils/EscapeAttributeName'
import { nanoid } from 'nanoid'

export default function EvaluateUpdateExpression(
  object: any,
  schema: any,
  options?: { merge?: boolean | { array: boolean; object: boolean } },
) {
  const SetExpression: string[] = []
  const RemoveExpression: string[] = []
  const DeleteExpression: string[] = []
  const ExpressionAttributeNames = { '': '' }
  const ExpressionAttributeValues = { '': '' }

  const ctx = {
    delete: () => ({ delete: true }),
    add: (value: number) => ({ add: value }),
    subtract: (value: number) => ({ subtract: value }),
    push: (value: any) => ({ push: value }),
    unshift: (value: any) => ({ unshift: value }),
    createIfNotExists: (value: any) => ({ createIfNotExists: value }),
  } as const
  const ctxActions = {
    // TODO: `key` can be any attribute name and recommend the ones of the same type (except for delete)
    delete: (key: string, value?: string[]) => {
      if (value) {
        if (key.includes('.')) throw `Invalid Key: ${key}`
        // The DELETE action only supports set data types.
        // In addition, DELETE can only be used on top-level attributes, not nested attributes.
        DeleteExpression.push(`${key} ${value}`)
        return
      }
      RemoveExpression.push(key)
    },
    add: (key: string, value: string) =>
      SetExpression.push(`${key} = ${key} - ${value}`),
    subtract: (key: string, value: string) =>
      SetExpression.push(`${key} = ${key} - ${value}`),
    push: (key: string, value: string) =>
      SetExpression.push(`${key} = list_append(${key},${value})`),
    unshift: (key: string, value: string) =>
      SetExpression.push(`${key} = list_append(${value},${key})`),
    createIfNotExists: (key: string, value: string) =>
      SetExpression.push(`${key} = if_not_exists(${key},${value})`),
  } as const
  const CtxKeys = Object.keys(ctxActions)

  function evaluate(object: { [key: string]: any }, path: string[] = []) {
    for (const key in object) {
      const name = key
      const value = object[key]
      if (typeof value === 'object') {
        evaluate(value, [...path, key])
        continue
      }
      if (typeof value === 'function') {
        const operation = value(ctx)
        for (const key in operation) {
          if (!CtxKeys.includes(key)) throw `Invalid Operation: ${key}`
          const attrName = EscapeAttributeName(path + key) // TODO: MERGE PATH
          const valueName = operation[key] // TODO: VALUES
          // @ts-expect-error
          ctxActions[key](attrName, valueName)
        }
        console.log(operation)
      }
      const attrName = EscapeAttributeName(path + name) // TODO: MERGE PATH
      const valueName = value // TODO: VALUES
      SetExpression.push(`${attrName} = ${SetExpression}`)
    }
  }

  evaluate(object)

  const UpdateExpression =
    (RemoveExpression.length ? `REMOVE ${RemoveExpression.join(', ')} ` : '') +
    (DeleteExpression.length ? `DELETE ${DeleteExpression.join(', ')} ` : '') +
    (SetExpression.length ? `SET ${SetExpression.join(', ')} ` : '')

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  }
}
