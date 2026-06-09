export function countCharacters(text) {
  if (!text) return { total: 0, withoutSpaces: 0, withSpaces: 0 }

  const total = text.length
  const withoutSpaces = text.replace(/\s/g, '').length
  const withSpaces = total - withoutSpaces

  return { total, withoutSpaces, withSpaces }
}
