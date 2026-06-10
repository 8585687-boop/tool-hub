import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { countCharacters } from '../../tools/text/characterCounter'

const tool = tools.find(t => t.id === 'character-counter')

export default function CharacterCounter() {
  const [input, setInput] = useState('')
  const [stats, setStats] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input) {
      setStats(null)
      return
    }
    setStats(countCharacters(input))
  }, [input])

  const handleClear = () => {
    setInput('')
    setStats(null)
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Character Counter</span>
          <span className="workspace-desc">Count characters in text</span>
          <span className="workspace-status idle">Ready</span>
        </div>
        <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
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
              placeholder="Type or paste text here..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Statistics</span>
          </div>
          <div className="panel-body">
            {stats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Characters</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.withSpaces}</div>
                  <div className="stat-label">Whitespace</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.withoutSpaces}</div>
                  <div className="stat-label">No Spaces</div>
                </div>
              </div>
            ) : (
              <div className="editor-output-placeholder">Start typing to see statistics</div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="character-counter" />
          <ToolGuide toolId="character-counter" />
          <RelatedTools toolId="character-counter" />
        </>
      )}
    </>
  )
}
