import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { generatePassword, getPasswordStrength } from '../../tools/security/passwordGenerator'

const tool = tools.find(t => t.id === 'password-generator')

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(null)
  const [error, setError] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  const generate = () => {
    const result = generatePassword({ length, uppercase, lowercase, numbers, symbols })
    if (result.success) {
      setPassword(result.result)
      setStrength(getPasswordStrength(result.result))
      setError('')
    } else {
      setPassword('')
      setStrength(null)
      setError(result.error)
    }
  }

  useEffect(() => {
    generate()
  }, [length, uppercase, lowercase, numbers, symbols])

  const handleClear = () => {
    setLength(16)
    setUppercase(true)
    setLowercase(true)
    setNumbers(true)
    setSymbols(true)
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <SEO title={tool.seoTitle} description={tool.seoDescription} />
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Password Generator</span>
          <span className="workspace-desc">Generate secure random passwords</span>
          {strength && (
            <span className="workspace-status" style={{ color: strength.color, background: strength.color + '18' }}>
              {strength.label}
            </span>
          )}
        </div>
        <Toolbar
          copyText={password}
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Options</span>
          </div>
          <div className="panel-body">
            <div className="password-options">
              <div className="password-length">
                <label>Length: {length}</label>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={e => setLength(parseInt(e.target.value))}
                />
              </div>
              <label className="password-check">
                <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
                Uppercase (A-Z)
              </label>
              <label className="password-check">
                <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} />
                Lowercase (a-z)
              </label>
              <label className="password-check">
                <input type="checkbox" checked={numbers} onChange={e => setNumbers(e.target.checked)} />
                Numbers (0-9)
              </label>
              <label className="password-check">
                <input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} />
                Symbols (!@#$...)
              </label>
              {error && <div className="error-detail-text">{error}</div>}
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Password</span>
          </div>
          <div className="panel-body">
            {password ? (
              <div className="password-result">
                <div className="password-text">{password}</div>
                <button className="btn" onClick={generate} style={{ marginTop: 16 }}>Regenerate</button>
              </div>
            ) : (
              <div className="editor-output-placeholder">Select options to generate</div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="password-generator" />
          <ToolGuide toolId="password-generator" />
          <RelatedTools toolId="password-generator" />
        </>
      )}
    </>
  )
}
