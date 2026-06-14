import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Loading from './components/Loading'

/* ── Tool pages (lazy-loaded) ── */
const JsonFormatter        = lazy(() => import('./pages/tools/JsonFormatter'))
const JsonValidator        = lazy(() => import('./pages/tools/JsonValidator'))
const JsonMinifier         = lazy(() => import('./pages/tools/JsonMinifier'))
const JsonBeautifier       = lazy(() => import('./pages/tools/JsonBeautifier'))
const Base64Encoder        = lazy(() => import('./pages/tools/Base64Encoder'))
const Base64Decoder        = lazy(() => import('./pages/tools/Base64Decoder'))
const UrlEncoder           = lazy(() => import('./pages/tools/UrlEncoder'))
const UrlDecoder           = lazy(() => import('./pages/tools/UrlDecoder'))
const JwtDecoder           = lazy(() => import('./pages/tools/JwtDecoder'))
const PasswordGenerator    = lazy(() => import('./pages/tools/PasswordGenerator'))
const UuidGenerator        = lazy(() => import('./pages/tools/UuidGenerator'))
const HashGenerator        = lazy(() => import('./pages/tools/HashGenerator'))
const WordCounter          = lazy(() => import('./pages/tools/WordCounter'))
const CharacterCounter     = lazy(() => import('./pages/tools/CharacterCounter'))
const CaseConverter        = lazy(() => import('./pages/tools/CaseConverter'))
const TextDiffChecker      = lazy(() => import('./pages/tools/TextDiffChecker'))
const LoremGenerator       = lazy(() => import('./pages/tools/LoremGenerator'))
const TimestampConverter   = lazy(() => import('./pages/tools/TimestampConverter'))
const RegexTester          = lazy(() => import('./pages/tools/RegexTester'))
const YamlFormatter        = lazy(() => import('./pages/tools/YamlFormatter'))
const XmlFormatter         = lazy(() => import('./pages/tools/XmlFormatter'))
const MarkdownPreviewer    = lazy(() => import('./pages/tools/MarkdownPreviewer'))
const ColorConverter       = lazy(() => import('./pages/tools/ColorConverter'))
const CsvToJson            = lazy(() => import('./pages/tools/CsvToJson'))
const NumberBaseConverter  = lazy(() => import('./pages/tools/NumberBaseConverter'))
const Crc32Calculator      = lazy(() => import('./pages/tools/Crc32Calculator'))
const ExcelAnalyzer        = lazy(() => import('./pages/tools/ExcelAnalyzer'))
const ApiTester            = lazy(() => import('./pages/tools/ApiTester'))
const SqlFormatter         = lazy(() => import('./pages/tools/SqlFormatter'))
const JsonSchemaValidator  = lazy(() => import('./pages/tools/JsonSchemaValidator'))
const CronGenerator        = lazy(() => import('./pages/tools/CronGenerator'))
const JsonDiff             = lazy(() => import('./pages/tools/JsonDiff'))
const ImageCompressor      = lazy(() => import('./pages/tools/ImageCompressor'))
const QRGenerator          = lazy(() => import('./pages/tools/QRGenerator'))
const JsonTypeGenerator    = lazy(() => import('./pages/tools/JsonTypeGenerator'))

/* ── Static pages (lazy-loaded) ── */
const About  = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tools/json-formatter" element={<JsonFormatter />} />
            <Route path="tools/json-validator" element={<JsonValidator />} />
            <Route path="tools/json-minifier" element={<JsonMinifier />} />
            <Route path="tools/json-beautifier" element={<JsonBeautifier />} />
            <Route path="tools/base64-encoder" element={<Base64Encoder />} />
            <Route path="tools/base64-decoder" element={<Base64Decoder />} />
            <Route path="tools/url-encoder" element={<UrlEncoder />} />
            <Route path="tools/url-decoder" element={<UrlDecoder />} />
            <Route path="tools/jwt-decoder" element={<JwtDecoder />} />
            <Route path="tools/password-generator" element={<PasswordGenerator />} />
            <Route path="tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="tools/hash-generator" element={<HashGenerator />} />
            <Route path="tools/word-counter" element={<WordCounter />} />
            <Route path="tools/character-counter" element={<CharacterCounter />} />
            <Route path="tools/case-converter" element={<CaseConverter />} />
            <Route path="tools/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="tools/lorem-ipsum-generator" element={<LoremGenerator />} />
            <Route path="tools/timestamp-converter" element={<TimestampConverter />} />
            <Route path="tools/regex-tester" element={<RegexTester />} />
            <Route path="tools/yaml-formatter" element={<YamlFormatter />} />
            <Route path="tools/xml-formatter" element={<XmlFormatter />} />
            <Route path="tools/markdown-previewer" element={<MarkdownPreviewer />} />
            <Route path="tools/color-converter" element={<ColorConverter />} />
            <Route path="tools/csv-to-json" element={<CsvToJson />} />
            <Route path="tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="tools/crc32-calculator" element={<Crc32Calculator />} />
            <Route path="tools/excel-analyzer" element={<ExcelAnalyzer />} />
            <Route path="tools/api-tester" element={<ApiTester />} />
            <Route path="tools/sql-formatter" element={<SqlFormatter />} />
            <Route path="tools/json-schema-validator" element={<JsonSchemaValidator />} />
            <Route path="tools/cron-generator" element={<CronGenerator />} />
            <Route path="tools/json-diff" element={<JsonDiff />} />
            <Route path="tools/image-compressor" element={<ImageCompressor />} />
            <Route path="tools/qr-generator" element={<QRGenerator />} />
            <Route path="tools/json-type-generator" element={<JsonTypeGenerator />} />
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
