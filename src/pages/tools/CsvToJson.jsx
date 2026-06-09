import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import { tools } from '../../data/tools'
import LineOutput from '../../components/LineOutput'
import { csvToJson } from '../../tools/convert/csvToJson'
import { downloadFile } from '../../tools/utils/downloadFile'

const DELIMITERS = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab (\\t)' },
  { value: '|', label: 'Pipe (|)' },
]

const DEFAULT_CSV = `name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Paris`

const tool = tools.find(t => t.id === 'csv-to-json')

export default function CsvToJson() {
  const [input, setInput] = useState(DEFAULT_CSV)
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return null
    return csvToJson(input, { delimiter, hasHeader })
  }, [input, delimiter, hasHeader])

  const handleClear = () => {
    setInput('')
  }

  const handleDownload = () => {
    if (result?.result) {
      downloadFile('data.json', result.result)
    }
  }

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">CSV to JSON</span>
          <span className="workspace-desc">Convert CSV to JSON with custom delimiters</span>
          <span className={`workspace-status ${result ? (result.success ? 'valid' : 'invalid') : 'idle'}`}>
            {result ? (result.success ? 'Converted' : 'Error') : 'Ready'}
          </span>
        </div>
        <div className="toolbar">
          <button className="toolbar-btn toolbar-btn-text" onClick={handleDownload} title="Download JSON">Download</button>
          <Toolbar
            copyText={result?.success ? result.result : ''}
            onClear={handleClear}
            onFullscreen={() => setFullscreen(!fullscreen)}
            isFullscreen={fullscreen}
          />
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">CSV Input</span>
          </div>
          <div className="panel-body">
            <div className="csv-options">
              <div className="csv-option-row">
                <label className="csv-option-label">Delimiter</label>
                <div className="csv-option-btns">
                  {DELIMITERS.map(d => (
                    <button
                      key={d.value}
                      className={`ts-unit-btn ${delimiter === d.value ? 'active' : ''}`}
                      onClick={() => setDelimiter(d.value)}
                    >{d.label}</button>
                  ))}
                </div>
              </div>
              <div className="csv-option-row">
                <label className="csv-option-label">First row is header</label>
                <button
                  className={`ts-unit-btn ${hasHeader ? 'active' : ''}`}
                  onClick={() => setHasHeader(!hasHeader)}
                >{hasHeader ? 'Yes' : 'No'}</button>
              </div>
            </div>
            <textarea
              className="editor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste CSV data here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">JSON Output</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <div className="ts-empty">Enter CSV data to convert</div>
            ) : !result.success ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Parse Error</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <>
                {result.warning && (
                  <div className="ts-warning">
                    <span className="ts-warning-icon">⚠</span>
                    <span>{result.warning}</span>
                  </div>
                )}
                <LineOutput text={result.result} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
