function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) base64 += '='.repeat(4 - pad)
  return atob(base64)
}

export function decodeJWT(token) {
  try {
    const parts = token.trim().split('.')
    if (parts.length < 2 || parts.length > 3) {
      return { success: false, error: 'Invalid JWT: must have 2-3 parts separated by dots (header.payload[.signature])' }
    }

    // Decode header
    let header
    try {
      header = JSON.parse(base64UrlDecode(parts[0]))
    } catch {
      return { success: false, error: 'Invalid JWT header: unable to decode Base64URL part' }
    }

    // Decode payload
    let payload
    try {
      payload = JSON.parse(base64UrlDecode(parts[1]))
    } catch {
      const raw = base64UrlDecode(parts[1])
      return {
        success: false,
        error: 'Invalid JWT payload: unable to parse JSON from decoded content',
        detail: raw
      }
    }

    const signature = parts[2] || ''

    return {
      success: true,
      result: { header, payload, signature },
      header,
      payload,
      signature
    }
  } catch (e) {
    return { success: false, error: 'Invalid JWT: unable to decode token — ' + e.message }
  }
}
