const AGGREGATE_FUNCTIONS = ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN']
const JOIN_TYPES = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN']
const WHERE_OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'BETWEEN', 'IS NULL', 'IS NOT NULL']
const LOGIC_OPTIONS = ['AND', 'OR']

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)
}

function makeTable(name = '', alias = '') {
  return { id: uid(), name, alias }
}

function makeColumn(tableAlias = '', name = '', aggregate = 'NONE', alias = '') {
  return { id: uid(), tableAlias, name, aggregate, alias, selected: true }
}

function makeJoin(type = 'LEFT JOIN', table = '', alias = '', onLeft = '', onRight = '') {
  return { id: uid(), type, table, alias, onLeft, onRight }
}

function makeCondition(logic = 'AND', left = '', operator = '=', right = '') {
  return { id: uid(), logic, left, operator, right }
}

function makeGroupBy(column = '') {
  return { id: uid(), column }
}

function makeHaving(logic = 'AND', aggregate = 'COUNT', column = '', operator = '>', value = '') {
  return { id: uid(), logic, aggregate, column, operator, value }
}

function makeOrderBy(column = '', direction = 'ASC') {
  return { id: uid(), column, direction }
}

function buildSelectClause(columns) {
  const selected = columns.filter(c => c.selected && c.name)
  if (selected.length === 0) return '*'

  return selected.map(c => {
    let expr = c.name
    if (c.tableAlias) expr = `${c.tableAlias}.${c.name}`
    if (c.aggregate && c.aggregate !== 'NONE') {
      expr = `${c.aggregate}(${expr})`
    }
    if (c.alias) expr += ` AS ${c.alias}`
    return expr
  }).join(',\n    ')
}

function buildFromClause(tables) {
  if (tables.length === 0) return ''
  const first = tables[0]
  let sql = first.alias ? `${first.name} ${first.alias}` : first.name
  return sql
}

function buildJoinClauses(joins) {
  return joins.filter(j => j.table).map(j => {
    let sql = `${j.type} ${j.table}`
    if (j.alias) sql += ` ${j.alias}`
    if (j.onLeft && j.onRight) sql += `\nON ${j.onLeft} = ${j.onRight}`
    return sql
  }).join('\n')
}

function buildWhereClause(conditions) {
  const valid = conditions.filter(c => c.left && c.operator)
  if (valid.length === 0) return ''

  return valid.map((c, i) => {
    let cond = ''
    if (c.operator === 'IS NULL') {
      cond = `${c.left} IS NULL`
    } else if (c.operator === 'IS NOT NULL') {
      cond = `${c.left} IS NOT NULL`
    } else if (c.operator === 'BETWEEN') {
      cond = `${c.left} BETWEEN ${c.right}`
    } else if (c.operator === 'IN') {
      cond = `${c.left} IN (${c.right})`
    } else if (c.operator === 'LIKE') {
      cond = `${c.left} LIKE '${c.right}'`
    } else {
      cond = `${c.left} ${c.operator} ${c.right}`
    }
    if (i === 0) return cond
    return `${c.logic} ${cond}`
  }).join('\n    ')
}

function buildGroupByClause(groupBy) {
  const valid = groupBy.filter(g => g.column)
  if (valid.length === 0) return ''
  return valid.map(g => g.column).join(', ')
}

function buildHavingClause(having) {
  const valid = having.filter(h => h.column && h.operator)
  if (valid.length === 0) return ''

  return valid.map((h, i) => {
    const expr = `${h.aggregate}(${h.column})`
    let cond = `${expr} ${h.operator} ${h.value}`
    if (i === 0) return cond
    return `${h.logic} ${cond}`
  }).join('\n    ')
}

function buildOrderByClause(orderBy) {
  const valid = orderBy.filter(o => o.column)
  if (valid.length === 0) return ''
  return valid.map(o => `${o.column} ${o.direction}`).join(', ')
}

function buildQuery(config) {
  const { tables, columns, joins, conditions, groupBy, having, orderBy, limit, offset } = config

  if (!tables || tables.length === 0 || !tables[0].name) {
    return { success: false, error: 'At least one table is required' }
  }

  const selectClause = buildSelectClause(columns)
  const fromClause = buildFromClause(tables)
  const joinClause = buildJoinClauses(joins)
  const whereClause = buildWhereClause(conditions)
  const groupByClause = buildGroupByClause(groupBy)
  const havingClause = buildHavingClause(having)
  const orderByClause = buildOrderByClause(orderBy)

  let sql = `SELECT\n    ${selectClause}\nFROM ${fromClause}`

  if (joinClause) sql += `\n${joinClause}`
  if (whereClause) sql += `\nWHERE ${whereClause}`
  if (groupByClause) sql += `\nGROUP BY ${groupByClause}`
  if (havingClause) sql += `\nHAVING ${havingClause}`
  if (orderByClause) sql += `\nORDER BY ${orderByClause}`
  if (limit) sql += `\nLIMIT ${limit}`
  if (offset) sql += `\nOFFSET ${offset}`

  return { success: true, result: sql }
}

export {
  buildQuery,
  AGGREGATE_FUNCTIONS,
  JOIN_TYPES,
  WHERE_OPERATORS,
  LOGIC_OPTIONS,
  makeTable,
  makeColumn,
  makeJoin,
  makeCondition,
  makeGroupBy,
  makeHaving,
  makeOrderBy,
}
