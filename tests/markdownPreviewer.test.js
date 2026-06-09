/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { renderMarkdown, extractHeadings } from '../src/tools/markdown/markdownPreviewer'

describe('renderMarkdown', () => {
  it('renders headings', () => {
    const res = renderMarkdown('# Title')
    expect(res.success).toBe(true)
    expect(res.html).toContain('<h1')
    expect(res.html).toContain('Title')
  })

  it('renders bold and italic', () => {
    const res = renderMarkdown('**bold** *italic*')
    expect(res.success).toBe(true)
    expect(res.html).toContain('<strong>bold</strong>')
    expect(res.html).toContain('<em>italic</em>')
  })

  it('renders tables', () => {
    const res = renderMarkdown('| A | B |\n|---|---|\n| x | y |')
    expect(res.success).toBe(true)
    expect(res.html).toContain('<table>')
    expect(res.html).toContain('<th>')
  })

  it('renders code blocks', () => {
    const res = renderMarkdown('```js\nconsole.log("hi")\n```')
    expect(res.success).toBe(true)
    expect(res.html).toContain('<code')
    expect(res.html).toContain('console.log')
  })

  it('sanitizes script tags', () => {
    const res = renderMarkdown('<script>alert(1)</script>')
    expect(res.success).toBe(true)
    expect(res.html).not.toContain('<script>')
  })

  it('returns empty html for empty input', () => {
    const res = renderMarkdown('')
    expect(res.success).toBe(true)
    expect(res.html).toBe('')
  })
})

describe('extractHeadings', () => {
  it('extracts headings from markdown', () => {
    const headings = extractHeadings('# Title\n## Sub\n### Deep')
    expect(headings).toHaveLength(3)
    expect(headings[0].level).toBe(1)
    expect(headings[0].text).toBe('Title')
    expect(headings[1].level).toBe(2)
    expect(headings[2].level).toBe(3)
  })

  it('returns empty array for no headings', () => {
    expect(extractHeadings('just text')).toEqual([])
  })
})
