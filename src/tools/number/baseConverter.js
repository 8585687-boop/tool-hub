import { DIGITS, charToDigit } from '../utils/inputUtils.js'

export function convertBase(text, fromBase, toBase) {
  if (!text || !text.trim()) {
    return { success: false, error: 'Input is empty' }
  }

  fromBase = Number(fromBase)
  toBase = Number(toBase)

  if (fromBase < 2 || fromBase > 62) {
    return { success: false, error: `Invalid source base: ${fromBase} (must be 2–62)` }
  }
  if (toBase < 2 || toBase > 62) {
    return { success: false, error: `Invalid target base: ${toBase} (must be 2–62)` }
  }

  let str = text.trim()
  let sign = ''

  if (str.startsWith('-')) {
    sign = '-'
    str = str.slice(1)
  } else if (str.startsWith('+')) {
    str = str.slice(1)
  }

  if (!str) {
    return { success: false, error: 'Input is empty or only contains a sign' }
  }

  // String -> BigInt
  let value = BigInt(0)
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    const digit = charToDigit(ch, fromBase)
    if (digit < 0) {
      return {
        success: false,
        error: `Invalid character '${ch}' for base ${fromBase}`,
      }
    }
    value = value * BigInt(fromBase) + BigInt(digit)
  }

  // BigInt -> string in target base
  if (value === BigInt(0)) {
    return { success: true, result: '0' }
  }

  let result = ''
  const baseBig = BigInt(toBase)
  while (value > 0) {
    const rem = Number(value % baseBig)
    result = DIGITS[rem] + result
    value = value / baseBig
  }

  return { success: true, result: sign + result }
}
