import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import LineOutput from '../../components/LineOutput'
import { convertCase } from '../../tools/text/caseConverter'

const CASES = [
  { type: 'uppercase', label: 'UPPERCASE' },
  { type: 'lowercase', label: 'lowercase' },
  { type: 'title', label: 'Title Case' }
]

const tool = tools.find(t => t.id === 'case-converter')

export default function CaseConverter() {
  const [input, setInput] = useState('')
  const [caseType, setCaseType] = useState('uppercase')
  const [output, setOutput] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input) {
      setOutput('')
      return
    }
    const result = convertCase(input, caseType)
    if (result.success) setOutput(result.result)
  }, [input, caseType])

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Case Converter</span>
          <span className="workspace-desc">Convert text case</span>
          <span className="workspace-status idle">Ready</span>
        </div>
        <Toolbar copyText={output} onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Input</span>
          </div>
          <div className="panel-body">
            <textarea
              className="editor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter text to convert, e.g. hello world"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Output</span>
            <div className="hash-algo-tabs">
              {CASES.map(c => (
                <button
                  key={c.type}
                  className={`hash-algo-tab ${caseType === c.type ? 'active' : ''}`}
                  onClick={() => setCaseType(c.type)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="panel-body">
            <LineOutput text={output} />
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="case-converter" />
          <ToolGuide toolId="case-converter" />
          <RelatedTools toolId="case-converter" />
        </>
      )}
    </>
  )
}
