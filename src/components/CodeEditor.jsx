import { useRef, useEffect } from 'react'
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
  const displayPlaceholder = placeholder || DEFAULT_PLACEHOLDERS[language] || 'Enter text here...'

  const updatePlaceholder = () => {
    if (placeholderRef.current) {
      placeholderRef.current.style.display = editorRef.current?.getValue() ? 'none' : 'flex'
    }
  }

  useEffect(() => {
    updatePlaceholder()
  }, [value])

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
  }

  return (
    <div className="code-editor-wrapper" translate="no">
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
        loading={
          <div className="code-editor-loading">
            <span>Loading editor...</span>
          </div>
        }
      />
    </div>
  )
}
