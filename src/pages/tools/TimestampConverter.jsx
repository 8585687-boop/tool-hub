import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import { convertTimestamp } from '../../tools/converter/timestampConverter'
import { copyText } from '../../tools/utils/copyText'

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
  'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Kolkata',
  'Australia/Sydney', 'Pacific/Auckland',
]

export default function TimestampConverter() {
  const [input, setInput] = useState('')
  const [unit, setUnit] = useState('s')
  const [timeZone, setTimeZone] = useState('UTC')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setResult(null)
      setStatus('idle')
      return
    }
    const res = convertTimestamp(input, { unit, timeZone })
    if (res.success) {
      setResult(res.result)
      setStatus('valid')
    } else {
      setResult({ error: res.error })
      setStatus('invalid')
    }
  }, [input, unit, timeZone])

  const handleClear = () => {
    setInput('')
    setResult(null)
    setStatus('idle')
  }

  const handleCopy = () => {
    if (!result || result.error) return
    const text = [
      `ISO: ${result.iso}`,
      `Unix (s): ${result.unixSec}`,
      `Unix (ms): ${result.unixMs}`,
      `Local: ${result.local}`,
      `Timezone: ${result.tzDisplay}`,
      `Relative: ${result.relative}`,
    ].join('\n')
    copyText(text)
  }

  const setNow = () => {
    const now = Date.now()
    setInput(unit === 'ms' ? String(now) : String(Math.floor(now / 1000)))
  }

  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Ready'

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Timestamp Converter</span>
          <span className="workspace-desc">Unix ↔ ISO timestamp conversion</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={result && !result.error ? 'copied' : ''}
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
            <div className="ts-controls">
              <div className="ts-control-row">
                <label className="ts-label">Timestamp / Date</label>
                <button className="ts-now-btn" onClick={setNow}>Now</button>
              </div>
              <input
                className="ts-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="e.g. 1686226200 or 2023-06-08T08:30:00Z"
                spellCheck={false}
              />
              <div className="ts-control-row">
                <div className="ts-unit-btns">
                  <button
                    className={`ts-unit-btn ${unit === 's' ? 'active' : ''}`}
                    onClick={() => setUnit('s')}
                  >Seconds</button>
                  <button
                    className={`ts-unit-btn ${unit === 'ms' ? 'active' : ''}`}
                    onClick={() => setUnit('ms')}
                  >Milliseconds</button>
                </div>
                <select
                  className="ts-select"
                  value={timeZone}
                  onChange={e => setTimeZone(e.target.value)}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Result</span>
            {result && !result.error && (
              <button className="panel-action" onClick={handleCopy}>Copy</button>
            )}
          </div>
          <div className="panel-body">
            {!result ? (
              <div className="ts-empty">Enter a timestamp or date string to convert</div>
            ) : result.error ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid Input</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div className="ts-result">
                <div className="ts-result-item">
                  <div className="ts-result-label">ISO 8601</div>
                  <div className="ts-result-value ts-mono">{result.iso}</div>
                </div>
                <div className="ts-result-item">
                  <div className="ts-result-label">Unix (seconds)</div>
                  <div className="ts-result-value ts-mono">{result.unixSec}</div>
                </div>
                <div className="ts-result-item">
                  <div className="ts-result-label">Unix (milliseconds)</div>
                  <div className="ts-result-value ts-mono">{result.unixMs}</div>
                </div>
                <div className="ts-result-item">
                  <div className="ts-result-label">Local</div>
                  <div className="ts-result-value">{result.local}</div>
                </div>
                <div className="ts-result-item">
                  <div className="ts-result-label">{timeZone}</div>
                  <div className="ts-result-value">{result.tzDisplay}</div>
                </div>
                <div className="ts-result-item">
                  <div className="ts-result-label">Relative</div>
                  <div className="ts-result-value">{result.relative}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
