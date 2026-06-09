export function encodeUrl(text) {
  try {
    return { success: true, result: encodeURIComponent(text) }
  } catch (e) {
    return { success: false, error: 'Failed to encode URL' }
  }
}
