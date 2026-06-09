import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import LineOutput from '../../components/LineOutput'
import { decodeJWT } from '../../tools/security/jwtDecoder'

export default function JwtDecoder() {
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
    const res = decodeJWT(input.trim())
    if (res.success) {
      setResult(res)
      setStatus('valid')
    } else {
      setResult({ error: res.error })
      setStatus('invalid')
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setResult(null)
    setStatus('idle')
  }

  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Ready'

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">JWT Decoder</span>
          <span className="workspace-desc">Decode and inspect JWT tokens</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={result?.success ? JSON.stringify(result.payload, null, 2) : ''}
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">JWT Token</span>
          </div>
          <div className="panel-body">
            <textarea
              className="editor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste JWT token here, e.g. eyJhbGciOiJIUzI1NiIs..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Decoded</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <LineOutput text="" />
            ) : result.success ? (
              <div className="jwt-output">
                <div className="jwt-section">
                  <div className="jwt-section-title">Header</div>
                  <LineOutput text={JSON.stringify(result.header, null, 2)} />
                </div>
                <div className="jwt-section">
                  <div className="jwt-section-title">Payload</div>
                  <LineOutput text={JSON.stringify(result.payload, null, 2)} />
                </div>
                <div className="jwt-section">
                  <div className="jwt-section-title">Signature</div>
                  <div className="jwt-signature">{result.signature}</div>
                </div>
              </div>
            ) : (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid JWT</span>
                </div>
                <div className="error-detail-section">
                  <div className="error-detail-section-title">Error</div>
                  <div className="error-detail-text">{result.error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
