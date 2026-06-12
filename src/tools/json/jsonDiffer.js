/**
 * JSON Diff Engine
 * Compares two JSON objects and finds Added, Removed, Changed differences.
 */

/**
 * Deep compare two JSON values and return diff entries.
 * @param {*} left - Original value
 * @param {*} right - New value
 * @param {string} path - Current JSON path (e.g. "$.user.name")
 * @param {object} options - { ignoreKeyOrder, ignoreArrayOrder }
 * @returns {Array<{type: 'added'|'removed'|'changed', path: string, before: *, after: *}>}
 */
function diff(left, right, path, options) {
  const results = []

  // Both null/undefined
  if (left === right) return results

  // One is null/undefined
  if (left === undefined || left === null) {
    if (right !== undefined && right !== null) {
      results.push({ type: 'added', path, before: left, after: right })
    }
    return results
  }
  if (right === undefined || right === null) {
    results.push({ type: 'removed', path, before: left, after: right })
    return results
  }

  // Type mismatch
  if (typeof left !== typeof right) {
    results.push({ type: 'changed', path, before: left, after: right })
    return results
  }

  // Primitive comparison
  if (typeof left !== 'object') {
    if (left !== right) {
      results.push({ type: 'changed', path, before: left, after: right })
    }
    return results
  }

  // Both arrays
  if (Array.isArray(left) && Array.isArray(right)) {
    if (options.ignoreArrayOrder) {
      // Compare as sets (by JSON stringification of elements)
      const leftSet = new Set(left.map(v => JSON.stringify(v)))
      const rightSet = new Set(right.map(v => JSON.stringify(v)))

      for (const item of right) {
        if (!leftSet.has(JSON.stringify(item))) {
          results.push({ type: 'added', path, before: undefined, after: item })
        }
      }
      for (const item of left) {
        if (!rightSet.has(JSON.stringify(item))) {
          results.push({ type: 'removed', path, before: item, after: undefined })
        }
      }
    } else {
      // Compare by index
      const maxLen = Math.max(left.length, right.length)
      for (let i = 0; i < maxLen; i++) {
        const subPath = `${path}[${i}]`
        if (i >= left.length) {
          results.push({ type: 'added', path: subPath, before: undefined, after: right[i] })
        } else if (i >= right.length) {
          results.push({ type: 'removed', path: subPath, before: left[i], after: undefined })
        } else {
          results.push(...diff(left[i], right[i], subPath, options))
        }
      }
    }
    return results
  }

  // One is array, other is not
  if (Array.isArray(left) !== Array.isArray(right)) {
    results.push({ type: 'changed', path, before: left, after: right })
    return results
  }

  // Both objects
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)

  const rightKeySet = new Set(rightKeys)

  for (const key of leftKeys) {
    const subPath = `${path}.${key}`
    if (!rightKeySet.has(key)) {
      results.push({ type: 'removed', path: subPath, before: left[key], after: undefined })
    } else {
      results.push(...diff(left[key], right[key], subPath, options))
    }
  }

  for (const key of rightKeys) {
    if (!(key in left)) {
      const subPath = `${path}.${key}`
      results.push({ type: 'added', path: subPath, before: undefined, after: right[key] })
    }
  }

  return results
}

/**
 * Compare two JSON strings
 * @param {string} leftStr - Original JSON string
 * @param {string} rightStr - New JSON string
 * @param {object} options - { ignoreWhitespace, ignoreKeyOrder, ignoreArrayOrder }
 * @returns {{ success: boolean, diffs: Array, stats: {added:number,removed:number,changed:number}, error?: string }}
 */
export function compareJson(leftStr, rightStr, options = {}) {
  let left, right

  try {
    left = JSON.parse(leftStr)
  } catch (e) {
    return { success: false, diffs: [], stats: { added: 0, removed: 0, changed: 0 }, error: `Original JSON: ${e.message}` }
  }

  try {
    right = JSON.parse(rightStr)
  } catch (e) {
    return { success: false, diffs: [], stats: { added: 0, removed: 0, changed: 0 }, error: `New JSON: ${e.message}` }
  }

  // If ignoreKeyOrder, sort object keys recursively before comparing
  if (options.ignoreKeyOrder) {
    left = sortKeysDeep(left)
    right = sortKeysDeep(right)
  }

  const diffs = diff(left, right, '$', options)

  const stats = {
    added: diffs.filter(d => d.type === 'added').length,
    removed: diffs.filter(d => d.type === 'removed').length,
    changed: diffs.filter(d => d.type === 'changed').length,
  }

  return { success: true, diffs, stats }
}

function sortKeysDeep(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(sortKeysDeep)
  const sorted = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeysDeep(obj[key])
  }
  return sorted
}

/**
 * Format diff results as readable text
 */
export function formatDiffText(diffs) {
  if (diffs.length === 0) return 'No difference found.'

  const lines = []
  for (const d of diffs) {
    const label = d.type === 'added' ? 'Added' : d.type === 'removed' ? 'Removed' : 'Changed'
    lines.push(`${label}: ${d.path}`)
    if (d.type === 'added') {
      lines.push(`  + ${formatValue(d.after)}`)
    } else if (d.type === 'removed') {
      lines.push(`  - ${formatValue(d.before)}`)
    } else {
      lines.push(`  - ${formatValue(d.before)}`)
      lines.push(`  + ${formatValue(d.after)}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function formatValue(v) {
  if (v === undefined) return 'undefined'
  if (v === null) return 'null'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
