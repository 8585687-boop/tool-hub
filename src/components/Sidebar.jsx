import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { categories } from '../data/tools'

const CATEGORY_KEY_MAP = {
  "JSON Tools": "catJsonTools",
  "Encoding Tools": "catEncodingTools",
  "Security Tools": "catSecurityTools",
  "Text Tools": "catTextTools",
  "Developer Tools": "catDeveloperTools",
  "Format Tools": "catFormatTools",
  "Converter Tools": "catConverterTools",
}

const TOOL_KEY_MAP = {
  "json-formatter": "jsonFormatter",
  "json-validator": "jsonValidator",
  "json-minifier": "jsonMinifier",
  "json-beautifier": "jsonBeautifier",
  "base64-encoder": "base64Encoder",
  "base64-decoder": "base64Decoder",
  "url-encoder": "urlEncoder",
  "url-decoder": "urlDecoder",
  "jwt-decoder": "jwtDecoder",
  "password-generator": "passwordGenerator",
  "uuid-generator": "uuidGenerator",
  "hash-generator": "hashGenerator",
  "word-counter": "wordCounter",
  "character-counter": "characterCounter",
  "case-converter": "caseConverter",
  "text-diff-checker": "textDiffChecker",
  "lorem-ipsum-generator": "loremIpsumGenerator",
  "timestamp-converter": "timestampConverter",
  "regex-tester": "regexTester",
  "yaml-formatter": "yamlFormatter",
  "xml-formatter": "xmlFormatter",
  "markdown-previewer": "markdownPreviewer",
  "color-converter": "colorConverter",
  "csv-to-json": "csvToJson",
  "number-base-converter": "numberBaseConverter",
  "crc32-calculator": "crc32Calculator",
  "excel-analyzer": "excelAnalyzer",
  "api-tester": "apiTester",
  "sql-formatter": "sqlFormatter",
  "json-schema-validator": "jsonSchemaValidator",
  "cron-generator": "cronGenerator",
  "json-diff": "jsonDiff",
  "image-compressor": "imageCompressor",
}

export default function Sidebar() {
  const location = useLocation()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState({})

  const toggle = (name) => {
    setCollapsed(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside className="sidebar">
      <Link to="/" className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
        <span className="sidebar-icon">🏠</span>
        <span>{t('home')}</span>
      </Link>
      <div className="sidebar-divider" />
      {categories.map(cat => (
        <div key={cat.name} className="sidebar-group">
          <div className="sidebar-group-title" onClick={() => toggle(cat.name)}>
            <span>{t(CATEGORY_KEY_MAP[cat.name] || cat.name)}</span>
            <span className="sidebar-arrow">{collapsed[cat.name] ? '›' : '‹'}</span>
          </div>
          {!collapsed[cat.name] && cat.tools.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className={`sidebar-item ${location.pathname === tool.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{tool.icon}</span>
              <span>{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</span>
            </Link>
          ))}
        </div>
      ))}
    </aside>
  )
}
