export function minifyJSON(text) {
  try {
    const data = JSON.parse(text)
    return {
      success: true,
      result: JSON.stringify(data)
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
