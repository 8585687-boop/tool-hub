import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { tools, categories } from '../data/tools'
import SEO from '../components/SEO'

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

const CATEGORY_KEY_MAP = {
  "JSON Tools": "catJsonTools",
  "Encoding Tools": "catEncodingTools",
  "Security Tools": "catSecurityTools",
  "Text Tools": "catTextTools",
  "Developer Tools": "catDeveloperTools",
  "Format Tools": "catFormatTools",
  "Converter Tools": "catConverterTools",
}

export default function Home() {
  const [search, setSearch] = useState('')
  const { t } = useTranslation()

  const filtered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }, [search])

  const popularTools = tools.filter(t => t.popular)

  return (
    <div className="home">
      <SEO title="ToolHub - 50+ Free Online Developer Tools & Utilities" description="ToolHub provides 50+ free online developer tools including JSON formatter, JSON validator, Base64 encoder, Base64 decoder, JWT decoder, URL tools, text tools, data converters and more. Fast, secure and browser-based." />

      <div className="home-hero">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroDesc')}</p>
        <div className="home-search">
          <span className="home-search-icon">⌕</span>
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered ? (
        <div className="home-section">
          <div className="home-section-title">{t('resultCount', { count: filtered.length })}</div>
          <div className="tool-grid">
            {filtered.map(tool => (
              <Link key={tool.id} to={tool.path} className="tool-card">
                <div className="tool-card-top">
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-category">{t(CATEGORY_KEY_MAP[tool.category] || tool.category)}</span>
                </div>
                <h2>{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</h2>
                <p>{t(`toolDesc.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</p>
                <span className="tool-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="home-section">
            <div className="home-section-title">{t('popularTools')}</div>
            <div className="tool-grid">
              {popularTools.map(tool => (
                <Link key={tool.id} to={tool.path} className="tool-card">
                  <div className="tool-card-top">
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-category">{t(CATEGORY_KEY_MAP[tool.category] || tool.category)}</span>
                  </div>
                  <h2>{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</h2>
                  <p>{t(`toolDesc.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</p>
                  <span className="tool-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="home-section">
            <div className="home-section-title">{t('categories')}</div>
            <div className="category-grid">
              {categories.map(cat => (
                <div key={cat.name} className="category-card">
                  <div className="category-name">{t(CATEGORY_KEY_MAP[cat.name] || cat.name)}</div>
                  <div className="category-count">{t('toolCount', { count: cat.tools.length })}</div>
                  <div className="category-tools">
                    {cat.tools.slice(0, 3).map(tool => (
                      <Link key={tool.id} to={tool.path} className="category-tool-link">{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
