import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import { tools } from '../../data/tools'
import { countWords } from '../../tools/text/wordCounter'

const tool = tools.find(t => t.id === 'word-counter')

export default function WordCounter() {
  const [input, setInput] = useState('')
  const [stats, setStats] = useState(null)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!input) {
      setStats(null)
      return
    }
    setStats(countWords(input))
  }, [input])

  const handleClear = () => {
    setInput('')
    setStats(null)
  }

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Word Counter</span>
          <span className="workspace-desc">Count words, characters, lines</span>
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
                  <div className="stat-value">{stats.words}</div>
                  <div className="stat-label">Words</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.characters}</div>
                  <div className="stat-label">Characters</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.charactersWithoutSpaces}</div>
                  <div className="stat-label">No Spaces</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.lines}</div>
                  <div className="stat-label">Lines</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.readingTime}s</div>
                  <div className="stat-label">Reading Time</div>
                </div>
              </div>
            ) : (
              <div className="editor-output-placeholder">Start typing to see statistics</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
