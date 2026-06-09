function isValidBase64(str) {
  return /^[A-Za-z0-9+/]*={0,2}$/.test(str) && str.length % 4 === 0
}

export function decodeBase64(text) {
  if (!isValidBase64(text)) {
    return { success: false, error: 'Invalid Base64 input' }
  }

  try {
    const binary = atob(text)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    return { success: true, result: new TextDecoder().decode(bytes) }
  } catch (e) {
    return { success: false, error: 'Invalid Base64 input' }
  }
}
