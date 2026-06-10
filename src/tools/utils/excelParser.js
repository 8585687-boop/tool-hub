import * as XLSX from 'xlsx'

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheets = workbook.SheetNames.map(name => {
          const sheet = workbook.Sheets[name]
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
          return { name, data: json }
        })
        resolve({
          fileName: file.name,
          fileSize: file.size,
          sheets,
          sheetNames: workbook.SheetNames
        })
      } catch (err) {
        reject(new Error('Failed to parse file: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function detectColumnType(values) {
  const nonEmpty = values.filter(v => v !== '' && v !== null && v !== undefined)
  if (nonEmpty.length === 0) return 'empty'

  const sample = nonEmpty.slice(0, 100)
  let numCount = 0
  let dateCount = 0
  let boolCount = 0

  for (const v of sample) {
    if (typeof v === 'boolean' || v === 'true' || v === 'false') {
      boolCount++
    } else if (v instanceof Date) {
      dateCount++
    } else if (typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v)) && v.trim() !== '')) {
      numCount++
    }
  }

  const total = sample.length
  if (boolCount / total > 0.8) return 'boolean'
  if (numCount / total > 0.8) return 'number'
  if (dateCount / total > 0.8) return 'date'
  return 'text'
}

export function analyzeColumns(sheetData) {
  if (!sheetData || sheetData.length === 0) return []
  const keys = Object.keys(sheetData[0])
  return keys.map(key => {
    const values = sheetData.map(row => row[key])
    const type = detectColumnType(values)
    const missing = values.filter(v => v === '' || v === null || v === undefined).length
    return { name: key, type, missing, selected: true }
  })
}
