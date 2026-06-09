export function beautifyJSON(text) {
  try {
    const data = JSON.parse(text)
    return {
      success: true,
      result: JSON.stringify(data, null, 4)
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}
