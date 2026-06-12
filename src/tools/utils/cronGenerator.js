/**
 * Cron Expression Generator & Validator
 * Supports standard 5-field cron: minute hour day month weekday
 */

const FIELDS = [
  { name: 'minute', label: 'Minute', min: 0, max: 59 },
  { name: 'hour', label: 'Hour', min: 0, max: 23 },
  { name: 'day', label: 'Day of Month', min: 1, max: 31 },
  { name: 'month', label: 'Month', min: 1, max: 12 },
  { name: 'weekday', label: 'Weekday', min: 0, max: 7 }, // 0 and 7 both = Sunday
]

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ========== Templates ==========
export const CRON_TEMPLATES = [
  { label: 'Every minute', cron: '* * * * *' },
  { label: 'Every 5 minutes', cron: '*/5 * * * *' },
  { label: 'Every hour', cron: '0 * * * *' },
  { label: 'Daily midnight', cron: '0 0 * * *' },
  { label: 'Daily 2 AM', cron: '0 2 * * *' },
  { label: 'Weekly Monday', cron: '0 0 * * 1' },
  { label: 'Monthly', cron: '0 0 1 * *' },
]

// ========== Builder: field value → cron part ==========
export function buildCronPart(mode, value, rangeStart, rangeEnd, stepValue, specificValues) {
  switch (mode) {
    case 'every':
      return '*'
    case 'specific':
      if (specificValues && specificValues.length > 0) {
        return [...specificValues].sort((a, b) => a - b).join(',')
      }
      return '*'
    case 'range':
      if (rangeStart !== '' && rangeEnd !== '') {
        return `${rangeStart}-${rangeEnd}`
      }
      return '*'
    case 'step':
      if (stepValue) {
        return `*/${stepValue}`
      }
      return '*'
    default:
      return '*'
  }
}

export function buildCronExpression(parts) {
  return [
    parts.minute || '*',
    parts.hour || '*',
    parts.day || '*',
    parts.month || '*',
    parts.weekday || '*',
  ].join(' ')
}

// ========== Validator ==========
export function validateCron(expression) {
  const errors = []
  const parts = expression.trim().split(/\s+/)

  if (parts.length !== 5) {
    errors.push({ field: 'general', message: 'Cron must contain 5 fields' })
    return { valid: false, errors }
  }

  const ranges = [
    { name: 'minute', min: 0, max: 59 },
    { name: 'hour', min: 0, max: 23 },
    { name: 'day', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12 },
    { name: 'weekday', min: 0, max: 7 },
  ]

  for (let i = 0; i < 5; i++) {
    const part = parts[i]
    const range = ranges[i]
    const err = validateCronPart(part, range)
    if (err) {
      errors.push({ field: range.name, message: err })
    }
  }

  return errors.length === 0 ? { valid: true, errors: [] } : { valid: false, errors }
}

function validateCronPart(part, range) {
  if (part === '*') return null

  // Handle multiple comma-separated values
  const segments = part.split(',')
  for (const seg of segments) {
    const err = validateSegment(seg, range)
    if (err) return err
  }
  return null
}

function validateSegment(seg, range) {
  // Step: */N or N-M/S
  if (seg.includes('/')) {
    const [base, step] = seg.split('/')
    const stepNum = Number(step)
    if (isNaN(stepNum) || stepNum <= 0) {
      return `Invalid step value in ${range.name}: ${step}`
    }
    if (base !== '*') {
      const err = validateSegment(base, range)
      if (err) return err
    }
    return null
  }

  // Range: N-M
  if (seg.includes('-')) {
    const [start, end] = seg.split('-')
    const s = Number(start)
    const e = Number(end)
    if (isNaN(s) || isNaN(e)) {
      return `Invalid range in ${range.name}: ${seg}`
    }
    if (s < range.min || s > range.max) {
      return `${capitalize(range.name)} must be between ${range.min}-${range.max}`
    }
    if (e < range.min || e > range.max) {
      return `${capitalize(range.name)} must be between ${range.min}-${range.max}`
    }
    if (s > e) {
      return `Range start (${s}) is greater than end (${e}) in ${range.name}`
    }
    return null
  }

  // Single value
  const num = Number(seg)
  if (isNaN(num)) {
    return `Invalid value in ${range.name}: ${seg}`
  }
  if (num < range.min || num > range.max) {
    return `${capitalize(range.name)} must be between ${range.min}-${range.max}`
  }
  // weekday 7 is valid (means Sunday, same as 0)
  if (range.name === 'weekday' && num === 7) return null

  return null
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ========== Human-readable description ==========
export function describeCron(expression) {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return 'Invalid cron expression'

  const [minute, hour, day, month, weekday] = parts

  // Every minute
  if (minute === '*' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs every minute'
  }

  // Every N minutes
  if (minute.startsWith('*/') && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    const n = minute.split('/')[1]
    return `Runs every ${n} minutes`
  }

  // Every hour
  if (minute === '0' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs every hour'
  }

  // Every N hours
  if (minute === '0' && hour.startsWith('*/') && day === '*' && month === '*' && weekday === '*') {
    const n = hour.split('/')[1]
    return `Runs every ${n} hours`
  }

  // Specific time every day
  if (isSpecific(minute) && isSpecific(hour) && day === '*' && month === '*' && weekday === '*') {
    const h = parseInt(hour)
    const m = parseInt(minute)
    const timeStr = formatTime(h, m)
    return `Runs every day at ${timeStr}`
  }

  // Specific time on weekdays
  if (isSpecific(minute) && isSpecific(hour) && day === '*' && month === '*' && isRangeOrSpecific(weekday)) {
    const h = parseInt(hour)
    const m = parseInt(minute)
    const dayStr = describeWeekday(weekday)
    // Midnight on specific weekday
    if (h === 0 && m === 0 && isSpecific(weekday)) {
      return `Runs every ${dayStr} at midnight`
    }
    const timeStr = formatTime(h, m)
    return `Runs ${dayStr} at ${timeStr}`
  }

  // Specific time on specific day of month
  if (isSpecific(minute) && isSpecific(hour) && isSpecific(day) && month === '*' && weekday === '*') {
    const h = parseInt(hour)
    const m = parseInt(minute)
    const d = parseInt(day)
    // Monthly on first day
    if (d === 1 && h === 0 && m === 0) {
      return 'Runs on first day of every month'
    }
    const timeStr = formatTime(h, m)
    return `Runs on day ${d} of every month at ${timeStr}`
  }

  // Step with range: e.g. */10 8-18 * * 1-5
  let desc = 'Runs'

  // Minute description
  if (minute.startsWith('*/')) {
    desc += ` every ${minute.split('/')[1]} minutes`
  } else if (minute === '*') {
    desc += ' every minute'
  } else {
    desc += ` at minute ${minute}`
  }

  // Hour description
  if (hour.includes('-') && !hour.includes('/')) {
    const [start, end] = hour.split('-')
    desc += ` from ${formatHour(parseInt(start))} to ${formatHour(parseInt(end))}`
  } else if (hour.startsWith('*/')) {
    desc += ` every ${hour.split('/')[1]} hours`
  } else if (hour !== '*') {
    desc += ` at ${formatHour(parseInt(hour))}`
  }

  // Weekday description
  if (weekday !== '*') {
    desc += ` ${describeWeekday(weekday)}`
  }

  // Day description
  if (day !== '*') {
    desc += ` on day ${day}`
  }

  // Month description
  if (month !== '*') {
    desc += ` in ${month}`
  }

  return desc
}

function isSpecific(part) {
  return /^\d+$/.test(part)
}

function isRangeOrSpecific(part) {
  return /^\d+$/.test(part) || part.includes('-') || part.includes(',')
}

function formatTime(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatHour(h) {
  if (h === 0) return 'midnight'
  if (h === 12) return 'noon'
  if (h < 12) return `${String(h).padStart(2, '0')}:00 AM`
  return `${String(h - 12).padStart(2, '0')}:00 PM`
}

function describeWeekday(weekday) {
  if (weekday.includes('-')) {
    const [start, end] = weekday.split('-').map(Number)
    return `${WEEKDAY_NAMES[start]}-${WEEKDAY_NAMES[end]}`
  }
  if (weekday.includes(',')) {
    return weekday.split(',').map(n => WEEKDAY_NAMES[parseInt(n)]).join(', ')
  }
  const n = parseInt(weekday)
  if (n === 7) return WEEKDAY_NAMES[0] // 7 = Sunday
  return WEEKDAY_NAMES[n]
}
