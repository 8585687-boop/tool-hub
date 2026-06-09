const POLYNOMIALS = {
  'CRC-32': 0xEDB88320,
  'CRC-32C': 0x82F63B78,
  'CRC-32/BZIP2': 0x04C11DB7,
  'CRC-32/JAMCRC': 0xEDB88320,
}

const tables = {}

function makeCRCTable(polynomial) {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (polynomial ^ (c >>> 1)) : (c >>> 1)
    }
    table[n] = c >>> 0
  }
  return table
}

function getTable(variant) {
  if (!tables[variant]) {
    const poly = POLYNOMIALS[variant] || POLYNOMIALS['CRC-32']
    tables[variant] = makeCRCTable(poly)
  }
  return tables[variant]
}

function computeCRC32(bytes, table, variant) {
  let crc = 0xFFFFFFFF
  for (const byte of bytes) {
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xFF]
  }
  // JAMCRC does NOT invert the final value
  if (variant === 'CRC-32/JAMCRC') {
    return crc >>> 0
  }
  // BZIP2 uses non-reflected algorithm, but we use reflected poly
  // For BZIP2 we need to handle differently - use big-endian approach
  return (crc ^ 0xFFFFFFFF) >>> 0
}

// BZIP2 uses non-reflected polynomial, separate implementation
function computeCRC32Bzip2(bytes) {
  const poly = 0x04C11DB7
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n << 24
    for (let k = 0; k < 8; k++) {
      c = (c & 0x80000000) ? ((c << 1) ^ poly) : (c << 1)
    }
    table[n] = c >>> 0
  }

  let crc = 0xFFFFFFFF
  for (const byte of bytes) {
    crc = ((crc << 8) ^ table[((crc >>> 24) ^ byte) & 0xFF]) >>> 0
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

export function calcCRC32(text, variant = 'CRC-32') {
  if (text === null || text === undefined) {
    return { success: false, error: 'Input is required' }
  }

  const supportedVariants = Object.keys(POLYNOMIALS)
  if (!supportedVariants.includes(variant)) {
    return { success: false, error: `Unsupported variant: ${variant}` }
  }

  try {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(text)

    let crc
    if (variant === 'CRC-32/BZIP2') {
      crc = computeCRC32Bzip2(bytes)
    } else {
      const table = getTable(variant)
      crc = computeCRC32(bytes, table, variant)
    }

    const hex = '0x' + crc.toString(16).toUpperCase().padStart(8, '0')

    return {
      success: true,
      result: hex,
      crcDec: crc,
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
