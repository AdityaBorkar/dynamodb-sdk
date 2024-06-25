import chalk from 'chalk'
import { ATTRIBUTE_TYPE_DEF } from '../utils/AwsConstants'
import EscapeAttributeName from '../utils/EscapeAttributeName'

// TABLE_NAME INDEX_NAME = /a-zA-Z0-9_-./gm 3 to 255 chars
// ATTRIBUTE_NAME = at least one character long and less than 64 KB in size
// These attribute names must be no greater than 255 characters long in case of:
// - Secondary index partition key names
// - Secondary index sort key names
// - The names of any user-specified projected attributes (applicable only to local secondary indexes)
// TODO: Create Linter and Formatter for `ConditionExpression`

// TODO: condition = operand BETWEEN operand AND operand
// TODO: condition = operand IN (operand,operand) (upto 100 values in bracket)
// TODO: condition = ATTRIBUTE_FUNCTION (except .size())

export default function CompileConditionExpression(
  expression: string,
  schema: SchemaItemType,
) {
  const ConditionExpression = {
    exp: '',
    names: {} as { [key: string]: string },
    values: {} as { [key: string]: string },

    InvalidTypeError(props: {
      word: typeof word | string
      ValidTypes: string[]
      CurrentType: string
    }) {
      const { word, ValidTypes, CurrentType } = props
      return `Expected: ${ValidTypes.map(type => {
        if (type === 'COMPARATOR') return 'Comparator (= <> < <= > >=)'
        if (type === 'LOGICAL') return 'Logical Operator (AND OR NOT)' // TODO: NOT cannot be at the end
        if (type === 'OPERAND') return 'Attribute Name, Constant'
        if (type === 'OPERAND:CLOSING') return 'Attribute Name, Constant'
        if (type === 'FUNCTION')
          // TODO: 2 Types of Function. Returns boolean/number
          return 'Attribute Function (exists notExists isOfType includes startsWith size)'
        return type
      }).join(', ')}; Found: ${CurrentType} ${word}`
    },

    addConstant() {
      const CurrentType =
        word.previousType === 'LOGICAL' ? 'OPERAND' : 'OPERAND:CLOSING'
      const ValidTypes = ['LOGICAL', 'COMPARATOR']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word })

      this.exp += ` ${word}`
      word.previousType = CurrentType
      word.reset()
    },

    addAttributeName() {
      const CurrentType =
        word.previousType === 'LOGICAL' ? 'OPERAND' : 'OPERAND:CLOSING'
      const ValidTypes = ['LOGICAL', 'COMPARATOR']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word })

      const { AttrNames, AttrName } = EscapeAttributeName(word.value)
      this.names = { ...this.names, ...AttrNames }
      this.exp += ` ${AttrName}`
      word.previousType = CurrentType
      word.reset()
    },

    addComparator() {
      const CurrentType = 'COMPARATOR'
      const ValidTypes = ['OPERAND']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word })

      if (!['<', '>', '<>', '<=', '>=', '='].includes(word.value))
        throw `Invalid Comparator: ${word}`
      this.exp += ` ${word}`
      word.previousType = CurrentType
      word.reset()
    },

    addLogicalOp() {
      const CurrentType = 'LOGICAL'
      const ValidTypes = ['OPERAND:CLOSING', 'FUNCTION']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word })

      if (!['AND', 'OR', 'NOT'].includes(word.value))
        throw `Invalid Operator: ${word}`
      this.exp += ` ${word}`
      word.previousType = CurrentType
      word.reset()
    },

    addAttributeFunc() {
      const CurrentType = 'FUNCTION'

      if (word.previousType.startsWith('FUNCTION-CALLING:')) {
        const [, funcName, attrName] = word.previousType.split(':')
        const funcDef = ATTR_FUNC_DEF[funcName as keyof typeof ATTR_FUNC_DEF]
        const condition = funcDef?.(attrName, word.value)
        this.exp += ` ${condition}`
        word.previousType = CurrentType
        return word.reset()
      }

      const ValidTypes = ['LOGICAL']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word })

      const separator = word.value.lastIndexOf('.')

      const funcName = word.value.slice(separator + 1)
      if (!ATTR_FUNC_NAMES.includes(funcName))
        throw `Invalid Function: ${funcName}`

      const attrName = word.value.slice(0, separator)
      const { AttrNames, AttrName } = EscapeAttributeName(attrName)
      this.names = { ...this.names, ...AttrNames }

      word.previousType = `FUNCTION-CALLING:${funcName}:${AttrName}`
      word.reset()
    },

    addBracket(opening: boolean) {
      const char = opening ? '(' : ')'
      const CurrentType = `${opening ? 'OPENING' : 'CLOSING'} BRACKET`
      const ValidTypes = opening ? ['LOGICAL'] : ['FUNCTION', 'OPERAND:CLOSING']
      if (!ValidTypes.includes(word.previousType))
        throw this.InvalidTypeError({ ValidTypes, CurrentType, word: char })

      BRACKETS += opening ? 1 : -1
      if (BRACKETS < 0) throw 'Invalid Closing Bracket'

      this.exp += ` ${char}`
      word.reset()
    },

    output() {
      return {
        ConditionExpression: this.exp,
        ExpressionAttributeNames: this.names,
        ExpressionAttributeValues: this.values,
      }
    },
  }
  const word = {
    value: '',
    previousType: 'LOGICAL',
    speculation: '',
    toString() {
      return this.value
    },
    add(val: string) {
      this.value += val
    },
    reset() {
      this.value = ''
      this.speculation = ''
    },
  }
  let BRACKETS = 0
  let parseIndex = -1
  const exp = `${expression.trim().replace(/\s+/gim, ' ')} `

  try {
    for (const char of exp) {
      ++parseIndex
      if (char.charCodeAt(0) > 127)
        throw 'Invalid Character. Only UTF-8 is supported.'

      if (word.speculation === 'COMPARATOR') {
        if (!char.match(/=<>/)) {
          ConditionExpression.addComparator()
        }
        word.add(char)
        continue
      }

      if (word.speculation === 'ATTRIBUTE-NAME') {
        if (char === ' ') ConditionExpression.addAttributeName()
        else if (char === '(') {
          ConditionExpression.addAttributeFunc()
          word.speculation = 'FUNCTION'
        } else word.add(char)
        continue
      }

      if (word.speculation === 'FUNCTION') {
        if (char === ')') ConditionExpression.addAttributeFunc()
        else word.add(char)
        continue
      }

      if (char === ' ') {
        const WORD = word.toString().toUpperCase().trim()
        if (['AND', 'OR', 'NOT'].includes(WORD))
          ConditionExpression.addLogicalOp()
        else if (WORD) {
          if (
            (WORD.startsWith('"') && WORD.endsWith('"')) ||
            WORD.match(/^[0-9]+$/)
          )
            ConditionExpression.addConstant()
          else ConditionExpression.addAttributeName()
        } else if (word.value.length) throw `Invalid Word: ${word}`
        continue
      }

      if (['(', ')'].includes(char)) {
        ConditionExpression.addBracket(char === '(')
        continue
      }

      if (char === '.') word.speculation = 'ATTRIBUTE-NAME'
      if (['=', '<', '>'].includes(char)) word.speculation = 'COMPARATOR'

      word.add(char)
    }
  } catch (err) {
    const prefix = expression.slice(0, parseIndex)
    const errorChar = expression[parseIndex]
    const suffix = expression.slice(parseIndex + 1, expression.length)
    // console.log(
    //   `${chalk.white(prefix)}${chalk.bgRed.white(errorChar)}${chalk.gray(suffix)}`,
    // )
    throw `[${parseIndex}: SYNTAX ERROR] ${err}`
  }

  const ValidTypes = ['FUNCTION', 'OPERAND:CLOSING']
  if (!ValidTypes.includes(word.previousType))
    throw `[SYNTAX ERROR] Incomplete Condition Expression. Expecting: ${ConditionExpression.InvalidTypeError({ CurrentType: '', ValidTypes, word })}`
  if (BRACKETS > 0)
    throw `[SYNTAX ERROR] Found ${BRACKETS} additional opening Brackets`

  return ConditionExpression.output()
}

// ---

const ATTR_FUNC_DEF = {
  exists: (attr: string, params: string) => {
    if (params !== '') throw 'Parameters did not match'
    return `attribute_exists(${attr})`
  },
  notExists: (attr: string, params: string) => {
    if (params !== '') throw 'Parameters did not match'
    return `attribute_not_exists(${attr})`
  },
  isOfType: (attr: string, params: string) => {
    if (!ATTR_TYPE_NAMES.includes(params)) throw 'Parameters did not match'
    // @ts-expect-error
    const attrType = ATTRIBUTE_TYPE_DEF[params]
    return `attribute_type(${attr},${attrType})`
  },
  includes: (attr: string, params: string) => {
    // TODO
    return ''
  },
  startsWith: (attr: string, params: string) => {
    // TODO
    return ''
  },
  size: (attr: string, params: string) => {
    // TODO
    return ''
  },
}

const ATTR_TYPE_NAMES = Object.keys(ATTRIBUTE_TYPE_DEF)
const ATTR_FUNC_NAMES = Object.keys(ATTR_FUNC_DEF)
