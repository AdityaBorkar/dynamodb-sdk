import { RESERVED_KEYWORDS } from './AwsConstants'

// TODO: The maximum depth for a document path is 32. Therefore, the number of dereferences operators in a path cannot exceed this limit.
export default function EscapeAttributeName(name: string) {
  // DynamoDB has a list of reserved words and special characters. You can use any attribute name in a projection expression, provided that the first character is a-z or A-Z and the second character (if present) is a-z, A-Z, or 0-9. If an attribute name doesn't meet this requirement, you must define an expression attribute name as a placeholder. For a complete list, see Reserved words in DynamoDB. Also, the following characters have special meaning in DynamoDB: # (hash) and : (colon).
  const AttrNames = {} as { [key: string]: string }
  const AttrName = name
    .split('.')
    .map(part => {
      // TODO: Replace if array length > 1
      // TODO: Also consider the case of []
      if (!RESERVED_KEYWORDS.includes(part.toUpperCase())) return part
      const _part = `#${part}`
      AttrNames[_part] = part
      return _part
    })
    .join('.')
  return { AttrNames, AttrName }
}
