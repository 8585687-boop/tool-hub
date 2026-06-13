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

export default function ToolGuide({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  const { t } = useTranslation()
  if (!tool) return null

  const toolKey = TOOL_KEY_MAP[tool.id] || tool.id
  const toolName = t(`tools.${toolKey}`)

  // Try i18n content first, fall back to tools.js data
  const i18nIntro = t(`toolContent.${toolKey}.intro`, { defaultValue: '' })
  const i18nSteps = t(`toolContent.${toolKey}.steps`, { returnObjects: true })
  const i18nFeatures = t(`toolContent.${toolKey}.features`, { returnObjects: true })
  const i18nExample = t(`toolContent.${toolKey}.example`, { returnObjects: true })
  const i18nFaq = t(`toolContent.${toolKey}.faq`, { returnObjects: true })

  const intro = i18nIntro || tool.intro
  const steps = Array.isArray(i18nSteps) ? i18nSteps : tool.steps
  const features = Array.isArray(i18nFeatures) ? i18nFeatures : tool.features
  const example = (i18nExample && typeof i18nExample === 'object' && !Array.isArray(i18nExample) && i18nExample.input) ? i18nExample : tool.example
  const faq = Array.isArray(i18nFaq) ? i18nFaq : tool.faq

  if (!intro && !steps?.length && !features?.length && !example && !faq?.length) return null

  return (
    <div className="tool-guide">
      {intro && (
        <div className="guide-card">
          <div className="guide-card-title">{t('aboutTool', { name: toolName })}</div>
          <div className="guide-card-text">{intro}</div>
        </div>
      )}

      {steps?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">{t('howToUse')}</div>
          <ol className="guide-steps">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {features?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">{t('features')}</div>
          <ul className="guide-features">
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {example && (
        <div className="guide-card">
          <div className="guide-card-title">{t('example')}</div>
          <div className="guide-example">
            {example.input && (
              <div className="guide-example-block">
                <div className="guide-example-label">{t('input')}</div>
                <pre className="guide-example-code">{example.input}</pre>
              </div>
            )}
            {example.output && (
              <div className="guide-example-block">
                <div className="guide-example-label">{t('output')}</div>
                <pre className="guide-example-code">{example.output}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {faq?.length > 0 && (
        <div className="guide-card">
          <div className="guide-card-title">{t('faq')}</div>
          <div className="guide-faq">
            {faq.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question">{item.question}</div>
                <div className="faq-answer">{item.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
