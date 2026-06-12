const DATA_TYPES = {
  MySQL: ['INT', 'BIGINT', 'TINYINT', 'SMALLINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'VARCHAR', 'CHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'BLOB', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'BOOLEAN', 'JSON', 'ENUM'],
  PostgreSQL: ['INTEGER', 'BIGINT', 'SMALLINT', 'SERIAL', 'BIGSERIAL', 'REAL', 'DOUBLE PRECISION', 'DECIMAL', 'NUMERIC', 'VARCHAR', 'CHAR', 'TEXT', 'DATE', 'TIMESTAMP', 'TIMESTAMPTZ', 'TIME', 'BOOLEAN', 'JSON', 'JSONB', 'UUID', 'BYTEA'],
  SQLite: ['INTEGER', 'REAL', 'TEXT', 'BLOB', 'NUMERIC', 'BOOLEAN', 'VARCHAR', 'DATETIME'],
  'SQL Server': ['INT', 'BIGINT', 'TINYINT', 'SMALLINT', 'FLOAT', 'REAL', 'DECIMAL', 'NUMERIC', 'VARCHAR', 'NVARCHAR', 'CHAR', 'NCHAR', 'TEXT', 'NTEXT', 'DATE', 'DATETIME', 'DATETIME2', 'SMALLDATETIME', 'TIME', 'BIT', 'UNIQUEIDENTIFIER', 'XML'],
}

function getDefaultType(db) {
  const types = DATA_TYPES[db] || DATA_TYPES.MySQL
  return types.includes('VARCHAR') ? 'VARCHAR(255)' : types[0]
}

function needsLength(type) {
  return /^(VARCHAR|CHAR|NVARCHAR|NCHAR|DECIMAL|NUMERIC)/i.test(type)
}

function wrapValue(value, type) {
  if (value === '' || value === null || value === undefined) return 'NULL'
  if (/^(INT|BIGINT|TINYINT|SMALLINT|INTEGER|SERIAL|BIGSERIAL|FLOAT|REAL|DOUBLE|DECIMAL|NUMERIC|BIT|BOOLEAN)$/i.test(type)) {
    const num = String(value).replace(/['"]/g, '')
    if (/^-?\d+(\.\d+)?$/.test(num)) return num
    return `'${value}'`
  }
  return `'${String(value).replace(/'/g, "''")}'`
}

function generateSelect(config) {
  const { tableName, columns, where, orderBy, db } = config
  if (!tableName) return { success: false, error: 'Table name is required' }

  const selectedCols = columns.filter(c => c.name && c.selected !== false)
  const colList = selectedCols.length > 0
    ? selectedCols.map(c => c.name).join(',\n    ')
    : '*'

  let sql = `SELECT\n    ${colList}\nFROM ${tableName}`

  if (where && where.trim()) {
    sql += `\nWHERE ${where.trim()}`
  }

  if (orderBy && orderBy.trim()) {
    sql += `\nORDER BY ${orderBy.trim()}`
  }

  return { success: true, result: sql }
}

function generateInsert(config) {
  const { tableName, columns, db } = config
  if (!tableName) return { success: false, error: 'Table name is required' }

  const filledCols = columns.filter(c => c.name && c.value !== '' && c.value !== undefined)
  if (filledCols.length === 0) return { success: false, error: 'At least one column with a value is required' }

  const colNames = filledCols.map(c => c.name).join(',\n    ')
  const values = filledCols.map(c => wrapValue(c.value, c.type)).join(',\n    ')

  let sql = `INSERT INTO ${tableName}\n(\n    ${colNames}\n)\nVALUES\n(\n    ${values}\n)`

  return { success: true, result: sql }
}

function generateUpdate(config) {
  const { tableName, columns, where, db } = config
  if (!tableName) return { success: false, error: 'Table name is required' }

  const setCols = columns.filter(c => c.name && c.value !== '' && c.value !== undefined)
  if (setCols.length === 0) return { success: false, error: 'At least one column with a value is required' }

  const setClause = setCols.map(c => `${c.name} = ${wrapValue(c.value, c.type)}`).join(',\n    ')

  let sql = `UPDATE ${tableName}\nSET\n    ${setClause}`

  if (where && where.trim()) {
    sql += `\nWHERE ${where.trim()}`
  } else {
    return { success: false, error: 'WHERE clause is required for UPDATE to prevent accidental data modification' }
  }

  return { success: true, result: sql }
}

function generateDelete(config) {
  const { tableName, where, db } = config
  if (!tableName) return { success: false, error: 'Table name is required' }

  if (!where || !where.trim()) {
    return { success: false, error: 'WHERE clause is required for DELETE to prevent accidental data loss' }
  }

  let sql = `DELETE FROM ${tableName}\nWHERE ${where.trim()}`

  return { success: true, result: sql }
}

function generateCreateTable(config) {
  const { tableName, columns, db } = config
  if (!tableName) return { success: false, error: 'Table name is required' }

  const validCols = columns.filter(c => c.name && c.type)
  if (validCols.length === 0) return { success: false, error: 'At least one column is required' }

  const colDefs = validCols.map(c => {
    let def = `    ${c.name} ${c.type}`
    if (c.primaryKey) {
      if (db === 'MySQL') def += ' PRIMARY KEY AUTO_INCREMENT'
      else if (db === 'PostgreSQL') def += ' PRIMARY KEY'
      else if (db === 'SQLite') def += ' PRIMARY KEY AUTOINCREMENT'
      else if (db === 'SQL Server') def += ' PRIMARY KEY IDENTITY(1,1)'
      else def += ' PRIMARY KEY'
    }
    if (!c.nullable && !c.primaryKey) def += ' NOT NULL'
    return def
  })

  let sql = `CREATE TABLE ${tableName}\n(\n${colDefs.join(',\n')}\n)`

  return { success: true, result: sql }
}

function generateSQL(type, config) {
  switch (type) {
    case 'SELECT': return generateSelect(config)
    case 'INSERT': return generateInsert(config)
    case 'UPDATE': return generateUpdate(config)
    case 'DELETE': return generateDelete(config)
    case 'CREATE': return generateCreateTable(config)
    default: return { success: false, error: `Unknown SQL type: ${type}` }
  }
}

export { generateSQL, DATA_TYPES, getDefaultType, needsLength }
