import { describe, it, expect } from 'vitest'
import { validateCsv } from '../src/tools/utils/validateCsv'

describe('validateCsv', () => {
  it('validates correct CSV', () => {
    const res = validateCsv('a,b\n1,2')
    expect(res.success).toBe(true)
    expect(res.result.rowCount).toBe(2)
    expect(res.result.colCount).toBe(2)
  })

  it('detects unclosed quotes', () => {
    const res = validateCsv('"unclosed\n1,2')
    expect(res.success).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('warns on column mismatch', () => {
    const res = validateCsv('a,b\n1')
    expect(res.success).toBe(true)
    expect(res.result.warnings.length).toBeGreaterThan(0)
  })

  it('returns invalid for empty input', () => {
    const res = validateCsv('')
    expect(res.success).toBe(false)
  })
})
