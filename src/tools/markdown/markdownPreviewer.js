import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({
  gfm: true,
  breaks: true,
})

export function renderMarkdown(mdText) {
  if (!mdText || !mdText.trim()) {
    return { success: true, html: '' }
  }

  try {
    const rawHtml = marked.parse(mdText)
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['input'],
      ADD_ATTR: ['type', 'checked', 'disabled'],
    })
    return { success: true, html: safeHtml }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export function extractHeadings(mdText) {
  if (!mdText) return []
  const headings = []
  const lines = mdText.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/[*_`~]/g, '')
      const id = text.toLowerCase().replace(/[^\w]+/g, '-')
      headings.push({ level, text, id })
    }
  }
  return headings
}
