export function convertCase(text, type) {
  if (!text) return { success: true, result: '' }

  switch (type) {
    case 'uppercase':
      return { success: true, result: text.toUpperCase() }
    case 'lowercase':
      return { success: true, result: text.toLowerCase() }
    case 'title':
      return { success: true, result: text.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) }
    default:
      return { success: false, error: 'Unknown case type' }
  }
}
