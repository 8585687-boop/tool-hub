import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'

const tool = tools.find(t => t.id === 'json-type-generator')
const HISTORY_KEY = 'json-type-generator-history'
const MAX_HISTORY = 20

// ===== Type Generation Logic =====

function jsonToTypeScript(obj, rootName, optional, exportIface, visited = new Set()) {
  const interfaces = []
  generateInterface(obj, rootName, optional, exportIface, interfaces, visited)
  return interfaces.join('\n\n')
}

function generateInterface(obj, name, optional, exportIface, interfaces, visited) {
  if (visited.has(obj)) return
  visited.add(obj)

  const prefix = exportIface ? 'export ' : ''
  const lines = [`${prefix}interface ${name} {`]

  for (const [key, value] of Object.entries(obj)) {
    const tsType = getTSType(value, key, name, optional, exportIface, interfaces, visited)
    const optMark = optional ? '?' : ''
    lines.push(`  ${key}${optMark}: ${tsType};`)
  }

  lines.push('}')
  interfaces.push(lines.join('\n'))
}

function getTSType(value, key, parentName, optional, exportIface, interfaces, visited) {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]'
    const first = value[0]
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      const itemName = singularize(key)
      generateInterface(first, itemName, optional, exportIface, interfaces, visited)
      return `${itemName}[]`
    }
    if (Array.isArray(first)) {
      return `${getTSType(first, key, parentName, optional, exportIface, interfaces, visited)}[]`
    }
    return `${getTSType(first, key, parentName, optional, exportIface, interfaces, visited)}[]`
  }
  if (typeof value === 'object') {
    const subName = capitalize(key)
    generateInterface(value, subName, optional, exportIface, interfaces, visited)
    return subName
  }
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'any'
}

function jsonToJavaScript(obj, rootName, optional, exportIface) {
  const ts = jsonToTypeScript(obj, rootName, optional, exportIface)
  return '/** @typedef {' + rootName + '} ' + rootName + ' */\n' + ts.replace(/export /g, '').replace(/interface/g, '/** @type */\n// interface')
}

function jsonToPython(obj, rootName, optional) {
  const classes = []
  generatePythonClass(obj, rootName, optional, classes, new Set())
  return classes.join('\n\n')
}

function generatePythonClass(obj, name, optional, classes, visited) {
  if (visited.has(obj)) return
  visited.add(obj)

  const lines = [`@dataclass`, `class ${name}:`]
  const fields = Object.entries(obj)

  if (fields.length === 0) {
    lines.push('    pass')
  } else {
    for (const [key, value] of fields) {
      const pyType = getPyType(value, key, optional, classes, visited)
      const fieldName = key.replace(/[^a-zA-Z0-9_]/g, '_')
      if (optional) {
        lines.push(`    ${fieldName}: Optional[${pyType}] = None`)
      } else {
        lines.push(`    ${fieldName}: ${pyType}`)
      }
    }
  }

  classes.push('from dataclasses import dataclass\nfrom typing import Optional, List, Any\n\n' + lines.join('\n'))
}

function getPyType(value, key, optional, classes, visited) {
  if (value === null || value === undefined) return 'Any'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List[Any]'
    const first = value[0]
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      const itemName = singularize(key).replace(/^./, c => c.toUpperCase())
      generatePythonClass(first, itemName, optional, classes, visited)
      return `List[${itemName}]`
    }
    return `List[${getPyType(first, key, optional, classes, visited)}]`
  }
  if (typeof value === 'object') {
    const subName = capitalize(key)
    generatePythonClass(value, subName, optional, classes, visited)
    return subName
  }
  if (typeof value === 'string') return 'str'
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float'
  if (typeof value === 'boolean') return 'bool'
  return 'Any'
}

function jsonToJava(obj, rootName, optional) {
  const classes = []
  generateJavaClass(obj, rootName, optional, classes, new Set())
  return classes.join('\n\n')
}

function generateJavaClass(obj, name, optional, classes, visited) {
  if (visited.has(obj)) return
  visited.add(obj)

  const lines = [`public class ${name} {`]
  const fields = Object.entries(obj)

  for (const [key, value] of fields) {
    const javaType = getJavaType(value, key, optional, classes, visited)
    const fieldName = key.replace(/[^a-zA-Z0-9_]/g, '_')
    lines.push(`    private ${javaType} ${fieldName};`)
  }

  lines.push('}')
  classes.push(lines.join('\n'))
}

function getJavaType(value, key, optional, classes, visited) {
  if (value === null || value === undefined) return 'Object'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>'
    const first = value[0]
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      const itemName = singularize(key).replace(/^./, c => c.toUpperCase())
      generateJavaClass(first, itemName, optional, classes, visited)
      return `List<${itemName}>`
    }
    return `List<${getJavaType(first, key, optional, classes, visited)}>`
  }
  if (typeof value === 'object') {
    const subName = capitalize(key)
    generateJavaClass(value, subName, optional, classes, visited)
    return subName
  }
  if (typeof value === 'string') return 'String'
  if (typeof value === 'number') return Number.isInteger(value) ? 'Integer' : 'Double'
  if (typeof value === 'boolean') return 'Boolean'
  return 'Object'
}

function jsonToGo(obj, rootName, optional) {
  const structs = []
  generateGoStruct(obj, rootName, optional, structs, new Set())
  return structs.join('\n\n')
}

function generateGoStruct(obj, name, optional, structs, visited) {
  if (visited.has(obj)) return
  visited.add(obj)

  const lines = [`type ${name} struct {`]
  const fields = Object.entries(obj)

  for (const [key, value] of fields) {
    const goType = getGoType(value, key, optional, structs, visited)
    const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/ /g, '')
    lines.push(`    ${fieldName} ${goType} \`json:"${key}"\``)
  }

  lines.push('}')
  structs.push(lines.join('\n'))
}

function getGoType(value, key, optional, structs, visited) {
  if (value === null || value === undefined) return 'interface{}'
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}'
    const first = value[0]
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      const itemName = singularize(key).replace(/^./, c => c.toUpperCase())
      generateGoStruct(first, itemName, optional, structs, visited)
      return `[]${itemName}`
    }
    return `[]${getGoType(first, key, optional, structs, visited)}`
  }
  if (typeof value === 'object') {
    const subName = capitalize(key)
    generateGoStruct(value, subName, optional, structs, visited)
    return subName
  }
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64'
  if (typeof value === 'boolean') return 'bool'
  return 'interface{}'
}

function jsonToCSharp(obj, rootName, optional) {
  const classes = []
  generateCSharpClass(obj, rootName, optional, classes, new Set())
  return classes.join('\n\n')
}

function generateCSharpClass(obj, name, optional, classes, visited) {
  if (visited.has(obj)) return
  visited.add(obj)

  const lines = [`public class ${name}`, '{']
  const fields = Object.entries(obj)

  for (const [key, value] of fields) {
    const csType = getCSharpType(value, key, optional, classes, visited)
    const fieldName = key.replace(/[^a-zA-Z0-9_]/g, '_')
    const optMark = optional && csType !== 'string' && !csType.startsWith('List') ? '?' : ''
    lines.push(`    public ${csType}${optMark} ${fieldName} { get; set; }`)
  }

  lines.push('}')
  classes.push('using System.Collections.Generic;\n\n' + lines.join('\n'))
}

function getCSharpType(value, key, optional, classes, visited) {
  if (value === null || value === undefined) return 'object'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<object>'
    const first = value[0]
    if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
      const itemName = singularize(key).replace(/^./, c => c.toUpperCase())
      generateCSharpClass(first, itemName, optional, classes, visited)
      return `List<${itemName}>`
    }
    return `List<${getCSharpType(first, key, optional, classes, visited)}>`
  }
  if (typeof value === 'object') {
    const subName = capitalize(key)
    generateCSharpClass(value, subName, optional, classes, visited)
    return subName
  }
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double'
  if (typeof value === 'boolean') return 'bool'
  return 'object'
}

function capitalize(s) {
  return s.replace(/(^|_)(\w)/g, (_, _sep, c) => c.toUpperCase())
}

function singularize(s) {
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y'
  if (s.endsWith('ses') || s.endsWith('xes') || s.endsWith('zes')) return s.slice(0, -2)
  if (s.endsWith('s') && !s.endsWith('ss')) return s.slice(0, -1)
  return s
}

function generateTypes(json, lang, rootName, optional, exportIface) {
  const obj = typeof json === 'string' ? JSON.parse(json) : json
  switch (lang) {
    case 'typescript': return jsonToTypeScript(obj, rootName, optional, exportIface)
    case 'javascript': return jsonToJavaScript(obj, rootName, optional, exportIface)
    case 'python': return jsonToPython(obj, rootName, optional)
    case 'java': return jsonToJava(obj, rootName, optional)
    case 'go': return jsonToGo(obj, rootName, optional)
    case 'csharp': return jsonToCSharp(obj, rootName, optional)
    default: return jsonToTypeScript(obj, rootName, optional, exportIface)
  }
}

function getFileExtension(lang) {
  switch (lang) {
    case 'typescript': return '.ts'
    case 'javascript': return '.js'
    case 'python': return '.py'
    case 'java': return '.java'
    case 'go': return '.go'
    case 'csharp': return '.cs'
    default: return '.ts'
  }
}

function getOutputLanguage(lang) {
  switch (lang) {
    case 'typescript': return 'typescript'
    case 'javascript': return 'javascript'
    case 'python': return 'plaintext'
    case 'java': return 'plaintext'
    case 'go': return 'plaintext'
    case 'csharp': return 'plaintext'
    default: return 'typescript'
  }
}

// ===== Component =====

export default function JsonTypeGenerator() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState('typescript')
  const [rootName, setRootName] = useState('Root')
  const [optional, setOptional] = useState(false)
  const [exportIface, setExportIface] = useState(true)
  const [error, setError] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
  }, [])

  const handleGenerate = useCallback(() => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }
    try {
      const result = generateTypes(input, lang, rootName, optional, exportIface)
      setOutput(result)
      setError('')
      setHistory(prev => {
        const entry = { input: input.trim(), lang, rootName, optional, exportIface, time: Date.now() }
        const next = [entry, ...prev.filter(h => h.input !== entry.input)].slice(0, MAX_HISTORY)
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch {}
        return next
      })
    } catch (e) {
      setError(t('jtgInvalidJson'))
      setOutput('')
    }
  }, [input, lang, rootName, optional, exportIface, t])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
    setRootName('Root')
    setOptional(false)
    setExportIface(true)
  }

  const downloadFile = () => {
    if (!output) return
    const ext = getFileExtension(lang)
    const blob = new Blob([output], { type: 'text/plain' })
    const link = document.createElement('a')
    link.download = `${rootName.toLowerCase().replace(/\s+/g, '-')}${ext}`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const clearHistory = () => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
  }

  const loadFromHistory = (entry) => {
    setInput(entry.input)
    setLang(entry.lang)
    setRootName(entry.rootName)
    setOptional(entry.optional)
    setExportIface(entry.exportIface)
  }

  const langOptions = [
    { key: 'typescript', label: 'TypeScript' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'python', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'go', label: 'Go' },
    { key: 'csharp', label: 'C#' },
  ]

  const status = error ? 'invalid' : output ? 'valid' : 'idle'
  const statusText = error ? 'Invalid' : output ? 'Valid' : 'Ready'

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <SEO title={tool.seoTitle} description={tool.seoDescription} />
      <div className="workspace-header">
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">{t('tools.jsonTypeGenerator')}</span>
          <span className="workspace-desc">{t('toolDesc.jsonTypeGenerator')}</span>
          <span className={`workspace-status ${status}`}>{statusText}</span>
        </div>
        <Toolbar
          copyText={output}
          onClear={handleClear}
          onFullscreen={() => setFullscreen(!fullscreen)}
          isFullscreen={fullscreen}
        />
      </div>

      <div className="workspace-body">
        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">{t('jtgInputJson')}</span>
          </div>
          <div className="panel-body">
            <CodeEditor
              value={input}
              language="json"
              onChange={setInput}
              placeholder='{"name": "Tom", "age": 20}'
            />
          </div>
        </div>

        <div className="workspace-panel">
          <div className="panel-header">
            <span className="panel-label">{t('settings')}</span>
          </div>
          <div className="panel-body">
            <div className="jtg-options">
              <div className="jtg-option-row">
                <label>{t('jtgLanguage')}</label>
                <select className="jtg-select" value={lang} onChange={e => setLang(e.target.value)}>
                  {langOptions.map(opt => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="jtg-option-row">
                <label>{t('jtgRootName')}</label>
                <input
                  type="text"
                  className="jtg-input"
                  value={rootName}
                  onChange={e => setRootName(e.target.value || 'Root')}
                />
              </div>
              <label className="jtg-check">
                <input type="checkbox" checked={optional} onChange={e => setOptional(e.target.checked)} />
                {t('jtgOptionalFields')}
              </label>
              <label className="jtg-check">
                <input type="checkbox" checked={exportIface} onChange={e => setExportIface(e.target.checked)} />
                {t('jtgExportInterface')}
              </label>
              <button className="btn" onClick={handleGenerate}>{t('generate')}</button>
              {output && (
                <button className="btn btn-secondary" onClick={downloadFile}>
                  {t('jtgDownloadFile')} {getFileExtension(lang)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-body">
        <div className="workspace-panel" style={{ flex: 2 }}>
          <div className="panel-header">
            <span className="panel-label">{t('jtgOutput')}</span>
          </div>
          <div className="panel-body">
            {error ? (
              <div className="error-detail">
                <div className="error-detail-header">
                  <span className="error-detail-icon">✕</span>
                  <span>{t('jtgInvalidJson')}</span>
                </div>
                <div className="error-detail-section">
                  <div className="error-detail-text">{error}</div>
                </div>
              </div>
            ) : (
              <CodeEditor
                value={output}
                language={getOutputLanguage(lang)}
                readOnly
                placeholder={t('jtgNoOutput')}
              />
            )}
          </div>
        </div>

        <div className="workspace-panel" style={{ flex: 1 }}>
          <div className="panel-header">
            <span className="panel-label">{t('jtgHistory')}</span>
            {history.length > 0 && (
              <button className="btn btn-sm btn-secondary" onClick={clearHistory}>{t('jtgClearHistory')}</button>
            )}
          </div>
          <div className="panel-body">
            {history.length === 0 ? (
              <div className="editor-output-placeholder">{t('jtgHistoryEmpty')}</div>
            ) : (
              <div className="jtg-history-list">
                {history.map((entry, i) => (
                  <div key={i} className="jtg-history-item" onClick={() => loadFromHistory(entry)}>
                    <span className="jtg-history-lang">{entry.lang.toUpperCase()}</span>
                    <span className="jtg-history-value">{entry.input.length > 60 ? entry.input.slice(0, 60) + '...' : entry.input}</span>
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
        <Breadcrumb toolId="json-type-generator" />
        <ToolGuide toolId="json-type-generator" />
        <RelatedTools toolId="json-type-generator" />
      </>
    )}
    </>
  )
}
