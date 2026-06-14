import { useRef, useEffect, useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'

const LANGUAGE_MAP = {
  json: 'json',
  yaml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  markdown: 'markdown',
  plaintext: 'plaintext',
  html: 'html',
  css: 'css',
  javascript: 'javascript',
}

const DEFAULT_PLACEHOLDERS = {
  json: 'Enter JSON here, e.g. {"name": "Tom", "age": 20}',
  yaml: 'Enter YAML here, e.g.\nname: John\nage: 30',
  xml: 'Enter XML here, e.g.\n<root>\n  <item>Hello</item>\n</root>',
  sql: 'Write SQL query here...',
  markdown: 'Write Markdown content here...',
  plaintext: 'Enter text here...',
  html: 'Enter HTML here...',
  css: 'Enter CSS here...',
  javascript: 'Write JavaScript code here...',
}

export default function CodeEditor({
  value = '',
  language = 'plaintext',
  readOnly = false,
  onChange,
  placeholder,
  height = '100%',
  wordWrap = true,
  folding = true,
  minimap = false,
  lineNumbers = 'on',
}) {
  const lang = LANGUAGE_MAP[language] || 'plaintext'
  const placeholderRef = useRef(null)
  const editorRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [pendingValue, setPendingValue] = useState(null)
  const displayPlaceholder = placeholder || DEFAULT_PLACEHOLDERS[language] || 'Enter text here...'

  const updatePlaceholder = useCallback(() => {
    if (placeholderRef.current) {
      placeholderRef.current.style.display = editorRef.current?.getValue() ? 'none' : 'flex'
    }
  }, [])

  useEffect(() => {
    updatePlaceholder()
  }, [value, updatePlaceholder])

  // Sync pending value to editor once mounted
  useEffect(() => {
    if (ready && editorRef.current && pendingValue !== null) {
      const current = editorRef.current.getValue()
      if (current !== pendingValue) {
        editorRef.current.setValue(pendingValue)
      }
      setPendingValue(null)
    }
  }, [ready, pendingValue])

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor

    monaco.editor.defineTheme('toolhub', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#fafafa',
        'editor.foreground': '#1e1e1e',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editorLineNumber.foreground': '#b0b0b0',
        'editorLineNumber.activeForeground': '#6366f1',
        'editor.selectionBackground': '#d4d4ff',
        'editorCursor.foreground': '#6366f1',
        'editorIndentGuide.background': '#e8e8e8',
        'editorIndentGuide.activeBackground': '#d0d0d0',
      },
    })
    monaco.editor.setTheme('toolhub')

    editor.onDidChangeModelContent(updatePlaceholder)
    updatePlaceholder()
    setReady(true)
  }

  // Textarea change: update parent and buffer for later sync
  const handleTextareaChange = (e) => {
    const v = e.target.value
    setPendingValue(v)
    onChange?.(v)
  }

  return (
    <div className="code-editor-wrapper" translate="no">
      {/* Textarea fallback — visible until Monaco is ready */}
      {!ready && !readOnly && (
        <textarea
          className="code-editor-fallback"
          value={pendingValue !== null ? pendingValue : value}
          onChange={handleTextareaChange}
          placeholder={displayPlaceholder}
          spellCheck={false}
          autoFocus
        />
      )}
      {!ready && readOnly && (
        <div className="code-editor-fallback code-editor-fallback-readonly">
          {value || <span className="code-editor-fallback-placeholder">{displayPlaceholder}</span>}
        </div>
      )}

      <div
        ref={placeholderRef}
        className="code-editor-placeholder"
      >
        <span>{displayPlaceholder}</span>
      </div>
      <Editor
        height={height}
        language={lang}
        value={value}
        onChange={onChange}
        onMount={handleEditorMount}
        theme="toolhub"
        options={{
          readOnly,
          wordWrap: wordWrap ? 'on' : 'off',
          folding,
          minimap: { enabled: minimap },
          lineNumbers,
          fontSize: 14,
          fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
          fontLigatures: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          contextmenu: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          parameterHints: { enabled: false },
          wordBasedSuggestions: 'off',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
        }}
        loading={null}
      />
    </div>
  )
}
