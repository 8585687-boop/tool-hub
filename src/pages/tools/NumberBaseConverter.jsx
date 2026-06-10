import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { convertBase } from '../../tools/number/baseConverter'

const BASE_OPTIONS = Array.from({ length: 61 }, (_, i) => i + 2)

const COMMON_BASES = [
  { value: 2, label: 'Binary (2)' },
  { value: 8, label: 'Octal (8)' },
  { value: 10, label: 'Decimal (10)' },
  { value: 16, label: 'Hex (16)' },
  { value: 36, label: 'Base36 (36)' },
  { value: 62, label: 'Base62 (62)' },
]

const tool = tools.find(t => t.id === 'number-base-converter')

export default function NumberBaseConverter() {
  const [input, setInput] = useState('')
  const [fromBase, setFromBase] = useState(10)
  const [toBase, setToBase] = useState(2)
  const [fullscreen, setFullscreen] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return null
    return convertBase(input, fromBase, toBase)
  }, [input, fromBase, toBase])

  const handleClear = () => {
    setInput('')
  }

  const handleSwap = () => {
    const tmp = fromBase
    setFromBase(toBase)
    setToBase(tmp)
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Number Base Converter</span>
          <span className="workspace-desc">Convert numbers between bases 2–62</span>
          <span className={`workspace-status ${result ? (result.success ? 'valid' : 'invalid') : 'idle'}`}>
            {result ? (result.success ? 'Converted' : 'Error') : 'Ready'}
          </span>
        </div>
        <Toolbar
          copyText={result?.success ? result.result : ''}
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
            <div className="base-controls">
              <div className="base-control-row">
                <label className="base-control-label">From Base</label>
                <select
                  className="base-select"
                  value={fromBase}
                  onChange={e => setFromBase(Number(e.target.value))}
                >
                  {BASE_OPTIONS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className="base-control-hint">
                  {COMMON_BASES.find(c => c.value === fromBase)?.label || `Base ${fromBase}`}
                </span>
              </div>
              <div className="base-control-row base-swap-row">
                <button className="base-swap-btn" onClick={handleSwap} title="Swap bases">⇄ Swap</button>
              </div>
              <div className="base-control-row">
                <label className="base-control-label">To Base</label>
                <select
                  className="base-select"
                  value={toBase}
                  onChange={e => setToBase(Number(e.target.value))}
                >
                  {BASE_OPTIONS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <span className="base-control-hint">
                  {COMMON_BASES.find(c => c.value === toBase)?.label || `Base ${toBase}`}
                </span>
              </div>
            </div>
            <input
              className="base-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter a number (e.g. 255, FF, 1010)"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Result</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <div className="ts-empty">Enter a number to convert</div>
            ) : !result.success ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Conversion Error</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div className="base-result">
                <div className="base-result-value ts-mono">{result.result}</div>
                <div className="base-result-meta">
                  Base {fromBase} → Base {toBase}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="number-base-converter" />
          <ToolGuide toolId="number-base-converter" />
          <RelatedTools toolId="number-base-converter" />
        </>
      )}
    </>
  )
}
