import { describe, it, expect } from 'vitest'
import { parseInteger, charToDigit, detectBasePrefix, formatBigInt } from '../src/tools/utils/inputUtils'

describe('parseInteger', () => {
  it('parses decimal', () => {
    const res = parseInteger('255', 10)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(255))
  })

  it('parses hex', () => {
    const res = parseInteger('FF', 16)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(255))
  })

  it('parses binary', () => {
    const res = parseInteger('1010', 2)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(10))
  })

  it('handles negative', () => {
    const res = parseInteger('-15', 10)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(-15))
  })

  it('handles plus sign', () => {
    const res = parseInteger('+10', 10)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(10))
  })

  it('handles lowercase hex', () => {
    const res = parseInteger('face', 16)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt(64206))
  })

  it('returns error for empty', () => {
    expect(parseInteger('', 10).success).toBe(false)
  })

  it('returns error for sign-only', () => {
    expect(parseInteger('-', 10).success).toBe(false)
  })

  it('returns error for invalid chars', () => {
    expect(parseInteger('2FZ', 10).success).toBe(false)
  })

  it('returns error for invalid base', () => {
    expect(parseInteger('10', 1).success).toBe(false)
  })

  it('handles large numbers', () => {
    const res = parseInteger('12345678901234567890', 10)
    expect(res.success).toBe(true)
    expect(res.value).toBe(BigInt('12345678901234567890'))
  })
})

describe('charToDigit', () => {
  it('maps digits 0-9', () => {
    expect(charToDigit('5', 10)).toBe(5)
    expect(charToDigit('0', 2)).toBe(0)
  })

  it('maps uppercase letters', () => {
    expect(charToDigit('A', 16)).toBe(10)
    expect(charToDigit('F', 16)).toBe(15)
  })

  it('maps lowercase to same as uppercase for base <= 36', () => {
    expect(charToDigit('a', 16)).toBe(10)
    expect(charToDigit('f', 16)).toBe(15)
  })

  it('returns -1 for invalid chars', () => {
    expect(charToDigit('G', 16)).toBe(-1)
    expect(charToDigit('2', 2)).toBe(-1)
  })
})

describe('detectBasePrefix', () => {
  it('detects 0x prefix', () => {
    expect(detectBasePrefix('0xFF')).toEqual({ base: 16, cleaned: 'FF' })
  })

  it('detects 0b prefix', () => {
    expect(detectBasePrefix('0b1010')).toEqual({ base: 2, cleaned: '1010' })
  })

  it('detects 0o prefix', () => {
    expect(detectBasePrefix('0o77')).toEqual({ base: 8, cleaned: '77' })
  })

  it('returns null for no prefix', () => {
    expect(detectBasePrefix('255')).toBeNull()
  })
})

describe('formatBigInt', () => {
  it('formats zero', () => {
    expect(formatBigInt(BigInt(0), 10)).toBe('0')
  })

  it('formats decimal', () => {
    expect(formatBigInt(BigInt(255), 10)).toBe('255')
  })

  it('formats hex', () => {
    expect(formatBigInt(BigInt(255), 16)).toBe('FF')
  })

  it('formats negative', () => {
    expect(formatBigInt(BigInt(-15), 16)).toBe('-F')
  })

  it('formats binary', () => {
    expect(formatBigInt(BigInt(10), 2)).toBe('1010')
  })
})
