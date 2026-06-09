import { parseCsvLine } from '../utils/inputUtils.js'

export function csvToJson(input, options = {}) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter CSV text' }
  }

  const delimiter = options.delimiter || ','
  const hasHeader = options.hasHeader !== false

  try {
    const lines = input.split(/\r?\n/).filter(line => line.trim() !== '')
    if (lines.length === 0) {
      return { success: false, error: 'No data to parse' }
    }

    const rows = lines.map(line => parseCsvLine(line, delimiter))

    let result
    if (hasHeader && rows.length > 0) {
      const keys = rows[0]
      const dataRows = rows.slice(1)
      const warnings = []

      result = dataRows.map((values, idx) => {
        const obj = {}
        keys.forEach((key, i) => {
          obj[key || `column_${i}`] = values[i] !== undefined ? values[i] : ''
        })
        if (values.length > keys.length) {
          warnings.push(`Row ${idx + 2}: ${values.length - keys.length} extra field(s)`)
        }
        if (values.length < keys.length) {
          warnings.push(`Row ${idx + 2}: ${keys.length - values.length} missing field(s)`)
        }
        return obj
      })

      if (warnings.length > 0) {
        return {
          success: true,
          result: JSON.stringify(result, null, 2),
          warning: `Field count mismatch:\n${warnings.join('\n')}`,
        }
      }
    } else {
      result = rows
    }

    return { success: true, result: JSON.stringify(result, null, 2) }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
