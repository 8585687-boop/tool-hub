import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { calcCRC32 } from '../../tools/crc/crc32'

const VARIANTS = ['CRC-32', 'CRC-32C', 'CRC-32/BZIP2', 'CRC-32/JAMCRC']
const FORMATS = ['Both', 'Hex', 'Dec']
const tool = tools.find(t => t.id === 'crc32-calculator')

export default function Crc32Calculator() {
  const [input, setInput] = useState('')
  const [variant, setVariant] = useState('CRC-32')
  const [format, setFormat] = useState('Both')
  const [fullscreen, setFullscreen] = useState(false)

  const result = useMemo(() => {
    return calcCRC32(input, variant)
  }, [input, variant])

  const handleClear = () => setInput('')

  const copyValue = result?.success
    ? (format === 'Dec'
        ? String(result.crcDec)
        : format === 'Hex'
          ? result.result
          : `${result.result} (${result.crcDec})`)
    : ''

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">CRC32 Calculator</span>
          <span className="workspace-desc">Compute CRC-32 checksums</span>
          <span className={`workspace-status ${result?.success ? (input ? 'valid' : 'idle') : 'invalid'}`}>
            {result?.success ? (input ? 'Computed' : 'Ready') : 'Error'}
          </span>
        </div>
        <Toolbar
          copyText={copyValue}
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
            <div className="crc-options">
              <div className="crc-option-row">
                <label className="crc-option-label">Variant</label>
                <div className="crc-option-btns">
                  {VARIANTS.map(v => (
                    <button
                      key={v}
                      className={`ts-unit-btn ${variant === v ? 'active' : ''}`}
                      onClick={() => setVariant(v)}
                    >{v}</button>
                  ))}
                </div>
              </div>
              <div className="crc-option-row">
                <label className="crc-option-label">Format</label>
                <div className="crc-option-btns">
                  {FORMATS.map(f => (
                    <button
                      key={f}
                      className={`ts-unit-btn ${format === f ? 'active' : ''}`}
                      onClick={() => setFormat(f)}
                    >{f}</button>
                  ))}
                </div>
              </div>
            </div>
            <CodeEditor
              value={input}
              language="plaintext"
              onChange={setInput}
              placeholder="Enter text to compute CRC32..."
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Result</span>
          </div>
          <div className="panel-body">
            {!result ? (
              <div className="ts-empty">Enter text to compute CRC32</div>
            ) : !result.success ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>Error</span>
                </div>
                <div className="error-detail-text">{result.error}</div>
              </div>
            ) : (
              <div className="crc-result">
                <div className="crc-variant-label">{variant}</div>
                {(format === 'Both' || format === 'Hex') && (
                  <div className="crc-value-row">
                    <span className="crc-value-label">Hex</span>
                    <code className="crc-value ts-mono">{result.result}</code>
                  </div>
                )}
                {(format === 'Both' || format === 'Dec') && (
                  <div className="crc-value-row">
                    <span className="crc-value-label">Dec</span>
                    <code className="crc-value ts-mono">{result.crcDec}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="crc32-calculator" />
          <ToolGuide toolId="crc32-calculator" />
          <RelatedTools toolId="crc32-calculator" />
        </>
      )}
    </>
  )
}
