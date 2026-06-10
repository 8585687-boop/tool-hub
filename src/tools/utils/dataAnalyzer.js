const AGGREGATIONS = {
  sum: (values) => values.reduce((a, b) => a + b, 0),
  avg: (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
  count: (values) => values.length,
  max: (values) => Math.max(...values),
  min: (values) => Math.min(...values)
}

export function aggregateData(data, config) {
  const { xField, yFields, method } = config
  if (!xField || !yFields || yFields.length === 0) return []

  const groups = {}
  data.forEach(row => {
    const key = String(row[xField] ?? '')
    if (!groups[key]) groups[key] = {}
    yFields.forEach(yf => {
      if (!groups[key][yf]) groups[key][yf] = []
      const val = Number(row[yf])
      if (!isNaN(val)) groups[key][yf].push(val)
    })
  })

  const aggFn = AGGREGATIONS[method] || AGGREGATIONS.sum

  return Object.entries(groups).map(([key, fields]) => {
    const result = { [xField]: key }
    yFields.forEach(yf => {
      result[yf] = Math.round(aggFn(fields[yf] || []) * 100) / 100
    })
    return result
  })
}

export function computeStats(data, column) {
  const values = data
    .map(row => Number(row[column]))
    .filter(v => !isNaN(v))

  if (values.length === 0) return null

  const sum = values.reduce((a, b) => a + b, 0)
  const avg = sum / values.length
  const sorted = [...values].sort((a, b) => a - b)
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  return {
    count: values.length,
    sum: Math.round(sum * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    max: Math.max(...values),
    min: Math.min(...values),
    median: Math.round(median * 100) / 100
  }
}
