import { parseJsonError } from './errorParser.js'

export function validateJson(input) {
  try {
    JSON.parse(input)
    return { success: true, error: null }
  } catch (e) {
    const error = parseJsonError(e, input)
    return { success: false, error }
  }
}
