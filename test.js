/**
 * Plain JavaScript test runner for all core tool functions.
 * Usage: node test.js
 * No test framework required.
 */

let passed = 0
let failed = 0
const failures = []

function assert(condition, toolName, message) {
  if (condition) {
    passed++
    console.log(`[PASS] ${toolName} — ${message}`)
  } else {
    failed++
    failures.push({ tool: toolName, message })
    console.log(`[FAIL] ${toolName} — ${message}`)
  }
}

function assertEqual(actual, expected, toolName, message) {
  if (actual === expected) {
    passed++
    console.log(`[PASS] ${toolName} — ${message}`)
  } else {
    failed++
    failures.push({ tool: toolName, message: `${message} (expected: ${expected}, got: ${actual})` })
    console.log(`[FAIL] ${toolName} — ${message} (expected: ${expected}, got: ${actual})`)
  }
}

async function runTests() {
  console.log('=== ToolHub Test Suite ===\n')

  // ==================== JSON ====================
  console.log('\n--- JSON ---')

  const { formatJson, minifyJson } = await import('./src/tools/json/formatter.js')
  const { beautifyJSON } = await import('./src/tools/json/beautifier.js')
  const { minifyJSON } = await import('./src/tools/json/minifier.js')
  const { validateJson } = await import('./src/tools/json/validator.js')

  // Formatter
  let r = formatJson('{"name":"Tom"}')
  assertEqual(r, '{\n  "name": "Tom"\n}', 'JSON Formatter', 'formatJson basic')

  r = minifyJson('{"name": "Tom"}')
  assertEqual(r, '{"name":"Tom"}', 'JSON Formatter', 'minifyJson basic')

  // Beautifier
  r = beautifyJSON('{"a":1}')
  assert(r.success === true, 'JSON Beautifier', 'beautifyJSON success')
  assert(r.result.includes('"a"'), 'JSON Beautifier', 'beautifyJSON contains key')

  r = beautifyJSON('{invalid}')
  assert(r.success === false, 'JSON Beautifier', 'beautifyJSON invalid returns error')

  // Minifier
  r = minifyJSON('{"a": 1}')
  assert(r.success === true, 'JSON Minifier', 'minifyJSON success')
  assertEqual(r.result, '{"a":1}', 'JSON Minifier', 'minifyJSON result')

  r = minifyJSON('{invalid}')
  assert(r.success === false, 'JSON Minifier', 'minifyJSON invalid returns error')

  // Validator
  r = validateJson('{"valid":true}')
  assert(r.success === true, 'JSON Validator', 'validateJson valid')

  r = validateJson('{invalid}')
  assert(r.success === false, 'JSON Validator', 'validateJson invalid')

  // ==================== Base64 ====================
  console.log('\n--- Base64 ---')

  const { encodeBase64 } = await import('./src/tools/encoding/base64Encoder.js')
  const { decodeBase64 } = await import('./src/tools/encoding/base64Decoder.js')

  // Encode
  r = encodeBase64('Hello World')
  assert(r.success === true, 'Base64 Encoder', 'encode success')
  assertEqual(r.result, 'SGVsbG8gV29ybGQ=', 'Base64 Encoder', 'encode "Hello World"')

  // Chinese text
  r = encodeBase64('你好')
  assert(r.success === true, 'Base64 Encoder', 'encode Chinese success')
  assert(r.result.length > 0, 'Base64 Encoder', 'encode Chinese non-empty')

  // Decode
  r = decodeBase64('SGVsbG8gV29ybGQ=')
  assert(r.success === true, 'Base64 Decoder', 'decode success')
  assertEqual(r.result, 'Hello World', 'Base64 Decoder', 'decode "Hello World"')

  // Round-trip Chinese
  r = encodeBase64('你好世界')
  const r2 = decodeBase64(r.result)
  assert(r2.success === true, 'Base64 Round-trip', 'Chinese round-trip success')
  assertEqual(r2.result, '你好世界', 'Base64 Round-trip', 'Chinese round-trip match')

  // Invalid
  r = decodeBase64('!!!invalid!!!')
  assert(r.success === false, 'Base64 Decoder', 'invalid input returns error')

  // ==================== Security ====================
  console.log('\n--- Security ---')

  const { decodeJWT } = await import('./src/tools/security/jwtDecoder.js')
  const { generateUUID } = await import('./src/tools/security/uuidGenerator.js')
  const { generatePassword, getPasswordStrength } = await import('./src/tools/security/passwordGenerator.js')
  const { generateHash } = await import('./src/tools/security/hashGenerator.js')

  // JWT
  r = decodeJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  assert(r.success === true, 'JWT Decoder', 'valid JWT success')
  assert(r.result.header.alg === 'HS256', 'JWT Decoder', 'header decoded')
  assert(r.result.payload.name === 'John Doe', 'JWT Decoder', 'payload decoded')

  r = decodeJWT('invalid.jwt')
  assert(r.success === false, 'JWT Decoder', 'invalid JWT returns error')

  r = decodeJWT('')
  assert(r.success === false, 'JWT Decoder', 'empty JWT returns error')

  // UUID
  r = generateUUID()
  assert(r.success === true, 'UUID Generator', 'generate success')
  assert(r.result.length === 36, 'UUID Generator', 'UUID length is 36')
  assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(r.result), 'UUID Generator', 'UUID v4 format')

  // Password
  r = generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true })
  assert(r.success === true, 'Password Generator', 'generate success')
  assertEqual(r.result.length, 16, 'Password Generator', 'password length')

  r = generatePassword({ length: 8, uppercase: false, lowercase: false, numbers: false, symbols: false })
  assert(r.success === false, 'Password Generator', 'no char types returns error')

  const strength = getPasswordStrength('Short1!')
  assert(strength.label === 'Weak' || strength.label === 'Medium' || strength.label === 'Strong', 'Password Strength', 'returns valid label')

  // Hash (async)
  r = await generateHash('hello', 'SHA-256')
  assert(r.success === true, 'Hash Generator', 'SHA-256 success')
  assertEqual(r.result, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', 'Hash Generator', 'SHA-256 "hello"')

  r = await generateHash('hello', 'SHA-512')
  assert(r.success === true, 'Hash Generator', 'SHA-512 success')
  assert(r.result.length === 128, 'Hash Generator', 'SHA-512 length')

  // ==================== Text ====================
  console.log('\n--- Text ---')

  const { countWords } = await import('./src/tools/text/wordCounter.js')
  const { countCharacters } = await import('./src/tools/text/characterCounter.js')
  const { convertCase } = await import('./src/tools/text/caseConverter.js')
  const { computeDiff } = await import('./src/tools/text/diffUtils.js')

  // Word Counter
  r = countWords('Hello world this is a test')
  assertEqual(r.words, 6, 'Word Counter', 'count words')

  r = countWords('')
  assertEqual(r.words, 0, 'Word Counter', 'empty string')

  // Character Counter
  r = countCharacters('Hello World')
  assertEqual(r.total, 11, 'Character Counter', 'total chars')
  assertEqual(r.withoutSpaces, 10, 'Character Counter', 'without spaces')

  // Case Converter
  r = convertCase('hello world', 'uppercase')
  assert(r.success === true, 'Case Converter', 'uppercase success')
  assertEqual(r.result, 'HELLO WORLD', 'Case Converter', 'uppercase result')

  r = convertCase('HELLO WORLD', 'lowercase')
  assertEqual(r.result, 'hello world', 'Case Converter', 'lowercase result')

  r = convertCase('hello world', 'title')
  assertEqual(r.result, 'Hello World', 'Case Converter', 'title result')

  // Diff Checker
  r = computeDiff('line1\nline2', 'line1\nline3')
  assert(r.changed === true, 'Diff Checker', 'detects change')
  assert(r.removed === 1, 'Diff Checker', 'removed count')
  assert(r.added === 1, 'Diff Checker', 'added count')

  r = computeDiff('same', 'same')
  assert(r.changed === false, 'Diff Checker', 'identical texts')

  // ==================== Developer ====================
  console.log('\n--- Developer ---')

  const { convertBase } = await import('./src/tools/number/baseConverter.js')
  const { calcCRC32 } = await import('./src/tools/crc/crc32.js')

  // Number Base Converter
  r = convertBase('1010', 2, 10)
  assert(r.success === true, 'Number Base', 'binary to decimal success')
  assertEqual(r.result, '10', 'Number Base', 'binary 1010 = decimal 10')

  r = convertBase('255', 10, 16)
  assert(r.success === true, 'Number Base', 'decimal to hex success')
  assertEqual(r.result, 'FF', 'Number Base', 'decimal 255 = hex FF')

  r = convertBase('FF', 16, 10)
  assertEqual(r.result, '255', 'Number Base', 'hex FF = decimal 255')

  r = convertBase('', 10, 2)
  assert(r.success === false, 'Number Base', 'empty input returns error')

  // CRC32
  r = calcCRC32('', 'CRC-32')
  assert(r.success === true, 'CRC32 Calculator', 'empty string success')
  assertEqual(r.result, '0x00000000', 'CRC32 Calculator', 'empty string = 0x00000000')

  r = calcCRC32('123456789', 'CRC-32')
  assert(r.success === true, 'CRC32 Calculator', 'CRC-32 success')
  assertEqual(r.result, '0xCBF43926', 'CRC32 Calculator', '"123456789" = 0xCBF43926')

  r = calcCRC32('123456789', 'CRC-32C')
  assertEqual(r.result, '0xE3069283', 'CRC32 Calculator', 'CRC-32C "123456789" = 0xE3069283')

  r = calcCRC32('123456789', 'CRC-32/BZIP2')
  assertEqual(r.result, '0xFC891918', 'CRC32 Calculator', 'CRC-32/BZIP2 "123456789" = 0xFC891918')

  r = calcCRC32('123456789', 'CRC-32/JAMCRC')
  assertEqual(r.result, '0x340BC6D9', 'CRC32 Calculator', 'CRC-32/JAMCRC "123456789" = 0x340BC6D9')

  // ==================== URL ====================
  console.log('\n--- URL ---')

  const { encodeUrl } = await import('./src/tools/url/urlEncoder.js')
  const { decodeUrl } = await import('./src/tools/url/urlDecoder.js')

  r = encodeUrl('hello world')
  assert(r.success === true, 'URL Encoder', 'encode success')
  assertEqual(r.result, 'hello%20world', 'URL Encoder', 'encode "hello world"')

  r = decodeUrl('hello%20world')
  assert(r.success === true, 'URL Decoder', 'decode success')
  assertEqual(r.result, 'hello world', 'URL Decoder', 'decode "hello%20world"')

  // ==================== Utils ====================
  console.log('\n--- Utils ---')

  const { safeExecute, parseInteger, charToDigit, detectBasePrefix, formatBigInt, parseCsvLine } = await import('./src/tools/utils/inputUtils.js')

  // safeExecute
  r = safeExecute(() => 42)
  assert(r.success === true, 'safeExecute', 'success case')
  assertEqual(r.result, 42, 'safeExecute', 'returns result')

  r = safeExecute(() => { throw new Error('boom') })
  assert(r.success === false, 'safeExecute', 'error case')
  assertEqual(r.error, 'boom', 'safeExecute', 'returns error message')

  // parseInteger
  r = parseInteger('255', 10)
  assert(r.success === true, 'parseInteger', 'decimal success')
  assert(r.value === BigInt(255), 'parseInteger', 'decimal value')

  r = parseInteger('FF', 16)
  assert(r.success === true, 'parseInteger', 'hex success')
  assert(r.value === BigInt(255), 'parseInteger', 'hex value')

  r = parseInteger('', 10)
  assert(r.success === false, 'parseInteger', 'empty returns error')

  // charToDigit
  assertEqual(charToDigit('A', 16), 10, 'charToDigit', 'A in base 16')
  assertEqual(charToDigit('f', 16), 15, 'charToDigit', 'f in base 16 (lowercase)')
  assertEqual(charToDigit('G', 16), -1, 'charToDigit', 'G invalid in base 16')

  // detectBasePrefix
  const p1 = detectBasePrefix('0xFF')
  assert(p1 && p1.base === 16, 'detectBasePrefix', '0x prefix')
  const p2 = detectBasePrefix('0b1010')
  assert(p2 && p2.base === 2, 'detectBasePrefix', '0b prefix')
  const p3 = detectBasePrefix('255')
  assert(p3 === null, 'detectBasePrefix', 'no prefix returns null')

  // formatBigInt
  assertEqual(formatBigInt(BigInt(255), 16), 'FF', 'formatBigInt', '255 = FF')
  assertEqual(formatBigInt(BigInt(0), 10), '0', 'formatBigInt', 'zero')

  // parseCsvLine
  const csv = parseCsvLine('a,b,c', ',')
  assertEqual(csv.length, 3, 'parseCsvLine', '3 fields')
  assertEqual(csv[0], 'a', 'parseCsvLine', 'first field')

  const csvQuoted = parseCsvLine('"a,b",c', ',')
  assertEqual(csvQuoted.length, 2, 'parseCsvLine', 'quoted field count')
  assertEqual(csvQuoted[0], 'a,b', 'parseCsvLine', 'quoted field value')

  // ==================== Summary ====================
  console.log('\n' + '='.repeat(40))
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`)
  console.log('='.repeat(40))

  if (failures.length > 0) {
    console.log('\nFailures:')
    failures.forEach(f => console.log(`  [FAIL] ${f.tool} — ${f.message}`))
    process.exit(1)
  }
}

runTests().catch(e => {
  console.error('Test runner error:', e)
  process.exit(1)
})
