import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { validateJsonSchema, SCHEMA_TEMPLATES } from '../../tools/json/schemaValidator'
import { copyText } from '../../tools/utils/copyText'
import { downloadFile } from '../../tools/utils/downloadFile'

const tool = tools.find(t => t.id === 'json-schema-validator')

const HISTORY_KEY = 'devforgekit-schema-history'
const MAX_HISTORY = 10

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
}

function saveHistory(entry) {
  const h = loadHistory()
  h.unshift({ ...entry, time: Date.now() })
  if (h.length > MAX_HISTORY) h.length = MAX_HISTORY
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

function timeAgo(ts) {
  const d = Date.now() - ts
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`
  return `${Math.floor(d / 86400000)}d ago`
}

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState('')
  const [data, setData] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [fullscreen, setFullscreen] = useState(false)
  const [history, setHistory] = useState(loadHistory)
  const fileRef = useRef(null)

  const handleValidate = () => {
    if (!schema.trim() || !data.trim()) {
      setResult({ success: false, errors: [{ path: '$', message: 'Both Schema and Data are required', received: '', value: '' }] })
      setStatus('invalid')
      return
    }
    const r = validateJsonSchema(schema, data)
    setResult(r)
    setStatus(r.success ? 'valid' : 'invalid')
    if (r.success) {
      saveHistory({ type: 'valid', summary: 'Valid' })
    } else {
      saveHistory({ type: 'invalid', summary: `${r.errors.length} error(s)` })
    }
    setHistory(loadHistory())
  }

  const handleClear = () => {
    setSchema('')
    setData('')
    setResult(null)
    setStatus('idle')
  }

  const handleLoadTemplate = (key) => {
    const t = SCHEMA_TEMPLATES[key]
    if (t) {
      setSchema(t.schema)
      setData(t.data)
      setResult(null)
      setStatus('idle')
    }
  }

  const handleFormat = (text, setter) => {
    try {
      const obj = JSON.parse(text)
      setter(JSON.stringify(obj, null, 2))
    } catch { /* ignore */ }
  }

  const handleUpload = (e, setter) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const obj = JSON.parse(ev.target.result)
        setter(JSON.stringify(obj, null, 2))
      } catch {
        setter(ev.target.result)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
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
          <span className="workspace-title">JSON Schema Validator</span>
          <span className="workspace-desc">Validate JSON data against JSON Schema</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      <div className="workspace-body jsv-body">
        {/* Schema Panel */}
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">JSON Schema</span>
            <div className="jsv-panel-actions">
              <button className="sql-action-btn" onClick={() => handleFormat(schema, setSchema)} disabled={!schema.trim()}>Format</button>
              <button className="sql-action-btn" onClick={() => copyText(schema)} disabled={!schema.trim()}>Copy</button>
              <button className="sql-action-btn" onClick={() => fileRef.current?.click()}>Upload</button>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => handleUpload(e, setSchema)} />
            </div>
          </div>
          <div className="panel-body">
            <CodeEditor value={schema} language="json" onChange={setSchema} placeholder='Paste your JSON Schema here...' />
          </div>
        </div>

        {/* Data Panel */}
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">JSON Data</span>
            <div className="jsv-panel-actions">
              <button className="sql-action-btn" onClick={() => handleFormat(data, setData)} disabled={!data.trim()}>Format</button>
              <button className="sql-action-btn" onClick={() => copyText(data)} disabled={!data.trim()}>Copy</button>
            </div>
          </div>
          <div className="panel-body">
            <CodeEditor value={data} language="json" onChange={setData} placeholder='Paste your JSON data here...' />
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="jsv-actions-bar">
        <div className="jsv-templates">
          <span className="jsv-templates-label">Templates:</span>
          {Object.entries(SCHEMA_TEMPLATES).map(([key, t]) => (
            <button key={key} className="sql-example-btn" onClick={() => handleLoadTemplate(key)}>{t.label}</button>
          ))}
        </div>
        <button className="sql-gen-generate-btn" onClick={handleValidate}>Validate</button>
      </div>

      {/* Results */}
      {result && (
        <div className="jsv-results">
          {result.success ? (
            <div className="validator-result valid">
              <div className="validator-icon">✓</div>
              <div className="validator-message">Valid — JSON data matches the schema</div>
            </div>
          ) : (
            <div className="jsv-errors">
              <div className="jsv-errors-header">
                <span className="error-detail-icon">✕</span>
                <span>{result.errors.length} validation error(s)</span>
              </div>
              <div className="jsv-errors-list">
                {result.errors.map((err, i) => (
                  <div key={i} className="jsv-error-row">
                    <div className="jsv-error-path">{err.path}</div>
                    <div className="jsv-error-message">{err.message}</div>
                    {err.received && <div className="jsv-error-received">Received: {err.received}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="sql-gen-history">
          <div className="sql-gen-history-header">
            <span className="sql-gen-history-title">Recent</span>
            <button className="sql-gen-history-clear" onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }}>Clear</button>
          </div>
          <div className="sql-gen-history-list">
            {history.map((h, i) => (
              <span key={i} className="sql-gen-history-item">
                <span className={`sql-gen-history-type ${h.type === 'valid' ? 'jsv-hist-valid' : 'jsv-hist-invalid'}`}>{h.type}</span>
                <span className="sql-gen-history-table">{h.summary}</span>
                <span className="sql-gen-history-time">{timeAgo(h.time)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

      {!fullscreen && (
        <>
          <Breadcrumb toolId="json-schema-validator" />
          <ToolGuide toolId="json-schema-validator" />
          <RelatedTools toolId="json-schema-validator" />
        </>
      )}
    </>
  )
}
