export function testRegex(pattern, flags, text, replaceWith) {
  if (!pattern) {
    return { success: true, result: { matches: [], replacedText: null } }
  }

  try {
    const re = new RegExp(pattern, flags)
    const matches = []

    if (flags.includes('g')) {
      let m
      const reCopy = new RegExp(pattern, flags)
      while ((m = reCopy.exec(text)) !== null) {
        matches.push({
          index: m.index,
          match: m[0],
          groups: m.slice(1).length > 0 ? m.slice(1) : undefined,
        })
        if (!m[0]) reCopy.lastIndex++
      }
    } else {
      const m = re.exec(text)
      if (m) {
        matches.push({
          index: m.index,
          match: m[0],
          groups: m.slice(1).length > 0 ? m.slice(1) : undefined,
        })
      }
    }

    let replacedText = null
    if (replaceWith !== undefined && replaceWith !== '') {
      try {
        replacedText = text.replace(re, replaceWith)
      } catch {
        replacedText = 'Invalid replacement pattern'
      }
    }

    return { success: true, result: { matches, replacedText } }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
