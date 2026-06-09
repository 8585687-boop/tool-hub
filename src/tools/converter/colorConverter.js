export function convertColor(input, format) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter a color value' }
  }

  const trimmed = input.trim()
  let r, g, b

  try {
    if (format === 'HEX' || trimmed.startsWith('#')) {
      const parsed = parseHex(trimmed)
      r = parsed.r; g = parsed.g; b = parsed.b
    } else if (format === 'RGB' || trimmed.startsWith('rgb')) {
      const parsed = parseRgb(trimmed)
      r = parsed.r; g = parsed.g; b = parsed.b
    } else if (format === 'HSL' || trimmed.startsWith('hsl')) {
      const parsed = parseHsl(trimmed)
      const rgb = hslToRgb(parsed.h, parsed.s, parsed.l)
      r = rgb.r; g = rgb.g; b = rgb.b
    } else if (format === 'CMYK' || trimmed.startsWith('cmyk')) {
      const parsed = parseCmyk(trimmed)
      const rgb = cmykToRgb(parsed.c, parsed.m, parsed.y, parsed.k)
      r = rgb.r; g = rgb.g; b = rgb.b
    } else {
      // Try auto-detect
      if (trimmed.startsWith('#')) {
        const parsed = parseHex(trimmed)
        r = parsed.r; g = parsed.g; b = parsed.b
      } else if (trimmed.startsWith('rgb')) {
        const parsed = parseRgb(trimmed)
        r = parsed.r; g = parsed.g; b = parsed.b
      } else if (trimmed.startsWith('hsl')) {
        const parsed = parseHsl(trimmed)
        const rgb = hslToRgb(parsed.h, parsed.s, parsed.l)
        r = rgb.r; g = rgb.g; b = rgb.b
      } else if (trimmed.startsWith('cmyk')) {
        const parsed = parseCmyk(trimmed)
        const rgb = cmykToRgb(parsed.c, parsed.m, parsed.y, parsed.k)
        r = rgb.r; g = rgb.g; b = rgb.b
      } else {
        return { success: false, error: 'Unrecognized color format' }
      }
    }

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      return { success: false, error: 'Color values out of range (0-255)' }
    }

    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    const cmyk = rgbToCmyk(r, g, b)

    return {
      success: true,
      result: {
        hex: hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        r, g, b,
      },
    }
  } catch (e) {
    return { success: false, error: e.message || 'Invalid color format' }
  }
}

function parseHex(str) {
  let hex = str.replace('#', '')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) throw new Error('Invalid HEX format')
  const num = parseInt(hex, 16)
  if (isNaN(num)) throw new Error('Invalid HEX characters')
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function parseRgb(str) {
  const match = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!match) throw new Error('Invalid RGB format')
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
}

function parseHsl(str) {
  const match = str.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/)
  if (!match) throw new Error('Invalid HSL format')
  return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) }
}

function parseCmyk(str) {
  const match = str.match(/cmyk\(\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?/)
  if (!match) throw new Error('Invalid CMYK format')
  return { c: parseInt(match[1]), m: parseInt(match[2]), y: parseInt(match[3]), k: parseInt(match[4]) }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase()
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

function rgbToCmyk(r, g, b) {
  const rr = r / 255, gg = g / 255, bb = b / 255
  const k = 1 - Math.max(rr, gg, bb)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  const c = (1 - rr - k) / (1 - k)
  const m = (1 - gg - k) / (1 - k)
  const y = (1 - bb - k) / (1 - k)
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  }
}

function cmykToRgb(c, m, y, k) {
  c /= 100; m /= 100; y /= 100; k /= 100
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  }
}
