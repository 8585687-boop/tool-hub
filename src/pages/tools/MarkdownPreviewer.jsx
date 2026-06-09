import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import { tools } from '../../data/tools'
import { renderMarkdown, extractHeadings } from '../../tools/markdown/markdownPreviewer'
import { copyText } from '../../tools/utils/copyText'

const DEFAULT_MD = `# Markdown Previewer

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~
- [Links](https://example.com)

### Code

\`\`\`js
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

Inline \`code\` works too.

### Table

| Tool | Category |
|------|----------|
| JSON Formatter | Developer |
| Base64 Encoder | Encoding |

### Task List

- [x] Create Markdown Previewer
- [ ] Add more tools

> Blockquote example

---

1. First item
2. Second item
3. Third item
`

const tool = tools.find(t => t.id === 'markdown-previewer')

export default function MarkdownPreviewer() {
  const [input, setInput] = useState(DEFAULT_MD)
  const [fullscreen, setFullscreen] = useState(false)

  const result = useMemo(() => renderMarkdown(input), [input])
  const headings = useMemo(() => extractHeadings(input), [input])

  const handleClear = () => setInput('')

  const handleCopyHtml = () => {
    if (result.html) {
      copyText(result.html)
    }
  }

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Markdown Previewer</span>
          <span className="workspace-desc">GFM live rendering with tables, code blocks & TOC</span>
          <span className={`workspace-status ${result.success ? (input ? 'valid' : 'idle') : 'invalid'}`}>
            {result.success ? (input ? 'Rendered' : 'Ready') : 'Error'}
          </span>
        </div>
        <div className="toolbar">
          <button className="toolbar-btn toolbar-btn-text" onClick={handleCopyHtml} title="Copy HTML">Copy HTML</button>
          <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Markdown</span>
          </div>
          <div className="panel-body">
            <textarea
              className="editor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type Markdown here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Preview</span>
            {headings.length > 1 && (
              <details className="md-toc">
                <summary className="md-toc-toggle">TOC</summary>
                <div className="md-toc-list">
                  {headings.map((h, i) => (
                    <a
                      key={i}
                      className={`md-toc-item md-toc-h${h.level}`}
                      href={`#${h.id}`}
                    >{h.text}</a>
                  ))}
                </div>
              </details>
            )}
          </div>
          <div className="panel-body md-preview-body">
            {result.error ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Render Error</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div
                className="md-preview"
                dangerouslySetInnerHTML={{ __html: result.html }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
