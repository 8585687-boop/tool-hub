const INDENT = '  '

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'ON', 'AS',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'NATURAL',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT',
  'BETWEEN', 'LIKE', 'IS', 'NULL', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'INDEX',
  'DEFAULT', 'CHECK', 'UNIQUE', 'CONSTRAINT',
  'IF', 'BEGIN', 'COMMIT', 'ROLLBACK', 'TRANSACTION',
  'GRANT', 'REVOKE', 'WITH', 'RECURSIVE',
  'OVER', 'PARTITION', 'WINDOW', 'ROWS', 'RANGE',
  'USING', 'RETURNING',
])

const COMPOUND_KEYWORDS = [
  'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
  'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'OUTER JOIN',
  'FULL JOIN', 'CROSS JOIN', 'NATURAL JOIN',
  'GROUP BY', 'ORDER BY', 'INSERT INTO', 'DELETE FROM',
  'CREATE TABLE', 'CREATE INDEX', 'DROP TABLE', 'DROP INDEX',
  'IS NOT', 'NOT IN', 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY',
]

function tokenize(sql) {
  const tokens = []
  let i = 0
  const len = sql.length

  while (i < len) {
    if (/\s/.test(sql[i])) { i++; continue }

    if (sql[i] === '-' && sql[i + 1] === '-') {
      let end = sql.indexOf('\n', i)
      if (end === -1) end = len
      tokens.push({ type: 'comment', value: sql.slice(i, end) })
      i = end; continue
    }

    if (sql[i] === '/' && sql[i + 1] === '*') {
      let end = sql.indexOf('*/', i + 2)
      if (end === -1) end = len; else end += 2
      tokens.push({ type: 'comment', value: sql.slice(i, end) })
      i = end; continue
    }

    if (sql[i] === "'" || sql[i] === '"') {
      const quote = sql[i]
      let j = i + 1
      while (j < len) {
        if (sql[j] === quote) {
          if (sql[j + 1] === quote) { j += 2; continue }
          break
        }
        j++
      }
      tokens.push({ type: 'string', value: sql.slice(i, j + 1) })
      i = j + 1; continue
    }

    if (/\d/.test(sql[i])) {
      let j = i
      while (j < len && /[\d.]/.test(sql[j])) j++
      tokens.push({ type: 'number', value: sql.slice(i, j) })
      i = j; continue
    }

    if ('(),;.'.includes(sql[i])) {
      tokens.push({ type: 'punctuation', value: sql[i] })
      i++; continue
    }

    if ('=<>!+-*/%&|^~'.includes(sql[i])) {
      if (i + 1 < len && ['<>', '<=', '>=', '!=', '||', '&&'].includes(sql.slice(i, i + 2))) {
        tokens.push({ type: 'operator', value: sql.slice(i, i + 2) })
        i += 2; continue
      }
      tokens.push({ type: 'operator', value: sql[i] })
      i++; continue
    }

    if (/[a-zA-Z_]/.test(sql[i])) {
      let j = i
      while (j < len && /[a-zA-Z0-9_]/.test(sql[j])) j++
      const word = sql.slice(i, j)
      const upper = word.toUpperCase()
      if (KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', value: upper, original: word })
      } else {
        tokens.push({ type: 'identifier', value: word })
      }
      i = j; continue
    }

    tokens.push({ type: 'unknown', value: sql[i] })
    i++
  }

  return tokens
}

function applyKeywordCase(tokens, keywordCase) {
  if (keywordCase === 'original') {
    return tokens.map(t =>
      t.type === 'keyword' && t.original ? { ...t, value: t.original } : t
    )
  }
  return tokens.map(t => {
    if (t.type === 'keyword') {
      return { ...t, value: keywordCase === 'upper' ? t.value.toUpperCase() : t.value.toLowerCase() }
    }
    return t
  })
}

const COMMON_TYPOS = {
  'form': 'FROM',
  'selet': 'SELECT',
  'selec': 'SELECT',
  'formm': 'FROM',
  'wher': 'WHERE',
  'whree': 'WHERE',
  'orde': 'ORDER',
  'ordr': 'ORDER',
  'grop': 'GROUP',
  'gruop': 'GROUP',
  'gropu': 'GROUP',
  'insrt': 'INSERT',
  'updat': 'UPDATE',
  'delet': 'DELETE',
  'deelte': 'DELETE',
  'creat': 'CREATE',
  'vaules': 'VALUES',
  'valeus': 'VALUES',
  'joim': 'JOIN',
  'havin': 'HAVING',
  'havng': 'HAVING',
  'distinc': 'DISTINCT',
}

function validateSQL(tokens) {
  if (tokens.length === 0) return null

  // Check for common typos - identifiers that look like misspelled keywords
  for (const t of tokens) {
    if (t.type === 'identifier') {
      const lower = t.value.toLowerCase()
      if (COMMON_TYPOS[lower]) {
        return `Invalid SQL syntax. Did you mean "${COMMON_TYPOS[lower]}" instead of "${t.value}"?`
      }
    }
  }

  // Check that the query starts with a valid SQL keyword
  const first = tokens[0]
  if (first.type !== 'keyword') {
    return 'Invalid SQL syntax. Query must start with a SQL keyword (SELECT, INSERT, UPDATE, DELETE, CREATE, etc.)'
  }

  const firstKw = first.value.toUpperCase()
  const validStarts = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'WITH']
  if (!validStarts.includes(firstKw)) {
    return `Invalid SQL syntax. "${firstKw}" is not a valid start for a SQL statement.`
  }

  // Check SELECT has FROM
  if (firstKw === 'SELECT') {
    const hasFrom = tokens.some(t => t.type === 'keyword' && t.value.toUpperCase() === 'FROM')
    if (!hasFrom) {
      return 'Invalid SQL syntax. SELECT statement is missing FROM clause.'
    }
  }

  // Check INSERT has VALUES
  if (firstKw === 'INSERT') {
    const hasInto = tokens.some(t => t.type === 'keyword' && t.value.toUpperCase() === 'INTO')
    const hasValues = tokens.some(t => t.type === 'keyword' && t.value.toUpperCase() === 'VALUES')
    if (!hasInto) {
      return 'Invalid SQL syntax. INSERT statement is missing INTO keyword.'
    }
    if (!hasValues) {
      return 'Invalid SQL syntax. INSERT statement is missing VALUES clause.'
    }
  }

  // Check UPDATE has SET
  if (firstKw === 'UPDATE') {
    const hasSet = tokens.some(t => t.type === 'keyword' && t.value.toUpperCase() === 'SET')
    if (!hasSet) {
      return 'Invalid SQL syntax. UPDATE statement is missing SET clause.'
    }
  }

  return null
}

function getCompoundKeyword(tokens, idx) {
  for (const compound of COMPOUND_KEYWORDS) {
    const parts = compound.split(' ')
    if (idx + parts.length > tokens.length) continue
    let match = true
    for (let p = 0; p < parts.length; p++) {
      const t = tokens[idx + p]
      if (t.type !== 'keyword' || t.value.toUpperCase() !== parts[p]) {
        match = false; break
      }
    }
    if (match) return compound
  }
  return null
}

function formatSQL(input, options = {}) {
  const {
    keywordCase = 'upper',
    indent = true,
    addSemicolon = true,
    mode = 'beautify',
  } = options

  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter SQL query' }
  }

  try {
    let tokens = tokenize(input)

    // Basic SQL validation
    const validationError = validateSQL(tokens)
    if (validationError) {
      return { success: false, error: validationError }
    }

    if (mode === 'minify') {
      tokens = applyKeywordCase(tokens, keywordCase)
      let result = ''
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i]
        const prev = i > 0 ? tokens[i - 1] : null
        const needsSpace = prev && !(
          prev.type === 'punctuation' && prev.value !== ')'
        ) && !(
          t.type === 'punctuation' && t.value !== '('
        )
        if (needsSpace) result += ' '
        result += t.value
      }
      if (addSemicolon && !result.trimEnd().endsWith(';')) result = result.trimEnd() + ';'
      return { success: true, result: result.trim() }
    }

    // Beautify mode
    tokens = applyKeywordCase(tokens, keywordCase)

    // Build compound token list
    const cTokens = []
    for (let i = 0; i < tokens.length; i++) {
      const compound = tokens[i].type === 'keyword' ? getCompoundKeyword(tokens, i) : null
      if (compound) {
        const parts = compound.split(' ')
        const values = []
        for (let p = 0; p < parts.length; p++) {
          values.push(tokens[i + p].value)
        }
        cTokens.push({ type: 'compound', value: values.join(' '), parts: values, upper: compound })
        i += parts.length - 1
      } else {
        cTokens.push(tokens[i])
      }
    }

    const lines = []
    let indentLevel = 0
    let inSelectList = false
    let inCreateList = false
    let inValueList = false
    let inSetList = false
    let inInsertCols = false
    let parenDepth = 0
    let lastWasOpenParen = false

    const emit = (text, level) => {
      lines.push(INDENT.repeat(level) + text)
    }

    let currentClause = ''

    const flushLine = () => {
      const trimmed = currentClause.trim()
      if (trimmed) emit(trimmed, indentLevel)
      currentClause = ''
    }

    const addToLine = (val, spaceBefore = true) => {
      if (currentClause && spaceBefore) currentClause += ' '
      currentClause += val
    }

    for (let i = 0; i < cTokens.length; i++) {
      const t = cTokens[i]
      const upper = t.type === 'compound' ? t.upper : (t.type === 'keyword' ? t.value.toUpperCase() : null)

      if (t.type === 'comment') {
        flushLine()
        emit(t.value, indentLevel)
        continue
      }

      if (t.type === 'punctuation') {
        lastWasOpenParen = false
        if (t.value === '(') {
          parenDepth++
          lastWasOpenParen = true
          // Check if this opens a VALUES list, CREATE TABLE columns, INSERT columns, or function call
          if (inValueList && parenDepth === 1) {
            addToLine(' (', false)
            flushLine()
            indentLevel++
          } else if (inCreateList && parenDepth === 1) {
            addToLine(' (', false)
            flushLine()
            indentLevel++
          } else if (inInsertCols && parenDepth === 1) {
            addToLine(' (', false)
            flushLine()
            indentLevel++
          } else {
            // No space before ( for function calls: count(, varchar(
            addToLine(t.value, false)
          }
        } else if (t.value === ')') {
          if (inValueList && parenDepth === 1) {
            flushLine()
            indentLevel--
            addToLine(t.value, false)
            inValueList = false
          } else if (inCreateList && parenDepth === 1) {
            flushLine()
            indentLevel--
            addToLine(t.value, false)
            inCreateList = false
          } else if (inInsertCols && parenDepth === 1) {
            flushLine()
            indentLevel--
            addToLine(t.value, false)
            inInsertCols = false
          } else {
            addToLine(t.value, false)
          }
          parenDepth--
        } else if (t.value === ',') {
          addToLine(',', false)
          if (inSelectList || inCreateList || inValueList || inSetList || inInsertCols) {
            flushLine()
          }
        } else if (t.value === ';') {
          // handled at end
        } else if (t.value === '.') {
          addToLine(t.value, false)
        } else {
          addToLine(t.value, false)
        }
        continue
      }

      if (t.type === 'operator') {
        addToLine(t.value)
        continue
      }

      // Keywords and compound keywords
      if (t.type === 'keyword' || t.type === 'compound') {
        const kw = upper

        if (kw === 'SELECT') {
          flushLine()
          addToLine(t.value, false)
          flushLine()
          indentLevel++
          inSelectList = true
          continue
        }

        if (kw === 'FROM') {
          if (inSelectList) { flushLine(); inSelectList = false; indentLevel-- }
          if (inSetList) { flushLine(); inSetList = false; indentLevel-- }
          flushLine()
          addToLine(t.value, false)
          continue
        }

        if (kw === 'INSERT INTO') {
          flushLine()
          addToLine(t.value, false)
          inInsertCols = true
          continue
        }

        if (kw === 'VALUES') {
          if (inSelectList) { flushLine(); inSelectList = false; indentLevel-- }
          flushLine()
          addToLine(t.value, false)
          inValueList = true
          continue
        }

        if (kw === 'UPDATE') {
          flushLine()
          addToLine(t.value, false)
          continue
        }

        if (kw === 'SET') {
          flushLine()
          addToLine(t.value, false)
          flushLine()
          indentLevel++
          inSetList = true
          continue
        }

        if (kw === 'DELETE FROM') {
          flushLine()
          addToLine(t.value, false)
          continue
        }

        if (kw === 'CREATE TABLE') {
          flushLine()
          addToLine(t.value, false)
          inCreateList = true
          continue
        }

        if (kw === 'WHERE') {
          if (inSelectList) { flushLine(); inSelectList = false; indentLevel-- }
          if (inSetList) { flushLine(); inSetList = false; indentLevel-- }
          flushLine()
          addToLine(t.value, false)
          continue
        }

        if (kw === 'AND' || kw === 'OR') {
          flushLine()
          addToLine(t.value, false)
          continue
        }

        // JOIN variants, ON, GROUP BY, HAVING, ORDER BY, LIMIT, etc.
        if (
          kw.endsWith('JOIN') || kw === 'ON' ||
          kw === 'GROUP BY' || kw === 'HAVING' || kw === 'ORDER BY' ||
          kw === 'LIMIT' || kw === 'OFFSET' || kw === 'UNION'
        ) {
          if (inSelectList) { flushLine(); inSelectList = false; indentLevel-- }
          if (inSetList) { flushLine(); inSetList = false; indentLevel-- }
          flushLine()
          addToLine(t.value, false)
          continue
        }

        // Other keywords (AS, NOT, IN, etc.)
        addToLine(t.value)
        continue
      }

      // Identifier, string, number
      // No space after dot or open paren
      const afterDot = i > 0 && cTokens[i - 1].type === 'punctuation' && cTokens[i - 1].value === '.'
      addToLine(t.value, !afterDot && !lastWasOpenParen)
      lastWasOpenParen = false
    }

    flushLine()

    let result = lines.join('\n')
    if (addSemicolon && !result.trimEnd().endsWith(';')) {
      result = result.trimEnd() + ';'
    }
    if (!indent) {
      result = result.replace(/\n\s*/g, ' ')
    }

    return { success: true, result }
  } catch (e) {
    return { success: false, error: 'Unable to format SQL. Please check your query syntax.' }
  }
}

function countKeywords(input) {
  if (!input || !input.trim()) return 0
  try {
    const tokens = tokenize(input)
    return tokens.filter(t => t.type === 'keyword').length
  } catch {
    return 0
  }
}

export { formatSQL, tokenize, countKeywords, KEYWORDS }
