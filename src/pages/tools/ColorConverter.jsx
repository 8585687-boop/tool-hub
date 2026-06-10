import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { convertColor } from '../../tools/converter/colorConverter'
import { copyText } from '../../tools/utils/copyText'

const FORMATS = ['HEX', 'RGB', 'HSL', 'CMYK']
const tool = tools.find(t => t.id === 'color-converter')

export default function ColorConverter() {
  const [input, setInput] = useState('#6366F1')
  const [format, setFormat] = useState('HEX')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setResult(null)
      setStatus('idle')
      return
    }
    const res = convertColor(input, format)
    if (res.success) {
      setResult(res.result)
      setStatus('valid')
    } else {
      setResult({ error: res.error })
      setStatus('invalid')
    }
  }, [input, format])

  const handleClear = () => {
    setInput('')
    setResult(null)
    setStatus('idle')
  }

  const handleCopy = (text) => {
    copyText(text)
  }

  const colorPreview = result && !result.error ? result.hex : '#888'

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Color Converter</span>
          <span className="workspace-desc">HEX/RGB/HSL/CMYK conversion</span>
          <span className={`workspace-status ${status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'}`}>
            {status === 'valid' ? 'Valid' : status === 'invalid' ? 'Invalid' : 'Ready'}
          </span>
        </div>
        <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
          </div>
          <div className="panel-body">
            <div className="color-controls">
              <div className="color-preview-row">
                <span className="color-picker-label">颜色选择器：</span>
                <div className="color-swatch" style={{ backgroundColor: colorPreview }} />
                <input
                  type="color"
                  className="color-picker"
                  value={result && !result.error ? result.hex : '#888888'}
                  onChange={e => {
                    setInput(e.target.value)
                    setFormat('HEX')
                  }}
                />
              </div>
              <div className="color-format-btns">
                {FORMATS.map(f => (
                  <button
                    key={f}
                    className={`ts-unit-btn ${format === f ? 'active' : ''}`}
                    onClick={() => setFormat(f)}
                  >{f}</button>
                ))}
              </div>
              <input
                className="ts-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={format === 'HEX' ? '#FF0000' : format === 'RGB' ? 'rgb(255, 0, 0)' : format === 'HSL' ? 'hsl(0, 100%, 50%)' : 'cmyk(0, 100, 100, 0)'}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Result</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <div className="ts-empty">Enter a color value to convert</div>
            ) : result.error ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Invalid Color</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div className="color-results">
                <div className="color-swatch-large" style={{ backgroundColor: result.hex }} />
                <div className="color-values">
                  {FORMATS.map(f => {
                    const val = result[f.toLowerCase()]
                    return (
                      <div key={f} className="color-value-row">
                        <span className="color-value-label">{f}</span>
                        <span className="color-value-text ts-mono">{val}</span>
                        <button className="panel-action" onClick={() => handleCopy(val)}>Copy</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="color-converter" />
          <ToolGuide toolId="color-converter" />
          <RelatedTools toolId="color-converter" />
        </>
      )}
    </>
  )
}
