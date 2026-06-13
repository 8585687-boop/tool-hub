import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { tools } from '../data/tools'

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

export default function Breadcrumb({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  const { t } = useTranslation()
  if (!tool) return null

  return (
    <nav className="breadcrumb">
      <Link to="/">{t('breadcrumbHome')}</Link>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-category">{t(CATEGORY_KEY_MAP[tool.category] || tool.category)}</span>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-current">{t(`tools.${TOOL_KEY_MAP[tool.id] || tool.id}`)}</span>
    </nav>
  )
}
