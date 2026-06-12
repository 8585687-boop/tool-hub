import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { compareJson, formatDiffText } from '../../tools/json/jsonDiffer'
import { computeDiff } from '../../tools/text/diffUtils'
import { copyText } from '../../tools/utils/copyText'
import Editor from '@monaco-editor/react'

const tool = tools.find(t => t.id === 'json-diff')

const HISTORY_KEY = 'devforgekit-jsondiff-history'
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

function JsonDiffEditor({ value, onChange, diffLines, hlType, placeholder, editorRef, peerEditorRef, syncScrollEnabled, onScrollSync }) {
  const monacoRef = useRef(null)
  const decorationsRef = useRef([])

  // Apply diff decorations
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    const className = hlType === 'removed' ? 'diff-hl-removed-bg' : 'diff-hl-added-bg'
    const newDecorations = []

    let lineIndex = 0
    for (const line of diffLines) {
      if (line.type === hlType) {
        newDecorations.push({
          range: new monaco.Range(lineIndex + 1, 1, lineIndex + 1, 1),
          options: {
            isWholeLine: true,
            className,
            glyphMarginClassName: hlType === 'removed' ? 'diff-glyph-removed' : 'diff-glyph-added',
            overviewRuler: {
              color: hlType === 'removed' ? '#ef444433' : '#10b98133',
              position: monaco.editor.OverviewRulerLane.Full,
            },
          },
        })
      }
      lineIndex++
    }

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations)
  }, [diffLines, hlType, editorRef])

  // Sync scroll
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const disposable = editor.onDidScrollChange((e) => {
      if (!syncScrollEnabled) return
      const peer = peerEditorRef?.current
      if (!peer) return
      peer.setScrollTop(e.scrollTop)
      peer.setScrollLeft(e.scrollLeft)
      if (onScrollSync) onScrollSync(e.scrollTop, e.scrollLeft)
    })

    return () => disposable.dispose()
  }, [syncScrollEnabled, editorRef, peerEditorRef, onScrollSync])

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    monaco.editor.defineTheme('toolhub-diff', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1e1e1e',
        'editor.lineHighlightBackground': '#f5f5f5',
        'editorLineNumber.foreground': '#b0b0b0',
        'editorLineNumber.activeForeground': '#6366f1',
        'editor.selectionBackground': '#d4d4ff',
        'editorCursor.foreground': '#6366f1',
        'editorIndentGuide.background': '#e8e8e8',
        'editorIndentGuide.activeBackground': '#d0d0d0',
      },
    })
    monaco.editor.setTheme('toolhub-diff')
  }

  return (
    <div translate="no" style={{ height: '100%' }}>
    <Editor
      height="100%"
      language="json"
      value={value}
      onChange={onChange}
      onMount={handleMount}
      theme="toolhub-diff"
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        lineNumbers: 'on',
        fontSize: 13,
        fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        padding: { top: 8, bottom: 8 },
        overviewRulerBorder: false,
        scrollbar: {
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        contextmenu: true,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        parameterHints: { enabled: false },
        wordBasedSuggestions: 'off',
        glyphMargin: true,
      }}
      loading={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: 13 }}>Loading editor...</div>}
    />
    </div>
  )
}

export default function JsonDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [syncScrollEnabled, setSyncScrollEnabled] = useState(true)
  const [history, setHistory] = useState(loadHistory)

  const [ignoreKeyOrder, setIgnoreKeyOrder] = useState(false)
  const [ignoreArrayOrder, setIgnoreArrayOrder] = useState(false)

  const leftEditorRef = useRef(null)
  const rightEditorRef = useRef(null)
  const leftFileRef = useRef(null)
  const rightFileRef = useRef(null)

  const lineDiff = useMemo(() => computeDiff(left, right), [left, right])

  const jsonResult = useMemo(() => {
    if (!left.trim() || !right.trim()) return null
    return compareJson(left, right, { ignoreKeyOrder, ignoreArrayOrder })
  }, [left, right, ignoreKeyOrder, ignoreArrayOrder])

  const prevDiffCountRef = useRef(null)
  useMemo(() => {
    if (jsonResult?.success && jsonResult.diffs.length > 0) {
      const count = jsonResult.diffs.length
      if (count !== prevDiffCountRef.current) {
        prevDiffCountRef.current = count
        saveHistory({
          added: jsonResult.stats.added,
          removed: jsonResult.stats.removed,
          changed: jsonResult.stats.changed,
          total: count,
        })
        setHistory(loadHistory())
      }
    }
  }, [jsonResult])

  const handleClear = () => {
    setLeft('')
    setRight('')
    prevDiffCountRef.current = null
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

  const handleCopyResult = () => {
    if (!jsonResult || !jsonResult.success) return
    copyText(formatDiffText(jsonResult.diffs))
  }

  const hasDiffs = jsonResult?.success && jsonResult.diffs.length > 0
  const isIdentical = jsonResult?.success && jsonResult.diffs.length === 0

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">JSON Diff</span>
          <span className="workspace-desc">Compare two JSON objects</span>
          {jsonResult?.success && (
            <span className={`workspace-status ${isIdentical ? 'valid' : 'invalid'}`}>
              {isIdentical ? 'Identical' : `${jsonResult.diffs.length} diff(s)`}
            </span>
          )}
          {jsonResult && !jsonResult.success && (
            <span className="workspace-status invalid">Error</span>
          )}
        </div>
        <div className="toolbar">
          {lineDiff.changed && (
            <span className="diff-stats">
              <span className="diff-stat-removed">-{lineDiff.removed}</span>
              <span className="diff-stat-added">+{lineDiff.added}</span>
            </span>
          )}
          <button
            className={`toolbar-btn toolbar-btn-sync ${syncScrollEnabled ? 'active' : ''}`}
            onClick={() => setSyncScrollEnabled(!syncScrollEnabled)}
            title={syncScrollEnabled ? 'Unlock sync scroll' : 'Lock sync scroll'}
          >
            {syncScrollEnabled ? '🔗 Sync ON' : '🔗 Sync OFF'}
          </button>
          <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
        </div>
      </div>

      {/* Two JSON editors side by side */}
      <div className="workspace-body jsv-body jdiff-editor-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Original JSON</span>
            <div className="jsv-panel-actions">
              <button className="sql-action-btn" onClick={() => handleFormat(left, setLeft)} disabled={!left.trim()}>Format</button>
              <button className="sql-action-btn" onClick={() => leftFileRef.current?.click()}>Upload</button>
              <input ref={leftFileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => handleUpload(e, setLeft)} />
            </div>
          </div>
          <div className="panel-body">
            <JsonDiffEditor
              value={left}
              onChange={setLeft}
              diffLines={lineDiff.leftDiff}
              hlType="removed"
              placeholder="Paste original JSON here..."
              editorRef={leftEditorRef}
              peerEditorRef={rightEditorRef}
              syncScrollEnabled={syncScrollEnabled}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">New JSON</span>
            <div className="jsv-panel-actions">
              <button className="sql-action-btn" onClick={() => handleFormat(right, setRight)} disabled={!right.trim()}>Format</button>
              <button className="sql-action-btn" onClick={() => rightFileRef.current?.click()}>Upload</button>
              <input ref={rightFileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={e => handleUpload(e, setRight)} />
            </div>
          </div>
          <div className="panel-body">
            <JsonDiffEditor
              value={right}
              onChange={setRight}
              diffLines={lineDiff.rightDiff}
              hlType="added"
              placeholder="Paste new JSON here..."
              editorRef={rightEditorRef}
              peerEditorRef={leftEditorRef}
              syncScrollEnabled={syncScrollEnabled}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="jsv-actions-bar">
        <div className="jdiff-options">
          <label className="jdiff-option">
            <input type="checkbox" checked={ignoreKeyOrder} onChange={e => setIgnoreKeyOrder(e.target.checked)} />
            <span>Ignore key order</span>
          </label>
          <label className="jdiff-option">
            <input type="checkbox" checked={ignoreArrayOrder} onChange={e => setIgnoreArrayOrder(e.target.checked)} />
            <span>Ignore array order</span>
          </label>
        </div>
        {hasDiffs && <button className="sql-action-btn" onClick={handleCopyResult}>Copy Result</button>}
      </div>

      {/* JSON structural diff results */}
      {jsonResult && (
        jsonResult.success ? (
          isIdentical ? (
            <div className="jdiff-result-area">
              <div className="validator-result valid">
                <div className="validator-icon">✓</div>
                <div className="validator-message">No difference found — JSON objects are identical</div>
              </div>
            </div>
          ) : (
            <div className="jdiff-result-area">
              <div className="jdiff-stats">
                <div className="jdiff-stat jdiff-stat-added">
                  <span className="jdiff-stat-num">{jsonResult.stats.added}</span>
                  <span className="jdiff-stat-label">Added</span>
                </div>
                <div className="jdiff-stat jdiff-stat-removed">
                  <span className="jdiff-stat-num">{jsonResult.stats.removed}</span>
                  <span className="jdiff-stat-label">Removed</span>
                </div>
                <div className="jdiff-stat jdiff-stat-changed">
                  <span className="jdiff-stat-num">{jsonResult.stats.changed}</span>
                  <span className="jdiff-stat-label">Changed</span>
                </div>
              </div>
              <div className="jdiff-list">
                {jsonResult.diffs.map((d, i) => (
                  <div key={i} className={`jdiff-item jdiff-item-${d.type}`}>
                    <div className="jdiff-item-header">
                      <span className={`jdiff-type-badge jdiff-type-${d.type}`}>
                        {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : '~'}
                      </span>
                      <span className="jdiff-item-type">{d.type === 'added' ? 'Added' : d.type === 'removed' ? 'Removed' : 'Changed'}</span>
                      <span className="jdiff-item-path">{d.path}</span>
                    </div>
                    <div className="jdiff-item-values">
                      {d.type === 'added' ? (
                        <div className="jdiff-value-row jdiff-value-after">
                          <span className="jdiff-value-label">Value:</span>
                          <span className="jdiff-value-data">{formatVal(d.after)}</span>
                        </div>
                      ) : d.type === 'removed' ? (
                        <div className="jdiff-value-row jdiff-value-before">
                          <span className="jdiff-value-label">Value:</span>
                          <span className="jdiff-value-data">{formatVal(d.before)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="jdiff-value-row jdiff-value-before">
                            <span className="jdiff-value-label">Before:</span>
                            <span className="jdiff-value-data">{formatVal(d.before)}</span>
                          </div>
                          <div className="jdiff-value-row jdiff-value-after">
                            <span className="jdiff-value-label">After:</span>
                            <span className="jdiff-value-data">{formatVal(d.after)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="jdiff-result-area">
            <div className="jsv-errors">
              <div className="jsv-errors-header">
                <span className="error-detail-icon">✕</span>
                <span>{jsonResult.error}</span>
              </div>
            </div>
          </div>
        )
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
                <span className="sql-gen-history-table">{h.total} diff(s)</span>
                <span className="sql-gen-history-time" style={{ display: 'flex', gap: 6 }}>
                  {h.added > 0 && <span className="jdiff-hist-added">+{h.added}</span>}
                  {h.removed > 0 && <span className="jdiff-hist-removed">-{h.removed}</span>}
                  {h.changed > 0 && <span className="jdiff-hist-changed">~{h.changed}</span>}
                </span>
                <span className="sql-gen-history-time">{timeAgo(h.time)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

      {!fullscreen && (
        <>
          <Breadcrumb toolId="json-diff" />
          <ToolGuide toolId="json-diff" />
          <RelatedTools toolId="json-diff" />
        </>
      )}
    </>
  )
}

function formatVal(v) {
  if (v === undefined) return 'undefined'
  if (v === null) return 'null'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
