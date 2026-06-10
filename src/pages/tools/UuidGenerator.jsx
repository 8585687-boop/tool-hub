import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { generateUUID } from '../../tools/security/uuidGenerator'
import { copyText } from '../../tools/utils/copyText'

const tool = tools.find(t => t.id === 'uuid-generator')

export default function UuidGenerator() {
  const [uuid, setUuid] = useState('')
  const [history, setHistory] = useState([])
  const [fullscreen, setFullscreen] = useState(false)

  const generate = () => {
    const result = generateUUID()
    if (result.success) {
      setUuid(result.result)
      setHistory(prev => [result.result, ...prev])
    }
  }

  useEffect(() => {
    generate()
  }, [])

  const handleClear = () => {
    setHistory([])
    generate()
  }

  const copyAll = () => {
    if (history.length > 0) {
      copyText(history.join('\n'))
    }
  }

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">UUID Generator</span>
          <span className="workspace-desc">Generate UUID v4</span>
          <span className="workspace-status valid">Ready</span>
        </div>
        <div className="toolbar">
          <button className="toolbar-btn toolbar-btn-text" onClick={copyAll} title="Copy all UUIDs">Copy All</button>
          <Toolbar
            copyText={uuid}
            onClear={handleClear}
            onFullscreen={() => setFullscreen(!fullscreen)}
            isFullscreen={fullscreen}
          />
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Current UUID</span>
          </div>
          <div className="panel-body">
            <div className="uuid-result">
              <div className="uuid-text">{uuid}</div>
              <button className="btn" onClick={generate} style={{ marginTop: 16 }}>Generate</button>
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">History</span>
          </div>
          <div className="panel-body">
            {history.length === 0 ? (
              <div className="editor-output-placeholder">No history yet</div>
            ) : (
              <div className="uuid-history">
                {history.map((id, i) => (
                  <div key={i} className="uuid-history-item" onClick={() => copyText(id)}>
                    {id}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="uuid-generator" />
          <ToolGuide toolId="uuid-generator" />
          <RelatedTools toolId="uuid-generator" />
        </>
      )}
    </>
  )
}
