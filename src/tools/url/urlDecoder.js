export function decodeUrl(text) {
  try {
    return { success: true, result: decodeURIComponent(text) }
  } catch (e) {
    return { success: false, error: 'Invalid URL-encoded string' }
  }
}
