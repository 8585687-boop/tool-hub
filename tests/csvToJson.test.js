import { describe, it, expect } from 'vitest'
import { csvToJson } from '../src/tools/convert/csvToJson'

describe('csvToJson', () => {
  it('converts basic CSV with header', () => {
    const res = csvToJson('name,age\nAlice,30\nBob,25', { delimiter: ',', hasHeader: true })
    expect(res.success).toBe(true)
    const data = JSON.parse(res.result)
    expect(data).toHaveLength(2)
    expect(data[0]).toEqual({ name: 'Alice', age: '30' })
    expect(data[1]).toEqual({ name: 'Bob', age: '25' })
  })

  it('converts CSV without header', () => {
    const res = csvToJson('name,age\nAlice,30', { delimiter: ',', hasHeader: false })
    expect(res.success).toBe(true)
    const data = JSON.parse(res.result)
    expect(data).toHaveLength(2)
    expect(data[0]).toEqual(['name', 'age'])
  })

  it('handles semicolon delimiter', () => {
    const res = csvToJson('a;b;c\n1;2;3', { delimiter: ';', hasHeader: true })
    expect(res.success).toBe(true)
    const data = JSON.parse(res.result)
    expect(data[0]).toEqual({ a: '1', b: '2', c: '3' })
  })

  it('handles quoted fields with commas', () => {
    const res = csvToJson('"a","b"\n"1","2,2"', { delimiter: ',', hasHeader: true })
    expect(res.success).toBe(true)
    const data = JSON.parse(res.result)
    expect(data[0]).toEqual({ a: '1', b: '2,2' })
  })

  it('handles escaped double quotes', () => {
    const res = csvToJson('name\n"hello ""world"""', { delimiter: ',', hasHeader: true })
    expect(res.success).toBe(true)
    const data = JSON.parse(res.result)
    expect(data[0].name).toBe('hello "world"')
  })

  it('returns error for empty input', () => {
    const res = csvToJson('')
    expect(res.success).toBe(false)
  })

  it('warns on column count mismatch', () => {
    const res = csvToJson('a,b\n1', { delimiter: ',', hasHeader: true })
    expect(res.success).toBe(true)
    expect(res.warning).toBeTruthy()
  })
})
