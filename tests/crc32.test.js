import { describe, it, expect } from 'vitest'
import { calcCRC32 } from '../src/tools/crc/crc32'

describe('calcCRC32', () => {
  it('returns 0x00000000 for empty string', () => {
    const res = calcCRC32('', 'CRC-32')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0x00000000')
    expect(res.crcDec).toBe(0)
  })

  it('computes CRC-32 for "abc"', () => {
    const res = calcCRC32('abc', 'CRC-32')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0x352441C2')
  })

  it('computes CRC-32 for "123456789" (standard test)', () => {
    const res = calcCRC32('123456789', 'CRC-32')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0xCBF43926')
    expect(res.crcDec).toBe(3421780262)
  })

  it('computes CRC-32C for "123456789"', () => {
    const res = calcCRC32('123456789', 'CRC-32C')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0xE3069283')
    expect(res.crcDec).toBe(3808858755)
  })

  it('computes CRC-32 for Chinese text', () => {
    const res = calcCRC32('你好', 'CRC-32')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0x50A2B841')
  })

  it('CRC-32C differs from CRC-32 for same input', () => {
    const r1 = calcCRC32('hello', 'CRC-32')
    const r2 = calcCRC32('hello', 'CRC-32C')
    expect(r1.result).not.toBe(r2.result)
  })

  it('returns error for unsupported variant', () => {
    const res = calcCRC32('test', 'CRC-64')
    expect(res.success).toBe(false)
  })

  it('computes CRC-32/BZIP2 for "123456789"', () => {
    const res = calcCRC32('123456789', 'CRC-32/BZIP2')
    expect(res.success).toBe(true)
    expect(res.result).toBe('0xFC891918')
  })

  it('computes CRC-32/JAMCRC for "123456789"', () => {
    const res = calcCRC32('123456789', 'CRC-32/JAMCRC')
    expect(res.success).toBe(true)
    // JAMCRC is same as CRC-32 but without final XOR
    expect(res.result).toBe('0x340BC6D9')
  })
})
