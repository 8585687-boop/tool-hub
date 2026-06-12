import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import {
  buildCronPart,
  buildCronExpression,
  validateCron,
  describeCron,
  CRON_TEMPLATES,
} from '../../tools/utils/cronGenerator'
import { copyText } from '../../tools/utils/copyText'
import { downloadFile } from '../../tools/utils/downloadFile'

const tool = tools.find(t => t.id === 'cron-generator')

const HISTORY_KEY = 'devforgekit-cron-history'
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

const FIELD_CONFIG = [
  { name: 'minute', label: 'Minute', min: 0, max: 59 },
  { name: 'hour', label: 'Hour', min: 0, max: 23 },
  { name: 'day', label: 'Day of Month', min: 1, max: 31 },
  { name: 'month', label: 'Month', min: 1, max: 12 },
  { name: 'weekday', label: 'Weekday', min: 0, max: 6, names: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
]

const MODES = ['every', 'specific', 'range', 'step']

function CronFieldEditor({ field, value, onChange }) {
  const { name, label, min, max, names } = field
  const mode = value.mode
  const options = []
  for (let i = min; i <= max; i++) {
    options.push({ value: i, label: names ? `${i} (${names[i - min]})` : String(i) })
  }

  return (
    <div className="cron-field">
      <label className="cron-field-label">{label}</label>
      <div className="cron-field-modes">
        {MODES.map(m => (
          <button
            key={m}
            className={`cron-mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => onChange({ ...value, mode: m })}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <div className="cron-field-input">
        {mode === 'every' && (
          <span className="cron-field-hint">Every {label.toLowerCase()}</span>
        )}
        {mode === 'specific' && (
          <div className="cron-specific-grid">
            {options.map(opt => (
              <button
                key={opt.value}
                className={`cron-specific-btn ${(value.specificValues || []).includes(opt.value) ? 'active' : ''}`}
                onClick={() => {
                  const vals = new Set(value.specificValues || [])
                  if (vals.has(opt.value)) vals.delete(opt.value)
                  else vals.add(opt.value)
                  onChange({ ...value, specificValues: [...vals] })
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
        {mode === 'range' && (
          <div className="cron-range-row">
            <span>From</span>
            <input
              type="number"
              min={min}
              max={max}
              value={value.rangeStart ?? ''}
              onChange={e => onChange({ ...value, rangeStart: Number(e.target.value) })}
              className="cron-input"
            />
            <span>to</span>
            <input
              type="number"
              min={min}
              max={max}
              value={value.rangeEnd ?? ''}
              onChange={e => onChange({ ...value, rangeEnd: Number(e.target.value) })}
              className="cron-input"
            />
          </div>
        )}
        {mode === 'step' && (
          <div className="cron-step-row">
            <span>Every</span>
            <input
              type="number"
              min={1}
              max={max}
              value={value.stepValue || ''}
              onChange={e => onChange({ ...value, stepValue: Number(e.target.value) })}
              className="cron-input"
            />
            <span>{label.toLowerCase()}(s)</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CronGenerator() {
  const [tab, setTab] = useState('builder')
  const [fullscreen, setFullscreen] = useState(false)
  const [history, setHistory] = useState(loadHistory)

  // Builder state
  const [fields, setFields] = useState({
    minute: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
    hour: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
    day: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
    month: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
    weekday: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
  })

  // Validator state
  const [validatorInput, setValidatorInput] = useState('')

  const cronExpression = useMemo(() => {
    const parts = {}
    for (const f of FIELD_CONFIG) {
      const v = fields[f.name]
      parts[f.name] = buildCronPart(v.mode, '', v.rangeStart, v.rangeEnd, v.stepValue, v.specificValues)
    }
    return buildCronExpression(parts)
  }, [fields])

  const humanDescription = useMemo(() => describeCron(cronExpression), [cronExpression])

  const validatorResult = useMemo(() => {
    if (!validatorInput.trim()) return null
    return validateCron(validatorInput)
  }, [validatorInput])

  const validatorDescription = useMemo(() => {
    if (!validatorInput.trim() || !validatorResult?.valid) return ''
    return describeCron(validatorInput)
  }, [validatorInput, validatorResult])

  const handleFieldChange = (name, value) => {
    setFields(prev => ({ ...prev, [name]: value }))
  }

  const handleCopy = (text) => {
    copyText(text)
    saveHistory({ cron: text, description: describeCron(text) })
    setHistory(loadHistory())
  }

  const handleDownload = () => {
    downloadFile('cron.txt', cronExpression)
  }

  const handleLoadTemplate = (cron) => {
    // Parse template into builder fields
    const parts = cron.split(/\s+/)
    if (parts.length !== 5) return
    const newFields = {}
    const names = ['minute', 'hour', 'day', 'month', 'weekday']
    for (let i = 0; i < 5; i++) {
      const part = parts[i]
      const f = { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' }
      if (part === '*') {
        f.mode = 'every'
      } else if (part.startsWith('*/')) {
        f.mode = 'step'
        f.stepValue = Number(part.split('/')[1])
      } else if (part.includes('-')) {
        f.mode = 'range'
        const [s, e] = part.split('-')
        f.rangeStart = Number(s)
        f.rangeEnd = Number(e)
      } else if (part.includes(',')) {
        f.mode = 'specific'
        f.specificValues = part.split(',').map(Number)
      } else {
        f.mode = 'specific'
        f.specificValues = [Number(part)]
      }
      newFields[names[i]] = f
    }
    setFields(newFields)
    setTab('builder')
  }

  const handleClear = () => {
    setFields({
      minute: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
      hour: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
      day: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
      month: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
      weekday: { mode: 'every', specificValues: [], rangeStart: '', rangeEnd: '', stepValue: '' },
    })
    setValidatorInput('')
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Cron Generator</span>
          <span className="workspace-desc">Build & validate cron expressions</span>
        </div>
        <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      {/* Tabs */}
      <div className="sql-mode-tabs">
        <button className={`sql-mode-tab ${tab === 'builder' ? 'active' : ''}`} onClick={() => setTab('builder')}>Cron Builder</button>
        <button className={`sql-mode-tab ${tab === 'validator' ? 'active' : ''}`} onClick={() => setTab('validator')}>Cron Validator</button>
      </div>

      {tab === 'builder' && (
        <div className="workspace-body cron-body">
          {/* Left: Builder form */}
          <div className="cron-builder-panel">
            {FIELD_CONFIG.map(f => (
              <CronFieldEditor
                key={f.name}
                field={f}
                value={fields[f.name]}
                onChange={v => handleFieldChange(f.name, v)}
              />
            ))}
          </div>

          {/* Right: Output */}
          <div className="workspace-panel">
            <div className="panel-header">
              <span className="panel-label">Generated Cron</span>
            </div>
            <div className="panel-body">
              <div className="cron-output-box">
                <code className="cron-expression">{cronExpression}</code>
                <div className="cron-output-actions">
                  <button className="sql-action-btn" onClick={() => handleCopy(cronExpression)}>Copy</button>
                  <button className="sql-action-btn" onClick={handleDownload}>Download .txt</button>
                </div>
              </div>

              <div className="cron-description">
                <div className="cron-description-label">Human-readable</div>
                <div className="cron-description-text">{humanDescription}</div>
              </div>

              {/* Format reference */}
              <div className="cron-reference">
                <div className="cron-reference-title">Cron Format</div>
                <div className="cron-reference-row">
                  {['minute', 'hour', 'day', 'month', 'weekday'].map((f, i) => (
                    <div key={f} className="cron-reference-field">
                      <span className="cron-ref-star">*</span>
                      <span className="cron-ref-name">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="cron-reference-ranges">
                  <span>0-59</span>
                  <span>0-23</span>
                  <span>1-31</span>
                  <span>1-12</span>
                  <span>0-6</span>
                </div>
              </div>

              {/* Templates */}
              <div className="cron-templates">
                <div className="cron-templates-label">Templates</div>
                <div className="cron-templates-list">
                  {CRON_TEMPLATES.map((t, i) => (
                    <button key={i} className="sql-example-btn" onClick={() => handleLoadTemplate(t.cron)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'validator' && (
        <div className="workspace-body cron-body">
          <div className="workspace-panel">
            <div className="panel-header">
              <span className="panel-label">Cron Expression</span>
            </div>
            <div className="panel-body">
              <textarea
                className="cron-validator-input"
                value={validatorInput}
                onChange={e => setValidatorInput(e.target.value)}
                placeholder="Enter cron expression, e.g. */5 * * * *"
                spellCheck={false}
                translate="no"
              />
              <div className="cron-templates" style={{ marginTop: 12 }}>
                <div className="cron-templates-label">Quick Fill</div>
                <div className="cron-templates-list">
                  {CRON_TEMPLATES.map((t, i) => (
                    <button key={i} className="sql-example-btn" onClick={() => setValidatorInput(t.cron)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="sql-action-btn" onClick={() => handleCopy(validatorInput)} style={{ marginTop: 8 }} disabled={!validatorInput.trim()}>Copy</button>
            </div>
          </div>

          <div className="workspace-panel">
            <div className="panel-header">
              <span className="panel-label">Validation Result</span>
            </div>
            <div className="panel-body">
              {!validatorInput.trim() ? (
                <pre className="editor-output"><span className="editor-output-placeholder">Enter a cron expression to validate...</span></pre>
              ) : validatorResult?.valid ? (
                <div className="validator-result valid">
                  <div className="validator-icon">✓</div>
                  <div className="validator-message">Valid Cron Expression</div>
                  {validatorDescription && (
                    <div className="cron-description-text" style={{ marginTop: 8 }}>{validatorDescription}</div>
                  )}
                </div>
              ) : (
                <div className="jsv-errors">
                  <div className="jsv-errors-header">
                    <span className="error-detail-icon">✕</span>
                    <span>Invalid Cron Expression</span>
                  </div>
                  <div className="jsv-errors-list">
                    {validatorResult?.errors.map((err, i) => (
                      <div key={i} className="jsv-error-row">
                        {err.field !== 'general' && <div className="jsv-error-path">{err.field}</div>}
                        <div className="jsv-error-message">{err.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Format reference */}
              <div className="cron-reference" style={{ marginTop: 16 }}>
                <div className="cron-reference-title">Cron Format</div>
                <div className="cron-reference-row">
                  {['minute', 'hour', 'day', 'month', 'weekday'].map(f => (
                    <div key={f} className="cron-reference-field">
                      <span className="cron-ref-star">*</span>
                      <span className="cron-ref-name">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="cron-reference-ranges">
                  <span>0-59</span>
                  <span>0-23</span>
                  <span>1-31</span>
                  <span>1-12</span>
                  <span>0-6</span>
                </div>
              </div>
            </div>
          </div>
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
              <span key={i} className="sql-gen-history-item" style={{ cursor: 'pointer' }} onClick={() => { setValidatorInput(h.cron); setTab('validator') }}>
                <span className="sql-gen-history-table" style={{ fontFamily: 'monospace' }}>{h.cron}</span>
                <span className="sql-gen-history-time">{h.description || timeAgo(h.time)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

      {!fullscreen && (
        <>
          <Breadcrumb toolId="cron-generator" />
          <ToolGuide toolId="cron-generator" />
          <RelatedTools toolId="cron-generator" />
        </>
      )}
    </>
  )
}
