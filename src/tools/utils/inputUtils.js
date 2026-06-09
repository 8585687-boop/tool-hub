/**
 * Shared input parsing, validation, and utility functions.
 * Used by Number Base Converter and other tools.
 */

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export { DIGITS }

/**
 * Safe execute wrapper — wraps a function in try/catch and returns
 * unified { success, result } or { success: false, error } format.
 */
export function safeExecute(fn) {
  try {
    const result = fn()
    return { success: true, result }
  } catch (e) {
    return { success: false, error: e.message || String(e) }
  }
}

/**
 * Parse an integer string in a given base, returning a BigInt or error.
 * Handles optional +/- sign, trims whitespace, validates characters.
 * For bases <= 36, lowercase letters are treated as uppercase equivalents.
 */
export function parseInteger(text, base) {
  if (!text || !text.trim()) {
    return { success: false, error: 'Input is empty' }
  }

  base = Number(base)
  if (base < 2 || base > 62) {
    return { success: false, error: `Invalid base: ${base} (must be 2–62)` }
  }

  let str = text.trim()
  let sign = BigInt(1)

  if (str.startsWith('-')) {
    sign = BigInt(-1)
    str = str.slice(1)
  } else if (str.startsWith('+')) {
    str = str.slice(1)
  }

  if (!str) {
    return { success: false, error: 'Input is empty or only contains a sign' }
  }

  let value = BigInt(0)
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    const digit = charToDigit(ch, base)
    if (digit < 0) {
      return {
        success: false,
        error: `Invalid character '${ch}' for base ${base}`,
      }
    }
    value = value * BigInt(base) + BigInt(digit)
  }

  return { success: true, value: value * sign }
}

/**
 * Map a character to its digit value for the given base.
 * For bases <= 36, lowercase letters map to same values as uppercase.
 * Returns -1 if the character is invalid for the base.
 */
export function charToDigit(ch, base) {
  if (base <= 36 && ch >= 'a' && ch <= 'z') {
    const val = ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10
    return val < base ? val : -1
  }
  const idx = DIGITS.indexOf(ch)
  return idx < base ? idx : -1
}

/**
 * Detect common base prefixes in a string.
 * Returns { base, cleaned } or null if no prefix found.
 * Recognized prefixes: 0b/0B (binary), 0o/0O (octal), 0x/0X (hex).
 */
export function detectBasePrefix(text) {
  const trimmed = text.trim()
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    return { base: 16, cleaned: trimmed.slice(2) }
  }
  if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) {
    return { base: 2, cleaned: trimmed.slice(2) }
  }
  if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) {
    return { base: 8, cleaned: trimmed.slice(2) }
  }
  return null
}

/**
 * Format a BigInt value as a string in the given base.
 * Uses uppercase letters for digits > 9.
 */
export function formatBigInt(value, base) {
  if (value === BigInt(0)) return '0'

  let sign = ''
  if (value < BigInt(0)) {
    sign = '-'
    value = -value
  }

  let result = ''
  const baseBig = BigInt(base)
  while (value > BigInt(0)) {
    const rem = Number(value % baseBig)
    result = DIGITS[rem] + result
    value = value / baseBig
  }

  return sign + result
}

/**
 * Parse a single CSV line respecting quoted fields.
 * Shared by csvToJson and validateCsv.
 */
export function parseCsvLine(line, delimiter) {
  const fields = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const ch = line[i]

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i += 2
        } else {
          inQuotes = false
          i++
        }
      } else {
        current += ch
        i++
      }
    } else {
      if (ch === '"') {
        inQuotes = true
        i++
      } else if (ch === delimiter) {
        fields.push(current.trim())
        current = ''
        i++
      } else {
        current += ch
        i++
      }
    }
  }

  fields.push(current.trim())
  return fields
}
