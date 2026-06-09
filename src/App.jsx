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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="json-validator" element={<JsonValidator />} />
          <Route path="json-minifier" element={<JsonMinifier />} />
          <Route path="json-beautifier" element={<JsonBeautifier />} />
          <Route path="base64-encoder" element={<Base64Encoder />} />
          <Route path="base64-decoder" element={<Base64Decoder />} />
          <Route path="url-encoder" element={<UrlEncoder />} />
          <Route path="url-decoder" element={<UrlDecoder />} />
          <Route path="jwt-decoder" element={<JwtDecoder />} />
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="uuid-generator" element={<UuidGenerator />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="word-counter" element={<WordCounter />} />
          <Route path="character-counter" element={<CharacterCounter />} />
          <Route path="case-converter" element={<CaseConverter />} />
          <Route path="text-diff-checker" element={<TextDiffChecker />} />
          <Route path="lorem-ipsum-generator" element={<LoremGenerator />} />
          <Route path="timestamp-converter" element={<TimestampConverter />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="yaml-formatter" element={<YamlFormatter />} />
          <Route path="xml-formatter" element={<XmlFormatter />} />
          <Route path="markdown-previewer" element={<MarkdownPreviewer />} />
          <Route path="color-converter" element={<ColorConverter />} />
          <Route path="csv-to-json" element={<CsvToJson />} />
          <Route path="number-base-converter" element={<NumberBaseConverter />} />
          <Route path="crc32-calculator" element={<Crc32Calculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
