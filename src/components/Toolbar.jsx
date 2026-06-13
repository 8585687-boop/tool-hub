import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Toolbar({ copyText, onClear, onFullscreen, isFullscreen }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const handleCopy = () => {
    if (!copyText) return
    navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="toolbar">
      {copyText !== undefined && (
        <button
          className="toolbar-btn toolbar-btn-text"
          onClick={handleCopy}
          title="Copy output"
        >
          {copied ? `✓ ${t('copied')}` : t('copy')}
        </button>
      )}
      <button
        className="toolbar-btn"
        onClick={onClear}
        title={t('clear')}
      >
        ✕
      </button>
      <button
        className={`toolbar-btn ${isFullscreen ? 'active' : ''}`}
        onClick={onFullscreen}
        title={t('fullscreen')}
      >
        {isFullscreen ? '⤓' : '⤢'}
      </button>
    </div>
  )
}
