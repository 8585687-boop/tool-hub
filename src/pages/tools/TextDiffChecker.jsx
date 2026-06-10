import { useState, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { computeDiff } from '../../tools/text/diffUtils'

const tool = tools.find(t => t.id === 'text-diff-checker')

function DiffEditor({ value, onChange, diffLines, type, placeholder, gutterRef, textareaRef, overlayRef, onScroll, syncScrollEnabled, peerTextareaRef }) {
  const lineCount = value ? value.split('\n').length : 1

  const handleScroll = useCallback((e) => {
    const st = e.target.scrollTop
    const sl = e.target.scrollLeft
    // sync overlay
    if (overlayRef.current) {
      overlayRef.current.scrollTop = st
      overlayRef.current.scrollLeft = sl
    }
    // sync gutter
    if (gutterRef.current) {
      gutterRef.current.scrollTop = st
    }
    // sync peer editor
    if (syncScrollEnabled && peerTextareaRef?.current) {
      peerTextareaRef.current.scrollTop = st
      peerTextareaRef.current.scrollLeft = sl
      // also sync peer's overlay & gutter via onScroll callback
      if (onScroll) onScroll(st, sl)
    }
  }, [syncScrollEnabled, overlayRef, gutterRef, peerTextareaRef, onScroll])

  return (
    <div className="diff-editor">
      <div className="diff-editor-gutter" ref={gutterRef}>
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="diff-gutter-line">{i + 1}</div>
        ))}
      </div>
      <div className="diff-editor-body">
        <div className="diff-overlay" ref={overlayRef}>
          {diffLines.map((line, i) => (
            <div key={i} className={`diff-overlay-line ${line.type === type ? (type === 'removed' ? 'diff-hl-removed' : 'diff-hl-added') : ''}`}>
              <span className="diff-overlay-prefix">
                {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '}
              </span>
              {line.content}
            </div>
          ))}
          {!diffLines.length && (
            <div className="diff-overlay-line diff-overlay-placeholder">{placeholder}</div>
          )}
        </div>
        <textarea
          ref={textareaRef}
          className="diff-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

export default function TextDiffChecker() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [syncScrollEnabled, setSyncScrollEnabled] = useState(false)

  const leftGutterRef = useRef(null)
  const leftTextareaRef = useRef(null)
  const leftOverlayRef = useRef(null)
  const rightGutterRef = useRef(null)
  const rightTextareaRef = useRef(null)
  const rightOverlayRef = useRef(null)

  const diff = useMemo(() => computeDiff(text1, text2), [text1, text2])

  const handleClear = () => {
    setText1('')
    setText2('')
  }

  // When left scrolls, sync right's overlay & gutter
  const onLeftScroll = useCallback((scrollTop, scrollLeft) => {
    if (rightOverlayRef.current) {
      rightOverlayRef.current.scrollTop = scrollTop
      rightOverlayRef.current.scrollLeft = scrollLeft
    }
    if (rightGutterRef.current) {
      rightGutterRef.current.scrollTop = scrollTop
    }
  }, [])

  // When right scrolls, sync left's overlay & gutter
  const onRightScroll = useCallback((scrollTop, scrollLeft) => {
    if (leftOverlayRef.current) {
      leftOverlayRef.current.scrollTop = scrollTop
      leftOverlayRef.current.scrollLeft = scrollLeft
    }
    if (leftGutterRef.current) {
      leftGutterRef.current.scrollTop = scrollTop
    }
  }, [])

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <SEO title={tool.seoTitle} description={tool.seoDescription} />
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">Text Diff Checker</span>
          <span className="workspace-desc">Compare two texts and find differences</span>
          <span className={`workspace-status ${diff.changed ? 'invalid' : diff.leftDiff.length ? 'valid' : 'idle'}`}>
            {diff.changed ? 'Different' : diff.leftDiff.length ? 'Identical' : 'Ready'}
          </span>
        </div>
        <div className="toolbar">
          {diff.changed && (
            <span className="diff-stats">
              <span className="diff-stat-removed">-{diff.removed}</span>
              <span className="diff-stat-added">+{diff.added}</span>
            </span>
          )}
          <button
            className={`toolbar-btn ${syncScrollEnabled ? 'active' : ''}`}
            onClick={() => setSyncScrollEnabled(!syncScrollEnabled)}
            title={syncScrollEnabled ? 'Unlock sync scroll' : 'Lock sync scroll'}
          >
            {syncScrollEnabled ? '⎗' : '⎘'}
          </button>
          <Toolbar onClear={handleClear} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} />
        </div>
      </div>

      <div className="workspace-body diff-workspace-body">
        <div className="workspace-panel diff-panel">
          <div className="panel-header">
            <span className="panel-label">Original</span>
          </div>
          <DiffEditor
            value={text1}
            onChange={setText1}
            diffLines={diff.leftDiff}
            type="removed"
            placeholder="Paste original text here..."
            gutterRef={leftGutterRef}
            textareaRef={leftTextareaRef}
            overlayRef={leftOverlayRef}
            syncScrollEnabled={syncScrollEnabled}
            peerTextareaRef={rightTextareaRef}
            onScroll={onLeftScroll}
          />
        </div>

        <div className="workspace-panel diff-panel">
          <div className="panel-header">
            <span className="panel-label">New</span>
          </div>
          <DiffEditor
            value={text2}
            onChange={setText2}
            diffLines={diff.rightDiff}
            type="added"
            placeholder="Paste new text here..."
            gutterRef={rightGutterRef}
            textareaRef={rightTextareaRef}
            overlayRef={rightOverlayRef}
            syncScrollEnabled={syncScrollEnabled}
            peerTextareaRef={leftTextareaRef}
            onScroll={onRightScroll}
          />
        </div>
      </div>
    </div>
      {!fullscreen && (
        <>
          <Breadcrumb toolId="text-diff-checker" />
          <ToolGuide toolId="text-diff-checker" />
          <RelatedTools toolId="text-diff-checker" />
        </>
      )}
    </>
  )
}
