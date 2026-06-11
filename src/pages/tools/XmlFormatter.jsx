import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { formatXML, xmlToJson } from '../../tools/format/xmlFormatter'

const tool = tools.find(t => t.id === 'xml-formatter')

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')
  const [viewMode, setViewMode] = useState('xml')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      setStatus('idle')
      return
    }

    const fn = viewMode === 'json' ? xmlToJson : formatXML
    const res = fn(input)

    if (res.success) {
      setOutput(res.result)
      setError(null)
      setStatus('valid')
    } else {
      setOutput('')
      setError(res.error)
      setStatus('invalid')
    }
  }, [input, viewMode])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
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
          <span className="workspace-title">XML Formatter</span>
          <span className="workspace-desc">Format/validate XML, convert to JSON</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <div className="toolbar">
          <div className="hash-algo-tabs">
            <button
              className={`hash-algo-tab ${viewMode === 'xml' ? 'active' : ''}`}
              onClick={() => setViewMode('xml')}
            >XML</button>
            <button
              className={`hash-algo-tab ${viewMode === 'json' ? 'active' : ''}`}
              onClick={() => setViewMode('json')}
            >JSON</button>
          </div>
          <Toolbar
            copyText={output}
            onClear={handleClear}
            onFullscreen={() => setFullscreen(!fullscreen)}
            isFullscreen={fullscreen}
          />
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
          </div>
          <div className="panel-body">
            <CodeEditor
              value={input}
              language="xml"
              onChange={setInput}
              placeholder={'Paste your XML here, e.g.\n<root>\n  <item>Hello</item>\n  <item>World</item>\n</root>'}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Output ({viewMode.toUpperCase()})</span>
          </div>
          <div className="panel-body">
            {error ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid XML</span>
                </div>
                <div className="error-detail-section">
                  <div className="error-detail-section-title">Error</div>
                  <div className="error-detail-text">{error}</div>
                </div>
              </div>
            ) : (
              <CodeEditor
                value={output}
                language={viewMode === 'json' ? 'json' : 'xml'}
                readOnly
                placeholder="Formatted result will appear here..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="xml-formatter" />
          <ToolGuide toolId="xml-formatter" />
          <RelatedTools toolId="xml-formatter" />
        </>
      )}
    </>
  )
}
