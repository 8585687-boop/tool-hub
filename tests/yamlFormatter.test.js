import { describe, it, expect } from 'vitest'
import { formatYAML, validateYAML, yamlToJson } from '../src/tools/format/yamlFormatter'

describe('formatYAML', () => {
  it('formats simple mapping', () => {
    const res = formatYAML('name: John\nage: 30')
    expect(res.success).toBe(true)
    expect(res.result).toContain('name: John')
    expect(res.result).toContain('age: 30')
  })

  it('formats list', () => {
    const res = formatYAML('- apple\n- banana\n- cherry')
    expect(res.success).toBe(true)
    expect(res.result).toContain('- apple')
    expect(res.result).toContain('- banana')
  })

  it('returns error for invalid YAML', () => {
    const res = formatYAML('key: value: extra')
    expect(res.success).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('returns error for empty input', () => {
    const res = formatYAML('')
    expect(res.success).toBe(false)
  })
})

describe('validateYAML', () => {
  it('validates correct YAML', () => {
    const res = validateYAML('key: value')
    expect(res.success).toBe(true)
  })

  it('catches invalid YAML', () => {
    const res = validateYAML('key: value: extra')
    expect(res.success).toBe(false)
  })
})

describe('yamlToJson', () => {
  it('converts YAML to JSON', () => {
    const res = yamlToJson('name: John\nage: 30')
    expect(res.success).toBe(true)
    const obj = JSON.parse(res.result)
    expect(obj.name).toBe('John')
    expect(obj.age).toBe(30)
  })
})
