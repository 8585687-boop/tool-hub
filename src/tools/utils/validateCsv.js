import { parseCsvLine } from './inputUtils.js'

export function validateCsv(input, delimiter = ',') {
  if (!input || !input.trim()) {
    return { success: false, error: 'CSV input is empty' }
  }

  const errors = []
  const warnings = []
  const lines = input.split(/\r?\n/).filter(line => line.trim() !== '')

  if (lines.length === 0) {
    return { success: false, error: 'No data rows found' }
  }

  // Check quote pairing
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const quoteCount = (line.match(/"/g) || []).length
    if (quoteCount % 2 !== 0) {
      errors.push(`Row ${i + 1}: Unclosed quote`)
    }
  }

  // Check column consistency
  const colCounts = lines.map(line => parseCsvLine(line, delimiter).length)
  const firstCount = colCounts[0]
  const inconsistentRows = []
  for (let i = 1; i < colCounts.length; i++) {
    if (colCounts[i] !== firstCount) {
      inconsistentRows.push(i + 1)
    }
  }

  if (inconsistentRows.length > 0) {
    warnings.push(
      `Column count mismatch: header has ${firstCount} columns, rows [${inconsistentRows.join(', ')}] differ`
    )
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join('; ') }
  }

  return {
    success: true,
    result: {
      warnings,
      rowCount: lines.length,
      colCount: firstCount,
    }
  }
}
