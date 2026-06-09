function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  if (pad) base64 += '='.repeat(4 - pad)
  return atob(base64)
}

export function decodeJWT(token) {
  try {
    const parts = token.trim().split('.')
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT: must have 3 parts (header.payload.signature)' }
    }

    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))

    return {
      success: true,
      result: { header, payload, signature: parts[2] },
      header,
      payload,
      signature: parts[2]
    }
  } catch (e) {
    return { success: false, error: 'Invalid JWT: unable to decode token' }
  }
}
