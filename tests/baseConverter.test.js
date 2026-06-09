import { describe, it, expect } from 'vitest'
import { convertBase } from '../src/tools/number/baseConverter'

describe('convertBase', () => {
  it('converts binary to decimal', () => {
    const res = convertBase('1010', 2, 10)
    expect(res.success).toBe(true)
    expect(res.result).toBe('10')
  })

  it('converts hex to decimal', () => {
    const res = convertBase('FF', 16, 10)
    expect(res.success).toBe(true)
    expect(res.result).toBe('255')
  })

  it('converts decimal to binary', () => {
    const res = convertBase('100', 10, 2)
    expect(res.success).toBe(true)
    expect(res.result).toBe('1100100')
  })

  it('converts decimal to hex', () => {
    const res = convertBase('255', 10, 16)
    expect(res.success).toBe(true)
    expect(res.result).toBe('FF')
  })

  it('handles negative numbers', () => {
    const res = convertBase('-15', 10, 16)
    expect(res.success).toBe(true)
    expect(res.result).toBe('-F')
  })

  it('handles plus sign', () => {
    const res = convertBase('+101', 2, 10)
    expect(res.success).toBe(true)
    expect(res.result).toBe('5')
  })

  it('handles large numbers with BigInt', () => {
    const res = convertBase('12345678901234567890', 10, 16)
    expect(res.success).toBe(true)
    expect(res.result).toBe('AB54A98CEB1F0AD2')
  })

  it('handles lowercase hex input', () => {
    const res = convertBase('face', 16, 10)
    expect(res.success).toBe(true)
    expect(res.result).toBe('64206')
  })

  it('returns 0 for zero input', () => {
    const res = convertBase('0', 10, 2)
    expect(res.success).toBe(true)
    expect(res.result).toBe('0')
  })

  it('returns error for empty input', () => {
    const res = convertBase('', 10, 2)
    expect(res.success).toBe(false)
  })

  it('returns error for sign-only input', () => {
    const res = convertBase('-', 10, 2)
    expect(res.success).toBe(false)
  })

  it('returns error for invalid characters', () => {
    const res = convertBase('2FZ', 10, 2)
    expect(res.success).toBe(false)
    expect(res.error).toContain('F')
  })

  it('returns error for invalid base range', () => {
    const res = convertBase('10', 1, 10)
    expect(res.success).toBe(false)
    expect(res.error).toContain('base')
  })

  it('converts base62', () => {
    const res = convertBase('10', 62, 10)
    expect(res.success).toBe(true)
    expect(res.result).toBe('62')
  })
})
