import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import LineOutput from '../../components/LineOutput'
import { generateHash } from '../../tools/security/hashGenerator'

const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512']

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [algorithm, setAlgorithm] = useState('SHA-256')
  const [output, setOutput] = useState('')
  const [errorDetail, setErrorDetail] = useState(null)
  const [status, setStatus] = useState('idle')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input) {
      setOutput('')
      setErrorDetail(null)
      setStatus('idle')
      return
    }
    generateHash(input, algorithm).then(result => {
      if (result.success) {
        setOutput(result.result)
        setErrorDetail(null)
        setStatus('valid')
      } else {
        setErrorDetail({ message: result.error, line: 0, column: 0, position: 0, suggestions: ['Try a different algorithm'] })
        setOutput('')
        setStatus('invalid')
      }
    })
  }, [input, algorithm])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setErrorDetail(null)
    setStatus('idle')
  }

  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? algorithm : status === 'invalid' ? 'Error' : 'Ready'

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Hash Generator</span>
          <span className="workspace-desc">Generate SHA-256, SHA-384, SHA-512 hashes</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={output}
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
            <textarea
              className="editor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text to hash, e.g. hello world"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Hash</span>
            <div className="hash-algo-tabs">
              {ALGORITHMS.map(algo => (
                <button
                  key={algo}
                  className={`hash-algo-tab ${algorithm === algo ? 'active' : ''}`}
                  onClick={() => setAlgorithm(algo)}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
          <div className="panel-body">
            {errorDetail ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Hash Error</span>
                </div>
                <div className="error-detail-section">
                  <div className="error-detail-text">{errorDetail.message}</div>
                </div>
              </div>
            ) : (
              <LineOutput text={output} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
