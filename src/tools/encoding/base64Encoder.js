export function encodeBase64(str) {
  try {
    const encoded = btoa(
      encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        (_, p) => String.fromCharCode(parseInt(p, 16))
      )
    )
    return { success: true, result: encoded }
  } catch (e) {
    return { success: false, error: e.message }
  }
}