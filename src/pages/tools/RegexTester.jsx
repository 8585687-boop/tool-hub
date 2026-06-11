import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { testRegex } from '../../tools/utils/regexTester'

const FLAGS = [
  { key: 'g', label: 'Global' },
  { key: 'i', label: 'Ignore Case' },
  { key: 'm', label: 'Multiline' },
  { key: 's', label: 'DotAll' },
  { key: 'u', label: 'Unicode' },
]

const tool = tools.find(t => t.id === 'regex-tester')

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [text, setText] = useState('')
  const [replaceWith, setReplaceWith] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  const result = useMemo(() => {
    if (!pattern) return { success: true, result: { matches: [], replacedText: null } }
    return testRegex(pattern, flags, text, replaceWith || undefined)
  }, [pattern, flags, text, replaceWith])

  const matches = result.success ? result.result.matches : []
  const replacedText = result.success ? result.result.replacedText : null

  const toggleFlag = (key) => {
    setFlags(prev => prev.includes(key) ? prev.replace(key, '') : prev + key)
  }

  const handleClear = () => {
    setPattern('')
    setFlags('g')
    setText('')
    setReplaceWith('')
  }

  const statusClass = !pattern ? 'idle' : result.success ? (matches.length > 0 ? 'valid' : 'idle') : 'invalid'
  const statusText = !pattern ? 'Ready' : result.success ? `${matches.length} match${matches.length !== 1 ? 'es' : ''}` : 'Error'

  // Build highlighted text
  const highlighted = useMemo(() => {
    if (!result.success || !matches.length || !text) return null
    const parts = []
    let lastIdx = 0
    for (const m of matches) {
      if (m.index > lastIdx) {
        parts.push({ type: 'text', content: text.slice(lastIdx, m.index) })
      }
      parts.push({ type: 'match', content: m.match, index: m.index })
      lastIdx = m.index + m.match.length
    }
    if (lastIdx < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIdx) })
    }
    return parts
  }, [result, text])

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Regex Tester</span>
          <span className="workspace-desc">Test regex patterns with match highlighting</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={replacedText || (matches.length ? matches.map(m => m.match).join('\n') : '')}
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Pattern & Input</span>
          </div>
          <div className="panel-body regex-input-area">
            <div className="regex-pattern-row">
              <span className="regex-delimiter">/</span>
              <input
                className="regex-pattern-input"
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                spellCheck={false}
              />
              <span className="regex-delimiter">/</span>
              <span className="regex-flags-display">{flags}</span>
            </div>
            <div className="regex-flags-row">
              {FLAGS.map(f => (
                <button
                  key={f.key}
                  className={`regex-flag-btn ${flags.includes(f.key) ? 'active' : ''}`}
                  onClick={() => toggleFlag(f.key)}
                >
                  {f.key} <span className="regex-flag-label">{f.label}</span>
                </button>
              ))}
            </div>
            <CodeEditor
              value={text}
              language="plaintext"
              onChange={setText}
              placeholder="Enter test string here..."
              height="120px"
            />
            <div className="regex-replace-row">
              <span className="regex-replace-label">Replace</span>
              <input
                className="regex-replace-input"
                value={replaceWith}
                onChange={e => setReplaceWith(e.target.value)}
                placeholder="Replacement string (optional)..."
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Results</span>
          </div>
          <div className="panel-body">
            {!pattern ? (
              <div className="ts-empty">Enter a regex pattern to test</div>
            ) : !result.success ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid Regex</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div className="regex-results">
                {highlighted && (
                  <div className="regex-highlight-box">
                    <div className="regex-highlight-label">Highlighted Matches</div>
                    <div className="regex-highlight-text">
                      {highlighted.map((part, i) =>
                        part.type === 'match'
                          ? <mark key={i} className="regex-match-mark">{part.content}</mark>
                          : <span key={i}>{part.content}</span>
                      )}
                    </div>
                  </div>
                )}
                {matches.length > 0 && (
                  <div className="regex-match-list">
                    <div className="regex-highlight-label">Match Details</div>
                    {matches.map((m, i) => (
                      <div key={i} className="regex-match-item">
                        <span className="regex-match-num">#{i + 1}</span>
                        <span className="regex-match-value">{m.match}</span>
                        <span className="regex-match-pos">pos {m.index}</span>
                        {m.groups && (
                          <span className="regex-match-groups">
                            {m.groups.map((g, j) => (
                              <span key={j} className="regex-group-tag">${j + 1}: {g}</span>
                            ))}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {replacedText !== null && (
                  <div className="regex-replace-preview">
                    <div className="regex-highlight-label">Replace Preview</div>
                    <div className="regex-replace-text">{replacedText}</div>
                  </div>
                )}
                {matches.length === 0 && result.success && (
                  <div className="regex-no-match">No matches found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="regex-tester" />
          <ToolGuide toolId="regex-tester" />
          <RelatedTools toolId="regex-tester" />
        </>
      )}
    </>
  )
}
