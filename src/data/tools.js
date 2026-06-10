export const tools = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format JSON online",
    category: "JSON Tools",
    path: "/tools/json-formatter",
    icon: "{}",
    popular: true,
    seoTitle: "JSON Formatter - Free Online JSON Formatter Tool",
    seoDescription: "Format and beautify JSON online. Free JSON formatter with syntax highlighting and validation.",
    intro: "JSON Formatter helps developers format and beautify JSON data into a readable structure. Paste minified or messy JSON and get properly indented output instantly.",
    steps: ["Paste your JSON data into the input area", "The formatter processes your JSON automatically", "Copy the formatted result from the output area"],
    features: ["Instant formatting as you type", "Detailed error messages with line numbers", "No data sent to servers — all processing in browser"],
    example: { input: '{"name":"Tom","age":20}', output: '{\n  "name": "Tom",\n  "age": 20\n}' },
    faq: [
      { question: "Is this JSON formatter free?", answer: "Yes, it is completely free with no limits." },
      { question: "Is my data secure?", answer: "All processing happens locally in your browser. No data is sent to any server." },
      { question: "What JSON formats are supported?", answer: "Any valid JSON including objects, arrays, strings, numbers, booleans, and null." }
    ]
  },
  {
    id: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON",
    category: "JSON Tools",
    path: "/tools/json-validator",
    icon: "✓",
    popular: true,
    seoTitle: "JSON Validator - Validate JSON Online Free",
    seoDescription: "Check and validate JSON data online. Find syntax errors and invalid JSON format instantly.",
    intro: "JSON Validator checks your JSON data for syntax errors and reports exact error locations. Find missing brackets, trailing commas, and other common mistakes.",
    steps: ["Paste your JSON data into the input area", "The validator checks your JSON automatically", "Fix any errors highlighted in the output"],
    features: ["Real-time validation as you type", "Precise error location with line and column", "Suggestions for common JSON mistakes"],
    example: { input: '{"name":"Tom",}', output: "Invalid JSON: Trailing comma at line 1, column 15" },
    faq: [
      { question: "What does JSON validation check?", answer: "It checks for syntax errors like missing brackets, trailing commas, unquoted keys, and invalid values." },
      { question: "Does it support JSON5?", answer: "No, it validates standard JSON as defined by RFC 8259." }
    ]
  },
  {
    id: "json-minifier",
    name: "JSON Minifier",
    description: "Compress JSON and remove whitespace",
    category: "JSON Tools",
    path: "/tools/json-minifier",
    icon: "{}",
    popular: false,
    seoTitle: "JSON Minifier - Minify JSON Online Free",
    seoDescription: "Minify and compress JSON online. Remove whitespace and reduce JSON file size instantly.",
    intro: "JSON Minifier removes all unnecessary whitespace from your JSON data, reducing file size for faster transmission and lower bandwidth usage.",
    steps: ["Paste your JSON data into the input area", "The minifier compresses it automatically", "Copy the minified result"],
    features: ["Removes all whitespace and newlines", "Reduces JSON file size significantly", "Preserves data integrity while compressing"],
    example: { input: '{\n  "name": "Tom",\n  "age": 20\n}', output: '{"name":"Tom","age":20}' },
    faq: [
      { question: "How much size can I save?", answer: "Typically 20-40% reduction depending on the original formatting." },
      { question: "Is minified JSON still valid?", answer: "Yes, minified JSON is fully valid and can be parsed by any JSON parser." }
    ]
  },
  {
    id: "json-beautifier",
    name: "JSON Beautifier",
    description: "Beautify and format JSON online",
    category: "JSON Tools",
    path: "/tools/json-beautifier",
    icon: "{}",
    popular: false,
    seoTitle: "JSON Beautifier - Beautify JSON Online Free",
    seoDescription: "Beautify and format JSON with proper indentation. Make JSON readable and well-structured.",
    intro: "JSON Beautifier formats your JSON with 4-space indentation, making it easy to read and debug. Perfect for reviewing API responses and configuration files.",
    steps: ["Paste your JSON data into the input area", "The beautifier formats it with proper indentation", "Copy the beautified result"],
    features: ["4-space indentation for readability", "Validates JSON while beautifying", "Instant processing in your browser"],
    example: { input: '{"users":[{"name":"Tom","age":20},{"name":"Jane","age":25}]}', output: '{\n    "users": [\n        {\n            "name": "Tom",\n            "age": 20\n        },\n        {\n            "name": "Jane",\n            "age": 25\n        }\n    ]\n}' },
    faq: [
      { question: "What is the difference between formatter and beautifier?", answer: "The beautifier uses 4-space indentation while the formatter uses 2-space indentation." },
      { question: "Can I customize the indentation?", answer: "Currently 4-space indentation is used by default." }
    ]
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description: "Encode text to Base64 online",
    category: "Encoding Tools",
    path: "/tools/base64-encoder",
    icon: "B64",
    popular: true,
    seoTitle: "Base64 Encoder - Encode Text to Base64 Online",
    seoDescription: "Encode text and files to Base64 online for free. Convert strings and data to Base64 format instantly.",
    intro: "Base64 Encoder converts plain text into Base64 encoded format. Commonly used for encoding data in emails, URLs, and embedding images in HTML/CSS.",
    steps: ["Enter or paste the text you want to encode", "The encoded result appears instantly", "Copy the Base64 output"],
    features: ["Instant encoding as you type", "Supports all Unicode characters", "No server processing — runs in browser"],
    example: { input: "Hello World", output: "SGVsbG8gV29ybGQ=" },
    faq: [
      { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters." },
      { question: "Is Base64 encryption?", answer: "No, Base64 is encoding, not encryption. It does not provide security." }
    ]
  },
  {
    id: "base64-decoder",
    name: "Base64 Decoder",
    description: "Decode Base64 text online",
    category: "Encoding Tools",
    path: "/tools/base64-decoder",
    icon: "↙",
    popular: true,
    seoTitle: "Base64 Decoder - Decode Base64 Online",
    seoDescription: "Decode Base64 strings online for free. Convert Base64 encoded text back to normal text.",
    intro: "Base64 Decoder converts Base64 encoded strings back to their original text. Useful for decoding JWT tokens, email attachments, and embedded data.",
    steps: ["Paste your Base64 encoded string", "The decoded text appears instantly", "Copy the decoded result"],
    features: ["Instant decoding as you type", "Handles invalid Base64 gracefully", "Supports UTF-8 character decoding"],
    example: { input: "SGVsbG8gV29ybGQ=", output: "Hello World" },
    faq: [
      { question: "What happens if I enter invalid Base64?", answer: "The tool will show an error message indicating the input is not valid Base64." },
      { question: "Can I decode Base64 images?", answer: "This tool decodes Base64 to text. For images, use a dedicated Base64 image decoder." }
    ]
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    description: "Encode text to URL-safe format",
    category: "Encoding Tools",
    path: "/tools/url-encoder",
    icon: "%",
    popular: false,
    seoTitle: "URL Encoder - Encode URL Online Free",
    seoDescription: "Encode text to URL-safe format online. Convert special characters to percent-encoded format.",
    intro: "URL Encoder converts special characters in text to percent-encoded format, making it safe to include in URLs and query strings.",
    steps: ["Enter the text with special characters", "The URL-encoded result appears instantly", "Copy the encoded string"],
    features: ["Encodes reserved URI characters", "Real-time encoding", "Follows RFC 3986 standard"],
    example: { input: "hello world?name=Tom&age=20", output: "hello%20world%3Fname%3DTom%26age%3D20" },
    faq: [
      { question: "What characters get encoded?", answer: "Special characters like spaces, ?, &, =, #, and non-ASCII characters are percent-encoded." },
      { question: "What is percent encoding?", answer: "Percent encoding replaces unsafe characters with a % followed by two hexadecimal digits." }
    ]
  },
  {
    id: "url-decoder",
    name: "URL Decoder",
    description: "Decode URL-encoded text",
    category: "Encoding Tools",
    path: "/tools/url-decoder",
    icon: "🔗",
    popular: false,
    seoTitle: "URL Decoder - Decode URL Online Free",
    seoDescription: "Decode URL-encoded text online. Convert percent-encoded strings back to readable text.",
    intro: "URL Decoder converts percent-encoded strings back to their original readable text. Useful for debugging URLs and parsing query parameters.",
    steps: ["Paste the URL-encoded string", "The decoded text appears instantly", "Copy the decoded result"],
    features: ["Decodes all percent-encoded characters", "Real-time decoding", "Handles double-encoded strings"],
    example: { input: "hello%20world%3Fname%3DTom%26age%3D20", output: "hello world?name=Tom&age=20" },
    faq: [
      { question: "Can it decode double-encoded URLs?", answer: "Yes, but you may need to decode multiple times for double-encoded strings." },
      { question: "What is the difference between encode and decode?", answer: "Encoding converts special characters to %XX format, decoding converts them back." }
    ]
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JWT tokens",
    category: "Security Tools",
    path: "/tools/jwt-decoder",
    icon: "🔑",
    popular: true,
    seoTitle: "JWT Decoder - Decode JWT Token Online",
    seoDescription: "Decode and inspect JWT tokens online. View header, payload and token information.",
    intro: "JWT Decoder lets you inspect JSON Web Tokens by decoding the header and payload sections. View token claims, expiration, and issuer information instantly.",
    steps: ["Paste your JWT token into the input area", "The header and payload are decoded automatically", "Review the decoded token information"],
    features: ["Decodes header and payload sections", "Shows token expiration and issuer", "Highlights invalid token format"],
    example: { input: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9", output: 'Header: {"alg":"HS256"}\nPayload: {"sub":"1234567890","name":"John","iat":1516239022}' },
    faq: [
      { question: "Does this tool verify JWT signatures?", answer: "No, this tool only decodes the token. Signature verification requires the secret key." },
      { question: "Is my token secure when using this tool?", answer: "All processing happens in your browser. No token data is sent to any server." }
    ]
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure random passwords",
    category: "Security Tools",
    path: "/tools/password-generator",
    icon: "🔒",
    popular: true,
    seoTitle: "Password Generator - Generate Secure Passwords Online",
    seoDescription: "Generate strong, secure random passwords online. Customize length, symbols, and character types.",
    intro: "Password Generator creates strong, random passwords with customizable options. Choose length, character types, and special symbols to meet any security requirement.",
    steps: ["Set your desired password length", "Select character types to include", "Click generate and copy your password"],
    features: ["Customizable password length", "Include/exclude uppercase, lowercase, numbers, symbols", "Cryptographically secure random generation"],
    example: { input: "Length: 16, All character types", output: "K9#mP2$xL7@nQ4&w" },
    faq: [
      { question: "Are the generated passwords truly random?", answer: "Yes, we use the Web Crypto API for cryptographically secure random number generation." },
      { question: "What makes a strong password?", answer: "A strong password is at least 12 characters long and includes uppercase, lowercase, numbers, and symbols." }
    ]
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate UUID v4",
    category: "Security Tools",
    path: "/tools/uuid-generator",
    icon: "#",
    popular: false,
    seoTitle: "UUID Generator - Generate UUID v4 Online",
    seoDescription: "Generate UUID v4 identifiers online. Create unique universal identifiers instantly.",
    intro: "UUID Generator creates version 4 universally unique identifiers. UUIDs are commonly used as database keys, session IDs, and unique resource identifiers.",
    steps: ["Click the generate button", "A new UUID v4 is created instantly", "Copy the UUID or generate more"],
    features: ["Generates RFC 4122 compliant UUID v4", "History of generated UUIDs", "One-click copy to clipboard"],
    example: { input: "Click generate", output: "550e8400-e29b-41d4-a716-446655440000" },
    faq: [
      { question: "What is UUID v4?", answer: "UUID v4 is a randomly generated universally unique identifier defined in RFC 4122." },
      { question: "Are UUIDs truly unique?", answer: "The probability of generating duplicate UUIDs is extremely low — approximately 1 in 2.71 quintillion." }
    ]
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA-256, SHA-384, SHA-512 hashes",
    category: "Security Tools",
    path: "/tools/hash-generator",
    icon: "≡",
    popular: false,
    seoTitle: "Hash Generator - SHA-256 SHA-512 Hash Online",
    seoDescription: "Generate SHA-256, SHA-384, SHA-512 hashes online. Compute cryptographic hash values for any text.",
    intro: "Hash Generator computes cryptographic hash values using SHA-256, SHA-384, and SHA-512 algorithms. Useful for verifying data integrity and password hashing.",
    steps: ["Enter or paste the text to hash", "Select the hash algorithm", "Copy the generated hash value"],
    features: ["Multiple hash algorithms: SHA-256, SHA-384, SHA-512", "Real-time hash computation", "Uses Web Crypto API for security"],
    example: { input: "Hello World", output: "SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e" },
    faq: [
      { question: "What is a hash function?", answer: "A hash function converts input data into a fixed-size string of characters, which is typically a digest that represents the original data." },
      { question: "Can I reverse a hash?", answer: "No, cryptographic hash functions are one-way. You cannot reverse a hash back to the original input." }
    ]
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, and lines",
    category: "Text Tools",
    path: "/tools/word-counter",
    icon: "W",
    popular: true,
    seoTitle: "Word Counter - Count Words Online Free",
    seoDescription: "Count words, characters, sentences and lines in your text. Free online word counting tool.",
    intro: "Word Counter provides detailed text statistics including word count, character count, line count, and estimated reading time. Perfect for writers, students, and content creators.",
    steps: ["Type or paste your text into the input area", "View real-time statistics in the output panel", "Use the stats for your writing needs"],
    features: ["Real-time word and character counting", "Reading time estimation", "Counts lines and sentences"],
    example: { input: "The quick brown fox jumps over the lazy dog.", output: "Words: 9 | Characters: 44 | Lines: 1 | Reading Time: 0s" },
    faq: [
      { question: "How is reading time calculated?", answer: "Reading time is based on an average reading speed of 200 words per minute." },
      { question: "Does it count words in other languages?", answer: "Yes, it counts words in any language that uses spaces as word separators." }
    ]
  },
  {
    id: "character-counter",
    name: "Character Counter",
    description: "Count characters in text",
    category: "Text Tools",
    path: "/tools/character-counter",
    icon: "C",
    popular: false,
    seoTitle: "Character Counter - Count Characters Online Free",
    seoDescription: "Count characters in text online. Track character count with and without spaces.",
    intro: "Character Counter tracks the exact number of characters in your text, with and without spaces. Essential for social media posts, SMS, and form field limits.",
    steps: ["Type or paste your text", "View character count with and without spaces", "Track against your character limit"],
    features: ["Counts characters with and without spaces", "Real-time counting as you type", "Useful for Twitter, SMS, and form limits"],
    example: { input: "Hello World", output: "With spaces: 11 | Without spaces: 10" },
    faq: [
      { question: "What is the difference between with and without spaces?", answer: "With spaces counts all characters including whitespace. Without spaces excludes spaces, tabs, and newlines." }
    ]
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case",
    category: "Text Tools",
    path: "/tools/case-converter",
    icon: "Aa",
    popular: false,
    seoTitle: "Case Converter - Convert Text Case Online",
    seoDescription: "Convert text to uppercase, lowercase, title case, camelCase and more. Free online case converter tool.",
    intro: "Case Converter transforms text between different letter cases including uppercase, lowercase, title case, camelCase, snake_case, and more.",
    steps: ["Paste your text into the input area", "Click the desired case conversion button", "Copy the converted text"],
    features: ["Multiple case formats: UPPER, lower, Title, camelCase, snake_case", "One-click conversion", "Instant results"],
    example: { input: "hello world example", output: "UPPER: HELLO WORLD EXAMPLE | lower: hello world example | Title: Hello World Example | camelCase: helloWorldExample | snake_case: hello_world_example" },
    faq: [
      { question: "What case formats are supported?", answer: "UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, and CONSTANT_CASE." },
      { question: "Can I convert multiple lines at once?", answer: "Yes, all lines in your input will be converted." }
    ]
  },
  {
    id: "text-diff-checker",
    name: "Text Diff Checker",
    description: "Compare two texts and find differences",
    category: "Text Tools",
    path: "/tools/text-diff-checker",
    icon: "⇄",
    popular: false,
    seoTitle: "Text Diff Checker - Compare Text Online Free",
    seoDescription: "Compare two texts and find differences online. Highlight changes between texts instantly.",
    intro: "Text Diff Checker compares two texts side by side and highlights the differences. Useful for reviewing code changes, document revisions, and content edits.",
    steps: ["Paste the original text in the left panel", "Paste the modified text in the right panel", "View highlighted differences"],
    features: ["Side-by-side comparison", "Highlights added and removed lines", "Shows diff statistics"],
    example: { input: "Original: Hello World\nModified: Hello Universe", output: "Removed: World | Added: Universe" },
    faq: [
      { question: "How does the diff algorithm work?", answer: "It uses a line-by-line comparison algorithm to identify added, removed, and unchanged lines." },
      { question: "Is there a character-level diff?", answer: "Currently the comparison is line-by-line. Character-level diff may be added in the future." }
    ]
  },
  {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    category: "Text Tools",
    path: "/tools/lorem-ipsum-generator",
    icon: "¶",
    popular: false,
    seoTitle: "Lorem Ipsum Generator - Placeholder Text Online",
    seoDescription: "Generate Lorem Ipsum placeholder text online. Customize paragraphs, sentences and word count.",
    intro: "Lorem Ipsum Generator creates placeholder text for design and development projects. Generate paragraphs, sentences, or words of dummy text instantly.",
    steps: ["Select the type: paragraphs, sentences, or words", "Set the desired count", "Copy the generated text"],
    features: ["Generate paragraphs, sentences, or words", "Customizable count", "Classic Lorem Ipsum text"],
    example: { input: "3 paragraphs", output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..." },
    faq: [
      { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is standard placeholder text used in printing and design since the 1500s." },
      { question: "Why use Lorem Ipsum?", answer: "It provides natural-looking text that doesn't distract from the visual design being reviewed." }
    ]
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Unix ↔ ISO timestamp conversion",
    category: "Converter Tools",
    path: "/tools/timestamp-converter",
    icon: "⏱",
    popular: false,
    seoTitle: "Timestamp Converter - Unix Timestamp Online",
    seoDescription: "Convert Unix timestamps to ISO dates and vice versa. Free online timestamp converter tool.",
    intro: "Timestamp Converter converts between Unix timestamps and human-readable date formats. Supports both seconds and milliseconds precision.",
    steps: ["Enter a Unix timestamp or ISO date string", "The converter shows all equivalent formats", "Copy the result you need"],
    features: ["Unix timestamp to ISO date conversion", "ISO date to Unix timestamp conversion", "Supports seconds and milliseconds"],
    example: { input: "1704067200", output: "2024-01-01T00:00:00.000Z" },
    faq: [
      { question: "What is a Unix timestamp?", answer: "A Unix timestamp is the number of seconds elapsed since January 1, 1970 (UTC)." },
      { question: "What is the difference between seconds and milliseconds?", answer: "Unix timestamps in seconds have 10 digits. Milliseconds timestamps have 13 digits." }
    ]
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regex patterns with match highlighting",
    category: "Developer Tools",
    path: "/tools/regex-tester",
    icon: ".*",
    popular: true,
    seoTitle: "Regex Tester - Test Regular Expressions Online",
    seoDescription: "Test regular expressions online with real-time match highlighting. Debug and validate regex patterns.",
    intro: "Regex Tester lets you test regular expressions against text with real-time match highlighting. Debug patterns, view match groups, and test replacement strings.",
    steps: ["Enter your regex pattern in the pattern field", "Type or paste test text", "View highlighted matches and groups"],
    features: ["Real-time match highlighting", "Support for regex flags (g, i, m, s)", "Match groups display", "Replace pattern preview"],
    example: { input: "Pattern: \\d+ | Text: I have 3 cats and 5 dogs", output: "Matches: 3, 5" },
    faq: [
      { question: "What regex flavor is supported?", answer: "JavaScript regular expressions as defined in ECMAScript specification." },
      { question: "What flags are available?", answer: "Global (g), Case-insensitive (i), Multiline (m), and Dot-all (s) flags are supported." }
    ]
  },
  {
    id: "yaml-formatter",
    name: "YAML Formatter",
    description: "Format/validate YAML, convert to JSON",
    category: "Format Tools",
    path: "/tools/yaml-formatter",
    icon: "Y:",
    popular: false,
    seoTitle: "YAML Formatter - Format YAML Online Free",
    seoDescription: "Format and validate YAML online. Convert YAML to JSON with proper indentation and syntax checking.",
    intro: "YAML Formatter validates and formats YAML data with proper indentation. Also converts YAML to JSON for easy integration with APIs and applications.",
    steps: ["Paste your YAML data into the input area", "The formatter validates and formats it", "View the formatted YAML or JSON output"],
    features: ["YAML syntax validation", "Auto-formatting with proper indentation", "YAML to JSON conversion"],
    example: { input: "name: Tom\nage: 20", output: 'JSON: {"name":"Tom","age":20}' },
    faq: [
      { question: "What YAML features are supported?", answer: "Most YAML 1.2 features including mappings, sequences, anchors, and multi-line strings." },
      { question: "Can it handle large YAML files?", answer: "Yes, but very large files may slow down the browser." }
    ]
  },
  {
    id: "xml-formatter",
    name: "XML Formatter",
    description: "Format/validate XML, convert to JSON",
    category: "Format Tools",
    path: "/tools/xml-formatter",
    icon: "<>",
    popular: false,
    seoTitle: "XML Formatter - Format XML Online Free",
    seoDescription: "Format and validate XML online. Beautify XML with proper indentation and syntax checking.",
    intro: "XML Formatter validates and formats XML data with proper indentation. Also converts XML to JSON for easier data processing.",
    steps: ["Paste your XML data into the input area", "The formatter validates and formats it", "View the formatted XML or JSON output"],
    features: ["XML syntax validation", "Auto-formatting with proper indentation", "XML to JSON conversion"],
    example: { input: "<user><name>Tom</name><age>20</age></user>", output: '<user>\n  <name>Tom</name>\n  <age>20</age>\n</user>' },
    faq: [
      { question: "Does it support XML namespaces?", answer: "Yes, XML namespaces are preserved during formatting." },
      { question: "Can it format SVG files?", answer: "Yes, SVG is valid XML and can be formatted." }
    ]
  },
  {
    id: "markdown-previewer",
    name: "Markdown Previewer",
    description: "GFM live rendering with tables, code blocks & TOC",
    category: "Format Tools",
    path: "/tools/markdown-previewer",
    icon: "M↓",
    popular: false,
    seoTitle: "Markdown Previewer - Preview Markdown Online",
    seoDescription: "Preview Markdown online with GitHub Flavored Markdown rendering. Live preview with tables and code blocks.",
    intro: "Markdown Previewer renders GitHub Flavored Markdown in real-time. Supports tables, code blocks, task lists, and automatic table of contents generation.",
    steps: ["Write or paste Markdown in the editor", "See the rendered preview in real-time", "Use the TOC to navigate headings"],
    features: ["GitHub Flavored Markdown support", "Live preview as you type", "Table of contents generation", "Code syntax highlighting"],
    example: { input: "# Hello\n\n- Item 1\n- Item 2\n\n| Name | Age |\n|------|-----|\n| Tom  | 20  |", output: "Rendered HTML with heading, list, and table" },
    faq: [
      { question: "What Markdown features are supported?", answer: "Full GFM support including tables, task lists, strikethrough, and fenced code blocks." },
      { question: "Can I export the preview?", answer: "Currently you can copy the rendered output. Export features may be added later." }
    ]
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "HEX/RGB/HSL/CMYK conversion",
    category: "Converter Tools",
    path: "/tools/color-converter",
    icon: "🎨",
    popular: false,
    seoTitle: "Color Converter - HEX RGB HSL Converter Online",
    seoDescription: "Convert colors between HEX, RGB, HSL and CMYK formats. Free online color conversion tool.",
    intro: "Color Converter converts colors between HEX, RGB, HSL, and CMYK formats. Includes a visual color picker and live preview.",
    steps: ["Enter a color in any format or use the picker", "View all equivalent color formats", "Copy the format you need"],
    features: ["Convert between HEX, RGB, HSL, CMYK", "Visual color picker", "Live preview swatch"],
    example: { input: "#89b4fa", output: "RGB: rgb(137, 180, 250) | HSL: hsl(217, 92%, 76%)" },
    faq: [
      { question: "What color formats are supported?", answer: "HEX, RGB, HSL, and CMYK formats are all supported." },
      { question: "Is there alpha/transparency support?", answer: "Currently only opaque colors are supported. Alpha channel support may be added later." }
    ]
  },
  {
    id: "csv-to-json",
    name: "CSV to JSON",
    description: "Convert CSV to JSON with custom delimiters",
    category: "Converter Tools",
    path: "/tools/csv-to-json",
    icon: "↔",
    popular: false,
    seoTitle: "CSV to JSON Converter - Convert CSV Online Free",
    seoDescription: "Convert CSV data to JSON format online. Support custom delimiters and quoted fields.",
    intro: "CSV to JSON Converter transforms CSV data into JSON format with support for custom delimiters, quoted fields, and header rows.",
    steps: ["Paste your CSV data into the input area", "Configure delimiter if needed", "Copy the JSON output"],
    features: ["Auto-detect CSV delimiter", "Support for quoted fields", "Customizable delimiter options"],
    example: { input: "name,age\nTom,20\nJane,25", output: '[\n  {"name":"Tom","age":"20"},\n  {"name":"Jane","age":"25"}\n]' },
    faq: [
      { question: "What delimiters are supported?", answer: "Comma, semicolon, tab, and pipe delimiters are supported." },
      { question: "Does it handle quoted fields?", answer: "Yes, fields enclosed in double quotes are properly parsed, including fields containing delimiters." }
    ]
  },
  {
    id: "number-base-converter",
    name: "Number Base Converter",
    description: "Convert numbers between bases 2–62",
    category: "Converter Tools",
    path: "/tools/number-base-converter",
    icon: "₂₁₀",
    popular: false,
    seoTitle: "Number Base Converter - Binary Hex Decimal Online",
    seoDescription: "Convert numbers between binary, octal, decimal, hex and bases 2-62. Free online base converter.",
    intro: "Number Base Converter converts numbers between binary, octal, decimal, hexadecimal, and any base from 2 to 62. Essential for low-level programming and data encoding.",
    steps: ["Enter a number in the input field", "Select the source base", "View conversions to all common bases"],
    features: ["Support bases 2 through 62", "Instant conversion to common bases", "Binary, octal, decimal, hex presets"],
    example: { input: "255 (Decimal)", output: "Binary: 11111111 | Octal: 377 | Hex: FF" },
    faq: [
      { question: "What is base 62?", answer: "Base 62 uses digits 0-9, letters A-Z, and letters a-z, commonly used in URL shorteners." },
      { question: "Can I convert fractional numbers?", answer: "Currently only integer conversion is supported." }
    ]
  },
  {
    id: "crc32-calculator",
    name: "CRC32 Calculator",
    description: "Compute CRC-32 checksums",
    category: "Developer Tools",
    path: "/tools/crc32-calculator",
    icon: "#",
    popular: false,
    seoTitle: "CRC32 Calculator - Compute CRC-32 Checksum Online",
    seoDescription: "Compute CRC-32 checksums online. Calculate CRC-32 hash for any text or data instantly.",
    intro: "CRC32 Calculator computes CRC-32 checksum values for any text input. Commonly used for data integrity verification and error detection.",
    steps: ["Enter or paste the text to compute", "The CRC-32 checksum is calculated instantly", "Copy the checksum value"],
    features: ["Instant CRC-32 computation", "Real-time calculation as you type", "No server processing"],
    example: { input: "Hello World", output: "CRC-32: 0x1C291CA3" },
    faq: [
      { question: "What is CRC-32?", answer: "CRC-32 is a cyclic redundancy check algorithm that produces a 32-bit checksum for detecting data corruption." },
      { question: "Is CRC-32 a hash function?", answer: "CRC-32 is a checksum algorithm, not a cryptographic hash. It's designed for error detection, not security." }
    ]
  },
  {
    id: "excel-analyzer",
    name: "Excel Data Analyzer",
    description: "Upload Excel, visualize data with charts",
    category: "Developer Tools",
    path: "/tools/excel-analyzer",
    icon: "📊",
    popular: true,
    seoTitle: "Excel Data Analyzer - Visualize Excel Data Online Free",
    seoDescription: "Upload Excel files and create interactive charts online. Bar, line, pie, area, scatter and radar charts. Free data visualization tool.",
    intro: "Excel Data Analyzer lets you upload Excel files and create interactive charts instantly. Supports bar, line, pie, area, scatter, and radar charts with data aggregation.",
    steps: ["Upload your Excel or CSV file", "Select columns for X and Y axes", "Choose chart type and aggregation method", "Download charts as PNG, SVG, or PDF"],
    features: ["Upload .xlsx, .xls, and .csv files", "6 chart types: Bar, Line, Pie, Area, Scatter, Radar", "Data aggregation: Sum, Average, Count, Max, Min", "Export to PNG, SVG, and PDF"],
    example: { input: "Upload sales.xlsx with Product and Sales columns", output: "Bar chart showing total sales by product" },
    faq: [
      { question: "What file formats are supported?", answer: "Microsoft Excel (.xlsx, .xls) and CSV (.csv) files are supported." },
      { question: "Is my data uploaded to a server?", answer: "No, all processing happens in your browser. Your data never leaves your device." },
      { question: "How many rows can it handle?", answer: "It can handle tens of thousands of rows, but performance depends on your device." }
    ]
  }
]

export const pages = [
  {
    id: "about",
    name: "About",
    path: "/about",
    seoTitle: "About - ToolHub",
    seoDescription: "About ToolHub - Free online developer tools that run entirely in your browser."
  },
  {
    id: "privacy",
    name: "Privacy Policy",
    path: "/privacy",
    seoTitle: "Privacy Policy - ToolHub",
    seoDescription: "ToolHub privacy policy. No data is collected or uploaded. All processing happens locally in your browser."
  }
]

export const categories = (() => {
  const order = [
    "JSON Tools",
    "Encoding Tools",
    "Security Tools",
    "Text Tools",
    "Developer Tools",
    "Format Tools",
    "Converter Tools"
  ]
  const map = {}
  tools.forEach(t => {
    map[t.category] ??= []
    map[t.category].push(t)
  })
  return order.filter(c => map[c]).map(c => ({ name: c, tools: map[c] }))
})()
