import { useState } from 'react'

export default function Toolbar({ copyText, onClear, onFullscreen, isFullscreen }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!copyText) return
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="toolbar">
      <button
        className="toolbar-btn toolbar-btn-text"
        onClick={handleCopy}
        title="Copy output"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <button
        className="toolbar-btn"
        onClick={onClear}
        title="Clear"
      >
        ✕
      </button>
      <button
        className={`toolbar-btn ${isFullscreen ? 'active' : ''}`}
        onClick={onFullscreen}
        title="Fullscreen"
      >
        {isFullscreen ? '⤓' : '⤢'}
      </button>
    </div>
  )
}
