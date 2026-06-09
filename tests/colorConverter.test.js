import { describe, it, expect } from 'vitest'
import { convertColor } from '../src/tools/converter/colorConverter'

describe('convertColor', () => {
  it('converts HEX to all formats', () => {
    const res = convertColor('#00FF00', 'HEX')
    expect(res.success).toBe(true)
    expect(res.result.hex).toBe('#00FF00')
    expect(res.result.rgb).toBe('rgb(0, 255, 0)')
    expect(res.result.hsl).toBe('hsl(120, 100%, 50%)')
    expect(res.result.cmyk).toBe('cmyk(100%, 0%, 100%, 0%)')
  })

  it('converts RGB to all formats', () => {
    const res = convertColor('rgb(255, 0, 0)', 'RGB')
    expect(res.success).toBe(true)
    expect(res.result.hex).toBe('#FF0000')
    expect(res.result.hsl).toBe('hsl(0, 100%, 50%)')
  })

  it('converts HSL to all formats', () => {
    const res = convertColor('hsl(240, 100%, 50%)', 'HSL')
    expect(res.success).toBe(true)
    expect(res.result.hex).toBe('#0000FF')
  })

  it('converts CMYK white', () => {
    const res = convertColor('cmyk(0%, 0%, 0%, 0%)', 'CMYK')
    expect(res.success).toBe(true)
    expect(res.result.hex).toBe('#FFFFFF')
  })

  it('returns error for invalid HEX', () => {
    const res = convertColor('#GGHHHH', 'HEX')
    expect(res.success).toBe(false)
  })

  it('returns error for empty input', () => {
    const res = convertColor('', 'HEX')
    expect(res.success).toBe(false)
  })

  it('auto-detects HEX format', () => {
    const res = convertColor('#FF0000')
    expect(res.success).toBe(true)
    expect(res.result.rgb).toBe('rgb(255, 0, 0)')
  })
})
