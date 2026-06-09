export async function generateHash(text, algorithm = 'SHA-256') {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return { success: true, result: hashHex }
  } catch (e) {
    return { success: false, error: 'Failed to generate hash' }
  }
}
