import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import {
  METHODS, METHOD_COLORS, buildUrl, buildHeaders,
  sendRequest, loadHistory, saveHistory, clearHistory,
} from '../../tools/network/apiTester'
import { copyText } from '../../tools/utils/copyText'
import { downloadFile } from '../../tools/utils/downloadFile'

const tool = tools.find(t => t.id === 'api-tester')

const DEFAULT_URL = 'https://jsonplaceholder.typicode.com/posts/1'

const EXAMPLES = [
  {
    label: 'GET JSON API',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    body: '',
  },
  {
    label: 'POST JSON Data',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: JSON.stringify({ title: 'DevForgeKit', body: 'API Test', userId: 1 }, null, 2),
  },
  {
    label: 'Error Testing',
    method: 'GET',
    url: 'https://httpbin.org/status/404',
    body: '',
  },
]

function KvRow({ row, onChange, onRemove }) {
  return (
    <div className="api-kv-row">
      <input
        className="api-kv-input"
        value={row.key}
        onChange={e => onChange({ ...row, key: e.target.value })}
        placeholder="Key"
        spellCheck={false}
      />
      <input
        className="api-kv-input"
        value={row.value}
        onChange={e => onChange({ ...row, value: e.target.value })}
        placeholder="Value"
        spellCheck={false}
      />
      <button className="api-kv-remove" onClick={onRemove} title="Remove">✕</button>
    </div>
  )
}

export default function ApiTester() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState(DEFAULT_URL)
  const [headers, setHeaders] = useState([{ key: '', value: '' }])
  const [params, setParams] = useState([{ key: '', value: '' }])
  const [body, setBody] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(loadHistory)
  const [activeTab, setActiveTab] = useState('headers')
  const [fullscreen, setFullscreen] = useState(false)

  const addRow = (setter) => setter(prev => [...prev, { key: '', value: '' }])
  const updateRow = (setter, idx, row) => setter(prev => prev.map((r, i) => i === idx ? row : r))
  const removeRow = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx))

  const handleSend = useCallback(async () => {
    if (!url.trim()) return
    const fullUrl = buildUrl(url.trim(), params)
    const reqHeaders = buildHeaders(headers)

    if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
      try {
        JSON.parse(body)
      } catch {
        setResponse({ success: false, error: 'Invalid JSON Body' })
        return
      }
    }

    setLoading(true)
    setResponse(null)
    const result = await sendRequest({
      method,
      url: fullUrl,
      headers: reqHeaders,
      body: method !== 'GET' && method !== 'HEAD' ? body.trim() : undefined,
    })
    setLoading(false)
    setResponse(result)

    if (result.success) {
      setHistory(saveHistory({ method, url: fullUrl, status: result.status }))
    }
  }, [method, url, params, headers, body])

  const handleRestore = (entry) => {
    setMethod(entry.method)
    setUrl(entry.url)
    setBody('')
    setResponse(null)
  }

  const handleClear = () => {
    setMethod('GET')
    setUrl(DEFAULT_URL)
    setHeaders([{ key: '', value: '' }])
    setParams([{ key: '', value: '' }])
    setBody('')
    setResponse(null)
  }

  const handleLoadExample = (ex) => {
    setMethod(ex.method)
    setUrl(ex.url)
    setBody(ex.body)
    setResponse(null)
    if (ex.body) setActiveTab('body')
  }

  const handleCopyResponse = () => {
    if (!response?.success) return
    const text = response.isJson ? JSON.stringify(response.body, null, 2) : String(response.body)
    copyText(text)
  }

  const handleDownload = () => {
    if (!response?.success) return
    const text = response.isJson ? JSON.stringify(response.body, null, 2) : String(response.body)
    downloadFile('response.json', text)
  }

  const statusClass = !response ? 'idle' : response.success ? (response.status < 400 ? 'valid' : 'invalid') : 'invalid'
  const statusText = !response ? 'Ready' : loading ? 'Sending...' : response.success ? `${response.status} ${response.statusText}` : 'Error'

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">API Tester</span>
          <span className="workspace-desc">Lightweight REST API client</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      <div className="workspace-body api-workspace-body">
        {/* Request Panel */}
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Request</span>
          </div>
          <div className="panel-body">
            {/* URL Bar */}
            <div className="api-url-bar">
              <select
                className="api-method-select"
                value={method}
                onChange={e => setMethod(e.target.value)}
                style={{ color: METHOD_COLORS[method] }}
              >
                {METHODS.map(m => (
                  <option key={m} value={m} style={{ color: METHOD_COLORS[m] }}>{m}</option>
                ))}
              </select>
              <input
                className="api-url-input"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Enter request URL..."
                spellCheck={false}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button className="api-send-btn" onClick={handleSend} disabled={loading}>
                {loading ? '...' : 'Send'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="api-quick-actions">
              {EXAMPLES.map((ex, i) => (
                <button key={i} className="api-quick-btn" onClick={() => handleLoadExample(ex)}>
                  <span className="api-quick-method" style={{ color: METHOD_COLORS[ex.method] }}>{ex.method}</span>
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="api-tabs">
              {['headers', 'params', 'body'].map(tab => (
                <button
                  key={tab}
                  className={`api-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="api-tab-content">
              {activeTab === 'headers' && (
                <div className="api-kv-section">
                  {headers.map((row, i) => (
                    <KvRow
                      key={i}
                      row={row}
                      onChange={r => updateRow(setHeaders, i, r)}
                      onRemove={() => removeRow(setHeaders, i)}
                    />
                  ))}
                  <button className="api-kv-add" onClick={() => addRow(setHeaders)}>+ Add Header</button>
                </div>
              )}
              {activeTab === 'params' && (
                <div className="api-kv-section">
                  {params.map((row, i) => (
                    <KvRow
                      key={i}
                      row={row}
                      onChange={r => updateRow(setParams, i, r)}
                      onRemove={() => removeRow(setParams, i)}
                    />
                  ))}
                  <button className="api-kv-add" onClick={() => addRow(setParams)}>+ Add Parameter</button>
                </div>
              )}
              {activeTab === 'body' && (
                <div className="api-body-section">
                  {method === 'GET' || method === 'HEAD' ? (
                    <div className="api-body-disabled">Body is not available for {method} requests</div>
                  ) : (
                    <CodeEditor
                      value={body}
                      language="json"
                      onChange={setBody}
                      placeholder='Enter JSON body, e.g. {"key": "value"}'
                      height="160px"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Response</span>
            {response?.success && (
              <div className="api-response-meta">
                <span className={`api-status-badge ${response.status < 400 ? 'success' : 'error'}`}>
                  {response.status} {response.statusText}
                </span>
                <span className="api-meta-item">{response.time}ms</span>
                <span className="api-meta-item">{response.size} B</span>
              </div>
            )}
          </div>
          <div className="panel-body">
            {!response && !loading && (
              <div className="ts-empty">Send a request to see the response</div>
            )}
            {loading && (
              <div className="ts-empty">Sending request...</div>
            )}
            {response && !response.success && (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Request Failed</span>
                </div>
                <div className="error-detail-text">{response.error}</div>
                {response.time > 0 && <div className="error-detail-text">Time: {response.time}ms</div>}
              </div>
            )}
            {response?.success && (
              <div className="api-response-content">
                {/* Response Headers */}
                <details className="api-response-headers">
                  <summary>Response Headers ({Object.keys(response.headers).length})</summary>
                  <div className="api-headers-list">
                    {Object.entries(response.headers).map(([k, v]) => (
                      <div key={k} className="api-header-item">
                        <span className="api-header-key">{k}:</span>
                        <span className="api-header-value">{v}</span>
                      </div>
                    ))}
                  </div>
                </details>

                {/* Response Body */}
                <div className="api-response-body">
                  <div className="api-response-actions">
                    <button className="api-action-btn" onClick={handleCopyResponse}>Copy</button>
                    <button className="api-action-btn" onClick={handleDownload}>Download</button>
                  </div>
                  <CodeEditor
                    value={response.isJson ? JSON.stringify(response.body, null, 2) : String(response.body)}
                    language={response.isJson ? 'json' : 'plaintext'}
                    readOnly
                    placeholder="No response body"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Panel */}
      {history.length > 0 && (
        <div className="api-history-bar">
          <div className="api-history-header">
            <span className="api-history-title">History</span>
            <button className="api-history-clear" onClick={() => setHistory(clearHistory())}>Clear</button>
          </div>
          <div className="api-history-list">
            {history.map((entry, i) => (
              <button key={i} className="api-history-item" onClick={() => handleRestore(entry)}>
                <span className="api-history-method" style={{ color: METHOD_COLORS[entry.method] }}>{entry.method}</span>
                <span className="api-history-url">{entry.url}</span>
                {entry.status && (
                  <span className={`api-history-status ${entry.status < 400 ? 'ok' : 'err'}`}>{entry.status}</span>
                )}
                <span className="api-history-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="api-tester" />
          <ToolGuide toolId="api-tester" />
          <RelatedTools toolId="api-tester" />
        </>
      )}
    </>
  )
}
