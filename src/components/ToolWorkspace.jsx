import { useState } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from './Toolbar'
import LineOutput from './LineOutput'
import SEO from './SEO'

export default function ToolWorkspace({ title, description, status, input, output, onInputChange, onClear, outputError, errorDetail, errorTitle, placeholder, seoTitle, seoDescription }) {
  const [fullscreen, setFullscreen] = useState(false)

  const handleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Ready'

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        {seoTitle && <SEO title={seoTitle} description={seoDescription} />}
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">{title}</span>
          {description && <span className="workspace-desc">{description}</span>}
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={output}
          onClear={onClear}
          onFullscreen={handleFullscreen}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
          </div>
          <div className="panel-body">
            <textarea
              className="editor-input"
              value={input}
              onChange={e => onInputChange(e.target.value)}
              placeholder={placeholder || 'Paste your JSON here...'}
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Output</span>
          </div>
          <div className="panel-body">
            {errorDetail ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>{errorTitle || 'Invalid JSON'}</span>
                </div>

                {(errorDetail.line > 0 || errorDetail.column > 0 || errorDetail.position > 0) && (
                  <div className="error-detail-location">
                    {errorDetail.line > 0 && (
                      <div className="error-detail-row">
                        <span className="error-detail-label">Line</span>
                        <span className="error-detail-value">{errorDetail.line}</span>
                      </div>
                    )}
                    {errorDetail.column > 0 && (
                      <div className="error-detail-row">
                        <span className="error-detail-label">Column</span>
                        <span className="error-detail-value">{errorDetail.column}</span>
                      </div>
                    )}
                    {errorDetail.position > 0 && (
                      <div className="error-detail-row">
                        <span className="error-detail-label">Position</span>
                        <span className="error-detail-value">{errorDetail.position}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="error-detail-section">
                  <div className="error-detail-section-title">Error</div>
                  <div className="error-detail-text">{errorDetail.message}</div>
                </div>

                {errorDetail.suggestions?.length > 0 && (
                  <div className="error-detail-section">
                    <div className="error-detail-section-title">Possible causes</div>
                    <ul className="error-detail-list">
                      {errorDetail.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {errorDetail.context && (
                  <div className="error-detail-section">
                    <div className="error-detail-section-title">Error context</div>
                    <div className="error-context">
                      {errorDetail.context.lines.map(l => (
                        <div key={l.line} className={`error-context-line ${l.isError ? 'error-context-highlight' : ''}`}>
                          <span className="error-context-num">{l.line}</span>
                          <span className="error-context-content">{l.content || ' '}</span>
                        </div>
                      ))}
                      {errorDetail.context.errorColumn > 0 && (
                        <div className="error-context-pointer">
                          <span className="error-context-num"> </span>
                          <span className="error-context-content">{' '.repeat(errorDetail.context.errorColumn - 1)}↑</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : output ? (
              <LineOutput text={output} />
            ) : (
              <LineOutput text="" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
