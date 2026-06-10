import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import JsonFormatter from './pages/tools/JsonFormatter'
import JsonValidator from './pages/tools/JsonValidator'
import JsonMinifier from './pages/tools/JsonMinifier'
import JsonBeautifier from './pages/tools/JsonBeautifier'
import Base64Encoder from './pages/tools/Base64Encoder'
import Base64Decoder from './pages/tools/Base64Decoder'
import UrlEncoder from './pages/tools/UrlEncoder'
import UrlDecoder from './pages/tools/UrlDecoder'
import JwtDecoder from './pages/tools/JwtDecoder'
import PasswordGenerator from './pages/tools/PasswordGenerator'
import UuidGenerator from './pages/tools/UuidGenerator'
import HashGenerator from './pages/tools/HashGenerator'
import WordCounter from './pages/tools/WordCounter'
import CharacterCounter from './pages/tools/CharacterCounter'
import CaseConverter from './pages/tools/CaseConverter'
import TextDiffChecker from './pages/tools/TextDiffChecker'
import LoremGenerator from './pages/tools/LoremGenerator'
import TimestampConverter from './pages/tools/TimestampConverter'
import RegexTester from './pages/tools/RegexTester'
import YamlFormatter from './pages/tools/YamlFormatter'
import XmlFormatter from './pages/tools/XmlFormatter'
import MarkdownPreviewer from './pages/tools/MarkdownPreviewer'
import ColorConverter from './pages/tools/ColorConverter'
import CsvToJson from './pages/tools/CsvToJson'
import NumberBaseConverter from './pages/tools/NumberBaseConverter'
import Crc32Calculator from './pages/tools/Crc32Calculator'
import About from './pages/About'
import Privacy from './pages/Privacy'

function App() {
  return (
    <BrowserRouter>
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
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
