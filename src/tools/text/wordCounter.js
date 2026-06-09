export function countWords(text) {
  if (!text) return { words: 0, characters: 0, charactersWithoutSpaces: 0, lines: 0, readingTime: 0 }

  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const characters = text.length
  const charactersWithoutSpaces = text.replace(/\s/g, '').length
  const lines = text.split('\n').length
  const readingTime = Math.max(1, Math.ceil(words / 200))

  return { words, characters, charactersWithoutSpaces, lines, readingTime }
}
