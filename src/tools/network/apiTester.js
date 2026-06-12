const HISTORY_KEY = 'api-tester-history'
const MAX_HISTORY = 20

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']

export const METHOD_COLORS = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  PATCH: '#50e3c2',
  DELETE: '#f93e3e',
  OPTIONS: '#0d5aa7',
  HEAD: '#8e8e8e',
}

export function buildUrl(baseUrl, params) {
  if (!params || params.length === 0) return baseUrl
  const searchParams = new URLSearchParams()
  params.forEach(({ key, value }) => {
    if (key.trim()) searchParams.append(key.trim(), value)
  })
  const qs = searchParams.toString()
  if (!qs) return baseUrl
  const separator = baseUrl.includes('?') ? '&' : '?'
  return baseUrl + separator + qs
}

export function buildHeaders(headerRows) {
  const headers = {}
  headerRows.forEach(({ key, value }) => {
    if (key.trim()) headers[key.trim()] = value
  })
  return headers
}

export async function sendRequest({ method, url, headers, body, timeout = 15000 }) {
  const start = performance.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const options = {
      method,
      headers,
      signal: controller.signal,
    }
    if (method !== 'GET' && method !== 'HEAD' && body) {
      options.body = body
      if (!headers['Content-Type'] && !headers['content-type']) {
        options.headers['Content-Type'] = 'application/json'
      }
    }

    const response = await fetch(url, options)
    clearTimeout(timer)
    const time = Math.round(performance.now() - start)

    const contentType = response.headers.get('content-type') || ''
    let responseBody
    let isJson = false

    if (contentType.includes('application/json')) {
      try {
        responseBody = await response.json()
        isJson = true
      } catch {
        responseBody = await response.text()
      }
    } else {
      responseBody = await response.text()
      try {
        responseBody = JSON.parse(responseBody)
        isJson = true
      } catch { /* not JSON */ }
    }

    const responseHeaders = {}
    response.headers.forEach((v, k) => { responseHeaders[k] = v })

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      time,
      size: isJson ? JSON.stringify(responseBody).length : String(responseBody).length,
      headers: responseHeaders,
      body: responseBody,
      isJson,
    }
  } catch (err) {
    clearTimeout(timer)
    const time = Math.round(performance.now() - start)
    if (err.name === 'AbortError') {
      return { success: false, error: `Request timed out after ${timeout / 1000}s`, time }
    }
    return { success: false, error: err.message, time }
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []
  } catch {
    return []
  }
}

export function saveHistory(entry) {
  const history = loadHistory()
  history.unshift({
    method: entry.method,
    url: entry.url,
    timestamp: Date.now(),
    status: entry.status,
  })
  const trimmed = history.slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  return trimmed
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
  return []
}
