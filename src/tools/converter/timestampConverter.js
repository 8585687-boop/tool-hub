export function convertTimestamp(input, options = {}) {
  const { unit = 's', timeZone = 'UTC' } = options

  if (!input && input !== 0) {
    return { success: false, error: 'Please enter a timestamp or date string' }
  }

  try {
    let date
    const trimmed = String(input).trim()

    // Detect input type: number (unix timestamp) or string (ISO date)
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      const num = parseFloat(trimmed)
      // Treat as milliseconds if unit is 'ms' or number is very large (> 10^12 = ms after 2001)
      const ms = unit === 'ms' || num > 1e12 ? num : num * 1000
      date = new Date(ms)
    } else {
      date = new Date(trimmed)
    }

    if (isNaN(date.getTime())) {
      return { success: false, error: 'Invalid date format' }
    }

    const iso = date.toISOString()
    const unixMs = date.getTime()
    const unixSec = Math.floor(unixMs / 1000)

    // Local time representation
    const local = date.toLocaleString('en-US', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    // Timezone-specific representation
    let tzDisplay = ''
    try {
      tzDisplay = date.toLocaleString('en-US', {
        timeZone,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    } catch {
      tzDisplay = 'Invalid timezone'
    }

    // Relative time
    const now = Date.now()
    const diff = now - unixMs
    const relative = formatRelative(diff)

    return {
      success: true,
      result: {
        iso,
        unixSec,
        unixMs,
        local,
        tzDisplay,
        relative,
      },
    }
  } catch (e) {
    return { success: false, error: e.message || 'Invalid date format' }
  }
}

function formatRelative(diffMs) {
  const abs = Math.abs(diffMs)
  const isFuture = diffMs < 0
  const prefix = isFuture ? 'in ' : ''
  const suffix = isFuture ? '' : ' ago'

  if (abs < 1000) return 'just now'
  if (abs < 60000) return `${prefix}${Math.floor(abs / 1000)} seconds${suffix}`
  if (abs < 3600000) return `${prefix}${Math.floor(abs / 60000)} minutes${suffix}`
  if (abs < 86400000) return `${prefix}${Math.floor(abs / 3600000)} hours${suffix}`
  if (abs < 2592000000) return `${prefix}${Math.floor(abs / 86400000)} days${suffix}`
  if (abs < 31536000000) return `${prefix}${Math.floor(abs / 2592000000)} months${suffix}`
  return `${prefix}${Math.floor(abs / 31536000000)} years${suffix}`
}
