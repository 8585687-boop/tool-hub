/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { formatXML, validateXML, xmlToJson } from '../src/tools/format/xmlFormatter'

describe('formatXML', () => {
  it('formats simple XML', () => {
    const res = formatXML('<root><item>1</item><item>2</item></root>')
    expect(res.success).toBe(true)
    expect(res.result).toContain('<root>')
    expect(res.result).toContain('<item>')
  })

  it('formats nested elements with attributes', () => {
    const res = formatXML('<a><b attr="x">text</b></a>')
    expect(res.success).toBe(true)
    expect(res.result).toContain('attr="x"')
    expect(res.result).toContain('text')
  })

  it('returns error for invalid XML', () => {
    const res = formatXML('<a><b></a>')
    expect(res.success).toBe(false)
    expect(res.error).toBeTruthy()
  })

  it('returns error for empty input', () => {
    const res = formatXML('')
    expect(res.success).toBe(false)
  })
})

describe('validateXML', () => {
  it('validates correct XML', () => {
    const res = validateXML('<root>ok</root>')
    expect(res.success).toBe(true)
  })

  it('catches mismatched tags', () => {
    const res = validateXML('<a><b></a>')
    expect(res.success).toBe(false)
  })
})

describe('xmlToJson', () => {
  it('converts XML to JSON', () => {
    const res = xmlToJson('<person><name>Tom</name><age>30</age></person>')
    expect(res.success).toBe(true)
    const obj = JSON.parse(res.result)
    expect(obj.name).toBe('Tom')
    expect(obj.age).toBe('30')
  })
})
