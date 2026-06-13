const zh = {
  // 站点基础
  siteName: "ToolHub",
  home: "首页",
  tools: "工具",
  search: "搜索工具...",
  popularTools: "热门工具",
  allTools: "全部工具",
  categories: "分类",
  developerTools: "开发者工具",
  freeOnlineDeveloperTools: "免费在线开发者工具",
  upload: "上传",
  download: "下载",
  copy: "复制",
  copied: "已复制",
  clear: "清除",
  generate: "生成",
  convert: "转换",
  format: "格式化",
  validate: "验证",
  compress: "压缩",
  settings: "设置",
  result: "结果",
  input: "输入",
  output: "输出",
  example: "示例",
  relatedTools: "相关工具",
  about: "关于",
  privacyPolicy: "隐私政策",
  fullscreen: "全屏",
  back: "返回",

  // 首页
  heroTitle: "免费开发者工具",
  heroDesc: "快速、私密、基于浏览器的实用工具。无需注册。",
  resultCount: "{{count}} 个结果",
  resultCount_other: "{{count}} 个结果",
  toolCount: "{{count}} 个工具",
  toolCount_other: "{{count}} 个工具",

  // 页脚
  footerText: "ToolHub — 免费在线开发者工具",

  // 关于页面
  aboutTitle: "关于 ToolHub",
  aboutP1: "ToolHub 是一系列免费的在线开发者工具集合。",
  aboutP2: "所有工具完全在浏览器中运行，不会将数据发送到服务器。",
  aboutP3: "无需登录，无需安装，无使用限制。",
  aboutP4: "由开发者，为开发者打造。",

  // 隐私页面
  privacyTitle: "隐私政策",
  privacyP1: "ToolHub 不会收集、存储或上传您的任何输入数据。",
  privacyP2: "所有处理均在您的浏览器本地完成。",
  privacyP3: "我们可能使用匿名分析（Cloudflare）来改善性能和用户体验。",
  privacyP4: "不会收集任何个人信息。",
  privacyP5: "如有疑问，请联系我们。",

  // 工具指南
  aboutTool: "关于 {{name}}",
  howToUse: "使用方法",
  features: "功能特性",
  faq: "常见问题",

  // 面包屑
  breadcrumbHome: "首页",

  // 分类
  catJsonTools: "JSON 工具",
  catEncodingTools: "编码工具",
  catSecurityTools: "安全工具",
  catTextTools: "文本工具",
  catDeveloperTools: "开发者工具",
  catFormatTools: "格式化工具",
  catConverterTools: "转换工具",

  // 工具
  tools: {
    jsonFormatter: "JSON 格式化",
    jsonValidator: "JSON 验证",
    jsonMinifier: "JSON 压缩",
    jsonBeautifier: "JSON 美化",
    base64Encoder: "Base64 编码",
    base64Decoder: "Base64 解码",
    urlEncoder: "URL 编码",
    urlDecoder: "URL 解码",
    jwtDecoder: "JWT 解码",
    passwordGenerator: "密码生成器",
    uuidGenerator: "UUID 生成器",
    hashGenerator: "哈希生成器",
    wordCounter: "字数统计",
    characterCounter: "字符统计",
    caseConverter: "大小写转换",
    textDiffChecker: "文本差异对比",
    loremIpsumGenerator: "占位文本生成",
    timestampConverter: "时间戳转换",
    regexTester: "正则表达式测试",
    yamlFormatter: "YAML 格式化",
    xmlFormatter: "XML 格式化",
    markdownPreviewer: "Markdown 预览",
    colorConverter: "颜色转换",
    csvToJson: "CSV 转 JSON",
    numberBaseConverter: "进制转换",
    crc32Calculator: "CRC32 计算器",
    excelAnalyzer: "Excel 分析",
    apiTester: "API 接口测试",
    sqlFormatter: "SQL 格式化",
    jsonSchemaValidator: "JSON Schema 验证",
    cronGenerator: "Cron 表达式生成",
    jsonDiff: "JSON 差异对比",
    imageCompressor: "图片压缩",
  },

  // 工具描述
  toolDesc: {
    jsonFormatter: "在线格式化 JSON",
    jsonValidator: "验证 JSON 数据",
    jsonMinifier: "压缩 JSON 并移除空白",
    jsonBeautifier: "美化和格式化 JSON",
    base64Encoder: "将文本编码为 Base64",
    base64Decoder: "将 Base64 解码为文本",
    urlEncoder: "编码 URL 字符",
    urlDecoder: "解码 URL 字符",
    jwtDecoder: "解码 JWT 令牌",
    passwordGenerator: "生成安全密码",
    uuidGenerator: "生成 UUID",
    hashGenerator: "生成 MD5、SHA-1、SHA-256 哈希",
    wordCounter: "统计字数和字符数",
    characterCounter: "统计字符数和字节数",
    caseConverter: "转换文本大小写",
    textDiffChecker: "比较文本差异",
    loremIpsumGenerator: "生成占位文本",
    timestampConverter: "转换 Unix 时间戳",
    regexTester: "测试正则表达式",
    yamlFormatter: "格式化和验证 YAML",
    xmlFormatter: "格式化和验证 XML",
    markdownPreviewer: "实时预览 Markdown",
    colorConverter: "转换颜色格式",
    csvToJson: "将 CSV 转换为 JSON",
    numberBaseConverter: "进制转换",
    crc32Calculator: "计算 CRC32 校验和",
    excelAnalyzer: "在线分析 Excel 文件",
    apiTester: "测试 API 接口",
    sqlFormatter: "格式化 SQL 查询",
    jsonSchemaValidator: "根据 Schema 验证 JSON",
    cronGenerator: "生成和验证 Cron 表达式",
    jsonDiff: "比较 JSON 差异",
    imageCompressor: "本地压缩图片",
  },

  // 语言
  language: "语言",
  en: "English",
  zh: "中文",

  // 工具内容（介绍、步骤、功能、示例、常见问题）
  toolContent: {
    jsonFormatter: {
      intro: "JSON 格式化工具帮助开发者将 JSON 数据格式化和美化成可读的结构。粘贴压缩或混乱的 JSON，即可获得正确缩进的输出。",
      steps: ["将 JSON 数据粘贴到输入区域", "格式化器自动处理您的 JSON", "从输出区域复制格式化结果"],
      features: ["输入时即时格式化", "带行号的详细错误信息", "不发送数据到服务器 — 所有处理在浏览器中完成"],
      example: { input: '{"name":"Tom","age":20}', output: '{\n  "name": "Tom",\n  "age": 20\n}' },
      faq: [
        { q: "这个 JSON 格式化工具免费吗？", a: "是的，完全免费，无使用限制。" },
        { q: "我的数据安全吗？", a: "所有处理都在您的浏览器本地完成，不会将数据发送到任何服务器。" },
        { q: "支持哪些 JSON 格式？", a: "任何有效的 JSON，包括对象、数组、字符串、数字、布尔值和 null。" }
      ]
    },
    jsonValidator: {
      intro: "JSON 验证工具检查您的 JSON 数据是否存在语法错误，并报告确切的错误位置。查找缺失的括号、尾随逗号和其他常见错误。",
      steps: ["将 JSON 数据粘贴到输入区域", "验证器自动检查您的 JSON", "修复输出中高亮显示的错误"],
      features: ["输入时实时验证", "精确的错误位置（行和列）", "常见 JSON 错误的建议"],
      example: { input: '{"name":"Tom",}', output: "无效 JSON：第 1 行第 15 列存在尾随逗号" },
      faq: [
        { q: "JSON 验证检查什么？", a: "检查语法错误，如缺失括号、尾随逗号、未加引号的键和无效值。" },
        { q: "支持 JSON5 吗？", a: "不支持，仅验证 RFC 8259 定义的标准 JSON。" }
      ]
    },
    jsonMinifier: {
      intro: "JSON 压缩工具移除 JSON 数据中所有不必要的空白，减小文件大小，实现更快的传输和更低的带宽使用。",
      steps: ["将 JSON 数据粘贴到输入区域", "压缩器自动压缩", "复制压缩后的结果"],
      features: ["移除所有空白和换行", "显著减小 JSON 文件大小", "压缩时保持数据完整性"],
      example: { input: '{\n  "name": "Tom",\n  "age": 20\n}', output: '{"name":"Tom","age":20}' },
      faq: [
        { q: "可以节省多少大小？", a: "通常可减少 20-40%，取决于原始格式化程度。" },
        { q: "压缩后的 JSON 仍然有效吗？", a: "是的，压缩后的 JSON 完全有效，可被任何 JSON 解析器解析。" }
      ]
    },
    jsonBeautifier: {
      intro: "JSON 美化工具使用 4 空格缩进格式化您的 JSON，使其易于阅读和调试。非常适合查看 API 响应和配置文件。",
      steps: ["将 JSON 数据粘贴到输入区域", "美化器使用正确的缩进格式化", "复制美化后的结果"],
      features: ["4 空格缩进，提高可读性", "美化时验证 JSON", "浏览器中即时处理"],
      example: { input: '{"users":[{"name":"Tom","age":20}]}', output: '{\n    "users": [\n        {\n            "name": "Tom",\n            "age": 20\n        }\n    ]\n}' },
      faq: [
        { q: "格式化器和美化器有什么区别？", a: "美化器使用 4 空格缩进，格式化器使用 2 空格缩进。" },
        { q: "可以自定义缩进吗？", a: "目前默认使用 4 空格缩进。" }
      ]
    },
    base64Encoder: {
      intro: "Base64 编码工具将纯文本转换为 Base64 编码格式。常用于编码电子邮件、URL 中的数据，以及在 HTML/CSS 中嵌入图片。",
      steps: ["输入或粘贴要编码的文本", "编码结果即时显示", "复制 Base64 输出"],
      features: ["输入时即时编码", "支持所有 Unicode 字符", "无服务器处理 — 在浏览器中运行"],
      example: { input: "Hello World", output: "SGVsbG8gV29ybGQ=" },
      faq: [
        { q: "什么是 Base64 编码？", a: "Base64 是一种二进制到文本的编码方案，使用 64 个可打印 ASCII 字符来表示二进制数据。" },
        { q: "Base64 是加密吗？", a: "不是，Base64 是编码而非加密，不提供安全性。" }
      ]
    },
    base64Decoder: {
      intro: "Base64 解码工具将 Base64 编码的字符串还原为原始文本。适用于解码 JWT 令牌、电子邮件附件和嵌入数据。",
      steps: ["粘贴 Base64 编码的字符串", "解码文本即时显示", "复制解码结果"],
      features: ["输入时即时解码", "优雅处理无效 Base64", "支持 UTF-8 字符解码"],
      example: { input: "SGVsbG8gV29ybGQ=", output: "Hello World" },
      faq: [
        { q: "输入无效的 Base64 会怎样？", a: "工具会显示错误消息，提示输入不是有效的 Base64。" },
        { q: "可以解码 Base64 图片吗？", a: "此工具将 Base64 解码为文本。如需解码图片，请使用专门的 Base64 图片解码器。" }
      ]
    },
    urlEncoder: {
      intro: "URL 编码工具将文本中的特殊字符转换为百分号编码格式，使其可以安全地包含在 URL 和查询字符串中。",
      steps: ["输入包含特殊字符的文本", "URL 编码结果即时显示", "复制编码后的字符串"],
      features: ["编码保留的 URI 字符", "实时编码", "遵循 RFC 3986 标准"],
      example: { input: "hello world?name=Tom&age=20", output: "hello%20world%3Fname%3DTom%26age%3D20" },
      faq: [
        { q: "哪些字符会被编码？", a: "空格、?、&、=、# 等特殊字符和非 ASCII 字符会被百分号编码。" },
        { q: "什么是百分号编码？", a: "百分号编码将不安全的字符替换为 % 后跟两个十六进制数字。" }
      ]
    },
    urlDecoder: {
      intro: "URL 解码工具将百分号编码的字符串还原为原始可读文本。适用于调试 URL 和解析查询参数。",
      steps: ["粘贴 URL 编码的字符串", "解码文本即时显示", "复制解码结果"],
      features: ["解码所有百分号编码字符", "实时解码", "处理双重编码字符串"],
      example: { input: "hello%20world%3Fname%3DTom%26age%3D20", output: "hello world?name=Tom&age=20" },
      faq: [
        { q: "可以解码双重编码的 URL 吗？", a: "可以，但双重编码的字符串可能需要多次解码。" },
        { q: "编码和解码有什么区别？", a: "编码将特殊字符转换为 %XX 格式，解码将它们还原。" }
      ]
    },
    jwtDecoder: {
      intro: "JWT 解码工具让您通过解码头部和载荷部分来检查 JSON Web 令牌。即时查看令牌声明、过期时间和签发者信息。",
      steps: ["将 JWT 令牌粘贴到输入区域", "头部和载荷自动解码", "查看解码后的令牌信息"],
      features: ["解码头部和载荷部分", "显示令牌过期时间和签发者", "高亮无效的令牌格式"],
      example: { input: "eyJhbGciOiJIUzI1NiJ9...", output: '头部: {"alg":"HS256"}\n载荷: {"sub":"1234567890","name":"John"}' },
      faq: [
        { q: "此工具会验证 JWT 签名吗？", a: "不会，此工具仅解码令牌。签名验证需要密钥。" },
        { q: "使用此工具时我的令牌安全吗？", a: "所有处理都在您的浏览器中完成，不会将令牌数据发送到任何服务器。" }
      ]
    },
    passwordGenerator: {
      intro: "密码生成器创建具有可自定义选项的强随机密码。选择长度、字符类型和特殊符号以满足任何安全要求。",
      steps: ["设置所需的密码长度", "选择要包含的字符类型", "点击生成并复制您的密码"],
      features: ["可自定义密码长度", "包含/排除大写、小写、数字、符号", "加密安全的随机生成"],
      example: { input: "长度: 16，所有字符类型", output: "K9#mP2$xL7@nQ4&w" },
      faq: [
        { q: "生成的密码是真正随机的吗？", a: "是的，我们使用 Web Crypto API 进行加密安全的随机数生成。" },
        { q: "什么构成强密码？", a: "强密码至少 12 个字符，包含大写、小写、数字和符号。" }
      ]
    },
    uuidGenerator: {
      intro: "UUID 生成器创建版本 4 的通用唯一标识符。UUID 常用作数据库键、会话 ID 和唯一资源标识符。",
      steps: ["点击生成按钮", "新的 UUID v4 即时创建", "复制 UUID 或生成更多"],
      features: ["生成符合 RFC 4122 的 UUID v4", "已生成 UUID 的历史记录", "一键复制到剪贴板"],
      example: { input: "点击生成", output: "550e8400-e29b-41d4-a716-446655440000" },
      faq: [
        { q: "什么是 UUID v4？", a: "UUID v4 是 RFC 4122 中定义的随机生成的通用唯一标识符。" },
        { q: "UUID 真的是唯一的吗？", a: "生成重复 UUID 的概率极低 — 大约为 271 万亿分之一。" }
      ]
    },
    hashGenerator: {
      intro: "哈希生成器使用 SHA-256、SHA-384 和 SHA-512 算法计算加密哈希值。适用于验证数据完整性和密码哈希。",
      steps: ["输入或粘贴要哈希的文本", "选择哈希算法", "复制生成的哈希值"],
      features: ["多种哈希算法：SHA-256、SHA-384、SHA-512", "实时哈希计算", "使用 Web Crypto API 确保安全"],
      example: { input: "Hello World", output: "SHA-256: a591a6d40bf420404a011733cfb7b190..." },
      faq: [
        { q: "什么是哈希函数？", a: "哈希函数将输入数据转换为固定长度的字符串，通常是代表原始数据的摘要。" },
        { q: "可以反向解密哈希吗？", a: "不可以，加密哈希函数是单向的，无法将哈希还原为原始输入。" }
      ]
    },
    wordCounter: {
      intro: "字数统计工具提供详细的文本统计，包括字数、字符数、行数和预计阅读时间。适合作家、学生和内容创作者。",
      steps: ["在输入区域输入或粘贴文本", "在输出面板查看实时统计", "将统计数据用于写作需求"],
      features: ["实时字数和字符统计", "阅读时间估算", "统计行数和句子数"],
      example: { input: "The quick brown fox jumps over the lazy dog.", output: "字数: 9 | 字符: 44 | 行: 1 | 阅读时间: 0秒" },
      faq: [
        { q: "阅读时间如何计算？", a: "阅读时间基于每分钟 200 词的平均阅读速度计算。" },
        { q: "支持其他语言的字数统计吗？", a: "支持，可统计任何使用空格作为词分隔符的语言。" }
      ]
    },
    characterCounter: {
      intro: "字符统计工具精确跟踪文本中的字符数，包括含空格和不含空格的计数。社交媒体帖子、短信和表单字段限制必备。",
      steps: ["输入或粘贴文本", "查看含空格和不含空格的字符数", "跟踪字符限制"],
      features: ["统计含空格和不含空格的字符数", "输入时实时统计", "适用于 Twitter、短信和表单限制"],
      example: { input: "Hello World", output: "含空格: 11 | 不含空格: 10" },
      faq: [
        { q: "含空格和不含空格有什么区别？", a: "含空格统计所有字符包括空白，不含空格排除空格、制表符和换行符。" }
      ]
    },
    caseConverter: {
      intro: "大小写转换工具在大小写、首字母大写、驼峰命名、蛇形命名等不同格式之间转换文本。",
      steps: ["将文本粘贴到输入区域", "点击所需的大小写转换按钮", "复制转换后的文本"],
      features: ["多种格式：大写、小写、首字母大写、驼峰、蛇形", "一键转换", "即时结果"],
      example: { input: "hello world example", output: "大写: HELLO WORLD EXAMPLE | 驼峰: helloWorldExample" },
      faq: [
        { q: "支持哪些大小写格式？", a: "大写、小写、首字母大写、驼峰命名、帕斯卡命名、蛇形命名和常量命名。" },
        { q: "可以同时转换多行吗？", a: "可以，输入中的所有行都会被转换。" }
      ]
    },
    textDiffChecker: {
      intro: "文本差异对比工具并排比较两段文本并高亮显示差异。适用于审查代码更改、文档修订和内容编辑。",
      steps: ["在左侧面板粘贴原始文本", "在右侧面板粘贴修改后的文本", "查看高亮显示的差异"],
      features: ["并排比较", "高亮显示添加和删除的行", "显示差异统计"],
      example: { input: "原始: Hello World\n修改: Hello Universe", output: "删除: World | 添加: Universe" },
      faq: [
        { q: "差异算法如何工作？", a: "使用逐行比较算法来识别添加、删除和未更改的行。" },
        { q: "有字符级别的差异比较吗？", a: "目前比较是逐行进行的，字符级别的差异比较可能会在未来添加。" }
      ]
    },
    loremIpsumGenerator: {
      intro: "占位文本生成器为设计和开发项目创建占位文本。即时生成段落、句子或单词的虚拟文本。",
      steps: ["选择类型：段落、句子或单词", "设置所需数量", "复制生成的文本"],
      features: ["生成段落、句子或单词", "可自定义数量", "经典 Lorem Ipsum 文本"],
      example: { input: "3 个段落", output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." },
      faq: [
        { q: "什么是 Lorem Ipsum？", a: "Lorem Ipsum 是自 1500 年代以来在印刷和设计中使用的标准占位文本。" },
        { q: "为什么使用 Lorem Ipsum？", a: "它提供看起来自然的文本，不会分散对正在审查的视觉设计的注意力。" }
      ]
    },
    timestampConverter: {
      intro: "时间戳转换工具在 Unix 时间戳和人类可读的日期格式之间转换。支持秒和毫秒精度。",
      steps: ["输入 Unix 时间戳或 ISO 日期字符串", "转换器显示所有等效格式", "复制您需要的结果"],
      features: ["Unix 时间戳转 ISO 日期", "ISO 日期转 Unix 时间戳", "支持秒和毫秒"],
      example: { input: "1704067200", output: "2024-01-01T00:00:00.000Z" },
      faq: [
        { q: "什么是 Unix 时间戳？", a: "Unix 时间戳是自 1970 年 1 月 1 日（UTC）以来经过的秒数。" },
        { q: "秒和毫秒有什么区别？", a: "以秒为单位的 Unix 时间戳有 10 位数字，毫秒时间戳有 13 位数字。" }
      ]
    },
    regexTester: {
      intro: "正则表达式测试工具让您通过实时匹配高亮来测试正则表达式。调试模式、查看匹配组和测试替换字符串。",
      steps: ["在模式字段中输入正则表达式", "输入或粘贴测试文本", "查看高亮显示的匹配和分组"],
      features: ["实时匹配高亮", "支持正则标志（g、i、m、s）", "匹配分组显示", "替换模式预览"],
      example: { input: "模式: \\d+ | 文本: 我有 3 只猫和 5 只狗", output: "匹配: 3, 5" },
      faq: [
        { q: "支持哪种正则表达式？", a: "ECMAScript 规范定义的 JavaScript 正则表达式。" },
        { q: "有哪些标志可用？", a: "支持全局（g）、不区分大小写（i）、多行（m）和点匹配所有（s）标志。" }
      ]
    },
    yamlFormatter: {
      intro: "YAML 格式化工具验证和格式化 YAML 数据，使用正确的缩进。还可将 YAML 转换为 JSON，便于与 API 和应用程序集成。",
      steps: ["将 YAML 数据粘贴到输入区域", "格式化器验证并格式化", "查看格式化的 YAML 或 JSON 输出"],
      features: ["YAML 语法验证", "使用正确缩进自动格式化", "YAML 转 JSON"],
      example: { input: "name: Tom\nage: 20", output: 'JSON: {"name":"Tom","age":20}' },
      faq: [
        { q: "支持哪些 YAML 特性？", a: "大多数 YAML 1.2 特性，包括映射、序列、锚点和多行字符串。" },
        { q: "可以处理大型 YAML 文件吗？", a: "可以，但非常大的文件可能会使浏览器变慢。" }
      ]
    },
    xmlFormatter: {
      intro: "XML 格式化工具验证和格式化 XML 数据，使用正确的缩进。还可将 XML 转换为 JSON，便于数据处理。",
      steps: ["将 XML 数据粘贴到输入区域", "格式化器验证并格式化", "查看格式化的 XML 或 JSON 输出"],
      features: ["XML 语法验证", "使用正确缩进自动格式化", "XML 转 JSON"],
      example: { input: "<user><name>Tom</name><age>20</age></user>", output: '<user>\n  <name>Tom</name>\n  <age>20</age>\n</user>' },
      faq: [
        { q: "支持 XML 命名空间吗？", a: "支持，格式化时会保留 XML 命名空间。" },
        { q: "可以格式化 SVG 文件吗？", a: "可以，SVG 是有效的 XML，可以被格式化。" }
      ]
    },
    markdownPreviewer: {
      intro: "Markdown 预览工具实时渲染 GitHub 风格的 Markdown。支持表格、代码块、任务列表和自动目录生成。",
      steps: ["在编辑器中编写或粘贴 Markdown", "实时查看渲染预览", "使用目录导航标题"],
      features: ["支持 GitHub 风格 Markdown", "输入时实时预览", "目录生成", "代码语法高亮"],
      example: { input: "# 你好\n\n- 项目 1\n- 项目 2", output: "渲染的 HTML，包含标题和列表" },
      faq: [
        { q: "支持哪些 Markdown 特性？", a: "完整的 GFM 支持，包括表格、任务列表、删除线和围栏代码块。" },
        { q: "可以导出预览吗？", a: "目前可以复制渲染输出，导出功能可能会在未来添加。" }
      ]
    },
    colorConverter: {
      intro: "颜色转换工具在 HEX、RGB、HSL 和 CMYK 格式之间转换颜色。包含可视化颜色选择器和实时预览。",
      steps: ["以任何格式输入颜色或使用选择器", "查看所有等效的颜色格式", "复制您需要的格式"],
      features: ["在 HEX、RGB、HSL、CMYK 之间转换", "可视化颜色选择器", "实时预览色块"],
      example: { input: "#89b4fa", output: "RGB: rgb(137, 180, 250) | HSL: hsl(217, 92%, 76%)" },
      faq: [
        { q: "支持哪些颜色格式？", a: "支持 HEX、RGB、HSL 和 CMYK 格式。" },
        { q: "支持透明度吗？", a: "目前仅支持不透明颜色，Alpha 通道支持可能会在未来添加。" }
      ]
    },
    csvToJson: {
      intro: "CSV 转 JSON 工具将 CSV 数据转换为 JSON 格式，支持自定义分隔符、带引号的字段和标题行。",
      steps: ["将 CSV 数据粘贴到输入区域", "如需可配置分隔符", "复制 JSON 输出"],
      features: ["自动检测 CSV 分隔符", "支持带引号的字段", "可自定义分隔符选项"],
      example: { input: "name,age\nTom,20\nJane,25", output: '[{"name":"Tom","age":"20"},{"name":"Jane","age":"25"}]' },
      faq: [
        { q: "支持哪些分隔符？", a: "支持逗号、分号、制表符和竖线分隔符。" },
        { q: "能处理带引号的字段吗？", a: "可以，用双引号括起来的字段会被正确解析，包括包含分隔符的字段。" }
      ]
    },
    numberBaseConverter: {
      intro: "进制转换工具在二进制、八进制、十进制、十六进制以及 2 到 62 的任意进制之间转换数字。底层编程和数据编码必备。",
      steps: ["在输入字段中输入数字", "选择源进制", "查看所有常用进制的转换结果"],
      features: ["支持 2 到 62 进制", "即时转换为常用进制", "二进制、八进制、十进制、十六进制预设"],
      example: { input: "255（十进制）", output: "二进制: 11111111 | 八进制: 377 | 十六进制: FF" },
      faq: [
        { q: "什么是 62 进制？", a: "62 进制使用数字 0-9、字母 A-Z 和字母 a-z，常用于 URL 缩短服务。" },
        { q: "可以转换小数吗？", a: "目前仅支持整数转换。" }
      ]
    },
    crc32Calculator: {
      intro: "CRC32 计算工具为任何文本输入计算 CRC-32 校验值。常用于数据完整性验证和错误检测。",
      steps: ["输入或粘贴要计算的文本", "CRC-32 校验和即时计算", "复制校验值"],
      features: ["即时 CRC-32 计算", "输入时实时计算", "无服务器处理"],
      example: { input: "Hello World", output: "CRC-32: 0x1C291CA3" },
      faq: [
        { q: "什么是 CRC-32？", a: "CRC-32 是一种循环冗余校验算法，生成 32 位校验和用于检测数据损坏。" },
        { q: "CRC-32 是哈希函数吗？", a: "CRC-32 是校验和算法，不是加密哈希。它用于错误检测，而非安全。" }
      ]
    },
    excelAnalyzer: {
      intro: "Excel 数据分析工具让您上传 Excel 文件并即时创建交互式图表。支持柱状图、折线图、饼图、面积图、散点图和雷达图，支持数据聚合。",
      steps: ["上传 Excel 或 CSV 文件", "选择 X 轴和 Y 轴的列", "选择图表类型和聚合方式", "下载图表为 PNG、SVG 或 PDF"],
      features: ["上传 .xlsx、.xls 和 .csv 文件", "6 种图表类型：柱状图、折线图、饼图、面积图、散点图、雷达图", "数据聚合：求和、平均、计数、最大、最小", "导出为 PNG、SVG 和 PDF"],
      example: { input: "上传包含产品和销售额列的 sales.xlsx", output: "显示各产品总销售额的柱状图" },
      faq: [
        { q: "支持哪些文件格式？", a: "支持 Microsoft Excel（.xlsx、.xls）和 CSV（.csv）文件。" },
        { q: "我的数据会上传到服务器吗？", a: "不会，所有处理都在您的浏览器中完成，数据不会离开您的设备。" },
        { q: "能处理多少行数据？", a: "可以处理数万行数据，但性能取决于您的设备。" }
      ]
    },
    apiTester: {
      intro: "API 接口测试工具是一个轻量级 REST API 客户端，让您直接在浏览器中测试 API。发送 GET、POST、PUT、PATCH、DELETE 请求，查看格式化的 JSON 响应、请求头和耗时。",
      steps: ["输入请求 URL 并选择 HTTP 方法", "根据需要添加请求头、查询参数或请求体", "点击发送并查看格式化的响应"],
      features: ["支持 GET、POST、PUT、PATCH、DELETE、OPTIONS、HEAD", "带验证的 JSON 请求体编辑器", "请求历史保存在本地", "自动格式化 JSON 响应并支持折叠"],
      example: { input: "GET https://jsonplaceholder.typicode.com/posts/1", output: '{ "userId": 1, "id": 1, "title": "sunt aut facere..." }' },
      faq: [
        { q: "我的 API 数据会发送到任何服务器吗？", a: "不会，请求直接从您的浏览器发送，不涉及任何代理或中间件。" },
        { q: "支持受 CORS 限制的 API 吗？", a: "CORS 限制由浏览器强制执行，如果 API 不允许跨域请求，请求将失败。" },
        { q: "请求历史保留多久？", a: "历史记录存储在浏览器的 localStorage 中，直到您清除为止。" }
      ]
    },
    sqlFormatter: {
      intro: "SQL 格式化与查询构建工具帮助开发者格式化 SQL 查询并可视化构建复杂的 SQL 语句。支持多表 JOIN、WHERE 条件、GROUP BY、HAVING、ORDER BY、LIMIT 和聚合函数。",
      steps: ["选择格式化 SQL、查询构建器或简单生成器模式", "查询构建器：配置表、列、JOIN、WHERE、GROUP BY、HAVING、ORDER BY", "点击构建 SQL 查询以生成格式化的 SQL"],
      features: ["SQL 格式化器，支持美化和压缩模式", "可视化查询构建器，支持多表 JOIN", "WHERE 构建器，支持 =、!=、>、<、LIKE、IN、BETWEEN、IS NULL", "聚合函数：COUNT、SUM、AVG、MAX、MIN", "GROUP BY、HAVING、ORDER BY、LIMIT/OFFSET", "简单生成器，支持 INSERT、UPDATE、DELETE、CREATE TABLE"],
      example: { input: "select u.name,count(o.id) from users u left join orders o on u.id=o.user_id group by u.name", output: "SELECT\n  u.name,\n  COUNT(o.id)\nFROM users u\nLEFT JOIN orders o\n  ON u.id = o.user_id\nGROUP BY u.name;" },
      faq: [
        { q: "支持哪些 SQL 方言？", a: "格式化器支持标准 SQL 语法，生成器支持 MySQL、PostgreSQL、SQLite 和 SQL Server。" },
        { q: "我的 SQL 数据会发送到服务器吗？", a: "不会，所有格式化和生成都在您的浏览器本地完成。" },
        { q: "可以用 JOIN 构建复杂查询吗？", a: "可以！使用查询构建器添加多个表，配置 JOIN，以及添加 WHERE、GROUP BY、HAVING 和 ORDER BY 子句。" },
        { q: "可以自定义输出格式吗？", a: "可以，您可以选择关键字大小写、美化或压缩模式，以及是否添加分号。" }
      ]
    },
    jsonSchemaValidator: {
      intro: "JSON Schema 验证工具帮助开发者根据 JSON Schema 验证 JSON 数据。支持类型检查、必填字段、枚举、模式、最小/最大长度、最小/最大值、数组项和嵌套对象验证。",
      steps: ["在左侧面板粘贴 JSON Schema", "在右侧面板粘贴 JSON 数据", "点击验证以检查数据是否匹配模式"],
      features: ["根据 JSON Schema 规则验证", "支持 type、required、properties、items、enum、pattern", "支持 minimum、maximum、minLength、maxLength", "带路径和原因的详细错误信息", "内置模板：用户、产品、API 响应"],
      example: { input: '{"type":"object","required":["name"]}', output: '{"name":"Tom"} → 有效' },
      faq: [
        { q: "支持哪些 JSON Schema 特性？", a: "类型检查、必填字段、属性、数组项、枚举、模式、最小/最大值、最小/最大长度等。" },
        { q: "我的数据会发送到服务器吗？", a: "不会，所有验证都在您的浏览器本地完成。" },
        { q: "可以使用 draft-07 或更新的 JSON Schema 吗？", a: "此工具支持常用于验证的 JSON Schema 实用子集。" },
        { q: "如何修复验证错误？", a: "每个错误显示路径、预期规则和实际收到的内容，用于定位和修复问题。" }
      ]
    },
    cronGenerator: {
      intro: "Cron 表达式生成工具帮助开发者可视化构建和验证 Cron 表达式。使用构建器通过表单控件配置计划，或使用验证器检查现有表达式。",
      steps: ["使用构建器设置分钟、小时、日、月和星期", "复制生成的 Cron 表达式", "或切换到验证器检查现有表达式"],
      features: ["可视化 Cron 构建器，支持每、指定、范围、步长模式", "实时人类可读描述", "带详细错误信息的 Cron 验证器", "内置模板：每分钟、每小时、每天、每周、每月"],
      example: { input: "*/5 * * * *", output: "每 5 分钟运行一次" },
      faq: [
        { q: "支持哪种 Cron 格式？", a: "标准 5 字段 Cron：分钟 小时 日 月 星期。" },
        { q: "支持 6 字段或 7 字段 Cron 吗？", a: "目前仅支持 5 字段 Cron。" },
        { q: "我的数据会发送到服务器吗？", a: "不会，所有处理都在您的浏览器本地完成。" },
        { q: "*/5 是什么意思？", a: "*/5 表示「每 5 个单位」。所以分钟字段中的 */5 表示每 5 分钟。" }
      ]
    },
    jsonDiff: {
      intro: "JSON 差异对比工具帮助开发者比较两个 JSON 对象，即时找出添加、删除或更改的内容。支持嵌套对象、数组和可配置的比较选项。",
      steps: ["在左侧编辑器粘贴原始 JSON", "在右侧编辑器粘贴新的 JSON", "点击比较查看差异"],
      features: ["检测添加、删除和更改的字段", "显示每个差异的 JSON 路径", "显示更改前后的值", "差异统计：添加、删除、更改的数量", "选项：忽略键顺序、忽略数组顺序"],
      example: { input: '{"name":"Tom","age":20}', output: '{"name":"Tom","age":25} → 更改: $.age 20→25' },
      faq: [
        { q: "检测哪些类型的差异？", a: "三种类型：添加、删除和更改。" },
        { q: "支持嵌套对象吗？", a: "支持，递归比较嵌套对象和数组，显示完整路径。" },
        { q: "「忽略键顺序」有什么作用？", a: "启用后，键顺序不同但内容相同的对象被视为相同。" },
        { q: "我的数据会发送到服务器吗？", a: "不会，所有比较都在您的浏览器本地完成。" }
      ]
    },
    imageCompressor: {
      intro: "图片压缩工具帮助您直接在浏览器中减小图片文件大小。上传 JPG、PNG 或 WEBP 图片，调整质量和尺寸，下载压缩结果 — 不会将数据发送到任何服务器。",
      steps: ["上传或拖放图片（JPG、PNG、WEBP）", "调整质量、输出格式和调整大小选项", "点击压缩图片并下载结果"],
      features: ["浏览器端压缩 — 无需上传到服务器", "质量滑块从 1% 到 100%", "输出格式：原始、JPG、PNG、WEBP", "按宽度和高度调整大小", "批量压缩并下载 ZIP"],
      example: { input: "photo.jpg (2.4 MB)", output: "photo.jpg (480 KB) — 节省 80%" },
      faq: [
        { q: "我的图片数据会上传到服务器吗？", a: "不会。所有压缩都使用 Canvas API 在您的浏览器本地完成。" },
        { q: "支持哪些图片格式？", a: "JPG/JPEG、PNG 和 WEBP，也可以在这些格式之间转换。" },
        { q: "质量设置如何工作？", a: "质量滑块（1-100%）控制压缩级别，质量越低文件越小。" },
        { q: "可以一次压缩多张图片吗？", a: "可以，上传多张图片后可全部压缩并下载为 ZIP 文件。" }
      ]
    }
  }
}

export default zh
