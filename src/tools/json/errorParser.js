export function parseJsonError(error, input) {
  const msg = error.message

  // Extract position from error message
  const posMatch = msg.match(/position\s+(\d+)/i)
  const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i)

  let line = 0
  let column = 0
  let position = 0

  if (posMatch) {
    position = parseInt(posMatch[1], 10)
    const lines = input.substring(0, position).split('\n')
    line = lines.length
    column = lines[lines.length - 1].length + 1
  }

  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10)
    column = parseInt(lineColMatch[2], 10)
  }

  // Extract the raw error message (before "at position")
  let message = msg.replace(/\s*at position\s+\d+.*$/i, '').replace(/\s*\(line.*$/i, '').trim()

  // Generate friendly suggestions
  const suggestions = generateSuggestions(msg, input, line, column)

  // Get error context
  const context = getErrorContext(input, line, column)

  return {
    message,
    line,
    column,
    position,
    type: 'syntax',
    suggestions,
    context
  }
}

function generateSuggestions(msg, input, line, column) {
  const suggestions = []
  const lower = msg.toLowerCase()

  if (lower.includes("expected ','") || lower.includes("expected ',' or '}'")) {
    suggestions.push('Missing comma between properties or values')
    suggestions.push('Check if the previous line ends with a comma')
  }

  if (lower.includes("expected '}'") || lower.includes("expected ',' or '}'")) {
    suggestions.push('Extra comma before closing brace (trailing comma)')
    suggestions.push('Unclosed object or array')
  }

  if (lower.includes("expected ']'") || lower.includes("expected ',' or ']'")) {
    suggestions.push('Missing comma in array')
    suggestions.push('Trailing comma before closing bracket')
  }

  if (lower.includes("unexpected token") || lower.includes("unexpected character")) {
    suggestions.push('Check for invalid characters or unquoted strings')
    suggestions.push('Make sure all strings are wrapped in double quotes')
  }

  if (lower.includes("unexpected end")) {
    suggestions.push('Incomplete JSON — missing closing bracket or brace')
    suggestions.push('Check if the JSON was cut off')
  }

  if (lower.includes("unexpected number")) {
    suggestions.push('Check for invalid number format')
  }

  if (lower.includes("unexpected string")) {
    suggestions.push('Check for misplaced string value')
  }

  if (lower.includes("unexpected non-whitespace")) {
    suggestions.push('Extra content after valid JSON')
    suggestions.push('Check for duplicate closing brackets')
  }

  // Fallback
  if (suggestions.length === 0) {
    suggestions.push('Check JSON syntax near the error location')
    suggestions.push('Verify all brackets and braces are properly closed')
  }

  return suggestions
}

function getErrorContext(input, line, column) {
  if (!line || line <= 0) return null

  const lines = input.split('\n')
  if (line > lines.length) return null

  const startLine = Math.max(1, line - 2)
  const endLine = Math.min(lines.length, line + 2)

  const contextLines = []
  for (let i = startLine; i <= endLine; i++) {
    const content = lines[i - 1]
    const isError = i === line
    contextLines.push({
      line: i,
      content,
      isError
    })
  }

  return {
    lines: contextLines,
    errorLine: line,
    errorColumn: column
  }
}
