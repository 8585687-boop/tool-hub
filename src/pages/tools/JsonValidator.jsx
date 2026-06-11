import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { validateJson } from '../../tools/json/validator'

const tool = tools.find(t => t.id === 'json-validator')

export default function JsonValidator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setResult(null)
      setStatus('idle')
      return
    }
    const res = validateJson(input)
    setResult(res)
    setStatus(res.success ? 'valid' : 'invalid')
  }, [input])

  const handleClear = () => {
    setInput('')
    setResult(null)
    setStatus('idle')
  }

  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Ready'

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">JSON Validator</span>
          <span className="workspace-desc">Validate JSON syntax</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
          </div>
          <div className="panel-body">
            <CodeEditor
              value={input}
              language="json"
              onChange={setInput}
              placeholder='Paste your JSON to validate, e.g. {"key": "value"}'
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Result</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <pre className="editor-output"><span className="editor-output-placeholder">Result will appear here...</span></pre>
            ) : result.success ? (
              <div className="validator-result valid">
                <div className="validator-icon">✓</div>
                <div className="validator-message">Valid JSON</div>
              </div>
            ) : (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid JSON</span>
                </div>

                <div className="error-detail-location">
                  <div className="error-detail-row">
                    <span className="error-detail-label">Line</span>
                    <span className="error-detail-value">{result.error.line || '?'}</span>
                  </div>
                  <div className="error-detail-row">
                    <span className="error-detail-label">Column</span>
                    <span className="error-detail-value">{result.error.column || '?'}</span>
                  </div>
                  {result.error.position > 0 && (
                    <div className="error-detail-row">
                      <span className="error-detail-label">Position</span>
                      <span className="error-detail-value">{result.error.position}</span>
                    </div>
                  )}
                </div>

                <div className="error-detail-section">
                  <div className="error-detail-section-title">Error</div>
                  <div className="error-detail-text">{result.error.message}</div>
                </div>

                {result.error.suggestions?.length > 0 && (
                  <div className="error-detail-section">
                    <div className="error-detail-section-title">Possible causes</div>
                    <ul className="error-detail-list">
                      {result.error.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.error.context && (
                  <div className="error-detail-section">
                    <div className="error-detail-section-title">Error context</div>
                    <div className="error-context">
                      {result.error.context.lines.map(l => (
                        <div key={l.line} className={`error-context-line ${l.isError ? 'error-context-highlight' : ''}`}>
                          <span className="error-context-num">{l.line}</span>
                          <span className="error-context-content">{l.content || ' '}</span>
                        </div>
                      ))}
                      {result.error.context.errorColumn > 0 && (
                        <div className="error-context-pointer">
                          <span className="error-context-num"> </span>
                          <span className="error-context-content">{' '.repeat(result.error.context.errorColumn - 1)}↑</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="json-validator" />
          <ToolGuide toolId="json-validator" />
          <RelatedTools toolId="json-validator" />
        </>
      )}
    </>
  )
}
