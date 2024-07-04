// TODO: How to differentiate between actual nested attributes and dotted attributes?

/**
 * @private
 * Internal function to escape attribute names.
 */
export default function EscapeAttributeName(name: string) {
  const AttrNames = {} as { [key: string]: string }
  const parts = name.split('.')
  if (parts.length === 32)
    throw 'The maximum depth for a document path is 32. Therefore, the number of dereferences operators in a path cannot exceed this limit.'

  const AttrName = parts
    .map(part => {
      // TODO: Test Case: []
      // TODO: Escape # (hash) and : (colon)
      const _part = `#${part}`
      AttrNames[_part] = part
      return _part
    })
    .join('.')
  return { AttrNames, AttrName }
}
