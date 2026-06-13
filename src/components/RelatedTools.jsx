import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { tools } from '../data/tools'

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

export default function RelatedTools({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  const { t } = useTranslation()
  if (!tool) return null

  const related = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="related-tools">
      <div className="related-tools-title">{t('relatedTools')}</div>
      <div className="related-tools-grid">
        {related.map(tool => (
          <Link key={tool.id} to={tool.path} className="related-tool-card">
            <span className="related-tool-icon">{tool.icon}</span>
            <div className="related-tool-info">
              <div className="related-tool-name">{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</div>
              <div className="related-tool-desc">{t(`toolDesc.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
