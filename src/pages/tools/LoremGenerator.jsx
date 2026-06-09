import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import LineOutput from '../../components/LineOutput'
import { generateLorem } from '../../tools/text/loremGenerator'

const COUNTS = [1, 3, 5, 10]

export default function LoremGenerator() {
  const [count, setCount] = useState(1)
  const [output, setOutput] = useState('')
  const [fullscreen, setFullscreen] = useState(false)

  const generate = () => {
    const result = generateLorem(count)
    if (result.success) setOutput(result.result)
  }

  useEffect(() => {
    generate()
  }, [count])

  const handleClear = () => {
    setCount(1)
  }

  return (
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Lorem Ipsum Generator</span>
          <span className="workspace-desc">Generate placeholder text</span>
          <span className="workspace-status valid">Ready</span>
        </div>
        <Toolbar copyText={output} onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Options</span>
          </div>
          <div className="panel-body">
            <div className="lorem-options">
              <label className="lorem-label">Paragraphs: {count}</label>
              <div className="lorem-count-btns">
                {COUNTS.map(c => (
                  <button
                    key={c}
                    className={`hash-algo-tab ${count === c ? 'active' : ''}`}
                    onClick={() => setCount(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button className="btn" onClick={generate} style={{ marginTop: 16 }}>Regenerate</button>
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">Output</span>
          </div>
          <div className="panel-body">
            <LineOutput text={output} />
          </div>
        </div>
      </div>
    </div>
  )
}
