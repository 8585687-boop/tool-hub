import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { generateHash } from '../../tools/security/hashGenerator'

const ALGORITHMS = ['SHA-256', 'SHA-384', 'SHA-512']
const tool = tools.find(t => t.id === 'hash-generator')

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
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
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
            <CodeEditor
              value={input}
              language="plaintext"
              onChange={setInput}
              placeholder="Enter text to hash, e.g. hello world"
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
              <CodeEditor value={output} language="plaintext" readOnly placeholder="Hash result will appear here..." />
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="hash-generator" />
          <ToolGuide toolId="hash-generator" />
          <RelatedTools toolId="hash-generator" />
        </>
      )}
    </>
  )
}
