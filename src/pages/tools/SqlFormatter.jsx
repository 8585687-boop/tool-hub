import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Toolbar from '../../components/Toolbar'
import CodeEditor from '../../components/CodeEditor'
import SEO from '../../components/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import ToolGuide from '../../components/ToolGuide'
import RelatedTools from '../../components/RelatedTools'
import { tools } from '../../data/tools'
import { formatSQL, countKeywords } from '../../tools/format/sqlFormatter'
import { generateSQL, DATA_TYPES, getDefaultType } from '../../tools/format/sqlGenerator'
import {
  buildQuery,
  AGGREGATE_FUNCTIONS, JOIN_TYPES, WHERE_OPERATORS, LOGIC_OPTIONS,
  makeTable, makeColumn, makeJoin, makeCondition, makeGroupBy, makeHaving, makeOrderBy,
} from '../../tools/format/sqlQueryBuilder'
import { copyText } from '../../tools/utils/copyText'
import { downloadFile } from '../../tools/utils/downloadFile'

const tool = tools.find(t => t.id === 'sql-formatter')

const EXAMPLES = [
  { label: 'Simple SELECT', input: "select * from users where id=1" },
  { label: 'JOIN Query', input: "select u.name,o.order_id,o.price from users u join orders o on u.id=o.user_id where o.price>100" },
  { label: 'INSERT', input: "insert into users(name,email,age) values('Tom','tom@test.com',20)" },
  { label: 'Complex Query', input: "select u.id,u.name,count(o.id) total_orders,sum(o.amount) total_amount from users u left join orders o on u.id=o.user_id group by u.id,u.name having count(o.id)>5 order by total_amount desc" },
]

const DB_OPTIONS = ['MySQL', 'PostgreSQL', 'SQLite', 'SQL Server']
const GEN_TYPES = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE']

const HISTORY_KEY = 'devforgekit-sql-gen-history'
const MAX_HISTORY = 10

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
}

function saveHistory(entry) {
  const h = loadHistory()
  h.unshift({ ...entry, time: Date.now() })
  if (h.length > MAX_HISTORY) h.length = MAX_HISTORY
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

function timeAgo(ts) {
  const d = Date.now() - ts
  if (d < 60000) return 'just now'
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`
  return `${Math.floor(d / 86400000)}d ago`
}

// ─── Formatter Mode ───────────────────────────────────────
function FormatterMode({ input, setInput, output, setOutput, error, setError, status, setStatus, fullscreen, setFullscreen }) {
  const [mode, setMode] = useState('beautify')
  const [keywordCase, setKeywordCase] = useState('upper')
  const [addSemicolon, setAddSemicolon] = useState(true)

  const doFormat = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(null); setStatus('idle'); return }
    const r = formatSQL(input, { keywordCase, indent: true, addSemicolon, mode })
    if (r.success) { setOutput(r.result); setError(null); setStatus('valid') }
    else { setOutput(''); setError(r.error); setStatus('invalid') }
  }, [input, keywordCase, addSemicolon, mode, setOutput, setError, setStatus])

  useEffect(() => { doFormat() }, [doFormat])

  const charCount = input.length
  const lineCount = input ? input.split('\n').length : 0
  const keywordCount = countKeywords(input)
  const statusClass = status === 'valid' ? 'valid' : status === 'invalid' ? 'invalid' : 'idle'
  const statusText = status === 'valid' ? 'Formatted' : status === 'invalid' ? 'Error' : 'Ready'

  return (
    <>
      <div className="workspace-header">
        <SEO title={tool.seoTitle} description={tool.seoDescription} />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">SQL Formatter</span>
          <span className="workspace-desc">Format and beautify SQL queries</span>
          <span className={`workspace-status ${statusClass}`}>{statusText}</span>
        </div>
        <div className="toolbar"><Toolbar onClear={() => { setInput(''); setOutput(''); setError(null); setStatus('idle') }} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} /></div>
      </div>
      <div className="workspace-body sql-workspace-body">
        <div className="workspace-panel">
          <div className="panel-header"><span className="panel-label">Input SQL</span></div>
          <div className="panel-body"><CodeEditor value={input} language="sql" onChange={setInput} placeholder="Paste your SQL query here..." /></div>
        </div>
        <div className="sql-options-panel">
          <div className="sql-options-section"><span className="sql-options-label">Mode</span>
            <div className="sql-options-tabs">
              <button className={`sql-opt-tab ${mode === 'beautify' ? 'active' : ''}`} onClick={() => setMode('beautify')}>Beautify</button>
              <button className={`sql-opt-tab ${mode === 'minify' ? 'active' : ''}`} onClick={() => setMode('minify')}>Minify</button>
            </div>
          </div>
          <div className="sql-options-section"><span className="sql-options-label">Keywords</span>
            <div className="sql-options-tabs">
              <button className={`sql-opt-tab ${keywordCase === 'upper' ? 'active' : ''}`} onClick={() => setKeywordCase('upper')}>UPPERCASE</button>
              <button className={`sql-opt-tab ${keywordCase === 'lower' ? 'active' : ''}`} onClick={() => setKeywordCase('lower')}>lowercase</button>
              <button className={`sql-opt-tab ${keywordCase === 'original' ? 'active' : ''}`} onClick={() => setKeywordCase('original')}>Original</button>
            </div>
          </div>
          <div className="sql-options-section"><label className="sql-checkbox-label"><input type="checkbox" checked={addSemicolon} onChange={e => setAddSemicolon(e.target.checked)} /> Add semicolon</label></div>
          <div className="sql-options-section"><span className="sql-options-label">Examples</span>
            <div className="sql-examples">{EXAMPLES.map((ex, i) => <button key={i} className="sql-example-btn" onClick={() => setInput(ex.input)}>{ex.label}</button>)}</div>
          </div>
        </div>
        <div className="workspace-panel">
          <div className="panel-header"><span className="panel-label">Output</span>
            <div className="sql-output-actions">
              <button className="sql-action-btn" onClick={() => output && copyText(output)} disabled={!output}>Copy</button>
              <button className="sql-action-btn" onClick={() => output && downloadFile('query.sql', output)} disabled={!output}>Download .sql</button>
            </div>
          </div>
          <div className="panel-body">
            {error ? <div className="error-detail"><div className="error-detail-header"><span className="error-detail-icon">✕</span><span>Invalid SQL</span></div><div className="error-detail-section"><div className="error-detail-text">{error}</div></div></div>
              : <CodeEditor value={output} language="sql" readOnly placeholder="Formatted SQL will appear here..." />}
          </div>
        </div>
      </div>
      <div className="sql-stats-bar"><span>Characters: {charCount}</span><span>Lines: {lineCount}</span><span>Keywords: {keywordCount}</span></div>
    </>
  )
}

// ─── Simple Generator (INSERT/UPDATE/DELETE/CREATE) ───────
function makeSimpleCol(name = '', type = 'INT', nullable = true, primaryKey = false, value = '') {
  return { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10), name, type, nullable, primaryKey, value }
}

function SimpleGenerator({ db, setDb, fullscreen, setFullscreen }) {
  const [tableName, setTableName] = useState('')
  const [genType, setGenType] = useState('INSERT')
  const [columns, setColumns] = useState([makeSimpleCol('id', 'INT', false, true), makeSimpleCol('name', 'VARCHAR(100)')])
  const [where, setWhere] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(loadHistory)

  const types = DATA_TYPES[db] || DATA_TYPES.MySQL
  const addCol = () => setColumns([...columns, makeSimpleCol('', getDefaultType(db))])
  const rmCol = (id) => setColumns(columns.filter(c => c.id !== id))
  const updCol = (id, f, v) => setColumns(columns.map(c => c.id === id ? { ...c, [f]: v } : c))

  const handleGenerate = () => {
    setError(null)
    const config = { tableName, columns: columns.map(c => ({ ...c, value: c.value || '' })), where, db }
    const r = generateSQL(genType, config)
    if (r.success) {
      const f = formatSQL(r.result, { keywordCase: 'upper', indent: true, addSemicolon: true, mode: 'beautify' })
      const sql = f.success ? f.result : r.result + ';'
      setOutput(sql); saveHistory({ type: genType, table: tableName, sql }); setHistory(loadHistory())
    } else { setOutput(''); setError(r.error) }
  }

  const showWhere = genType === 'UPDATE' || genType === 'DELETE'
  const showValue = genType === 'INSERT' || genType === 'UPDATE'
  const showNullable = genType === 'CREATE'
  const showPK = genType === 'CREATE'

  return (
    <>
      <div className="workspace-header">
        <SEO title="SQL Query Generator - Free Online SQL Builder | DevForgeKit" description="Generate SQL queries online. Create SELECT, INSERT, UPDATE, DELETE and CREATE TABLE statements easily." />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">SQL Generator</span>
          <span className="workspace-desc">Generate INSERT, UPDATE, DELETE, CREATE TABLE</span>
        </div>
        <div className="toolbar"><Toolbar onClear={() => { setTableName(''); setColumns([makeSimpleCol('', getDefaultType(db))]); setWhere(''); setOutput(''); setError(null) }} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} /></div>
      </div>
      <div className="workspace-body sql-gen-body">
        <div className="sql-gen-config">
          <div className="sql-gen-row">
            <div className="sql-gen-field"><label className="sql-gen-label">Database</label><select className="sql-gen-select" value={db} onChange={e => setDb(e.target.value)}>{DB_OPTIONS.map(d => <option key={d}>{d}</option>)}</select></div>
            <div className="sql-gen-field sql-gen-field-grow"><label className="sql-gen-label">Table Name</label><input className="sql-gen-input" value={tableName} onChange={e => setTableName(e.target.value)} placeholder="e.g. users" /></div>
            <div className="sql-gen-field"><label className="sql-gen-label">Generate</label>
              <div className="sql-options-tabs">{['INSERT', 'UPDATE', 'DELETE', 'CREATE'].map(t => <button key={t} className={`sql-opt-tab ${genType === t ? 'active' : ''}`} onClick={() => setGenType(t)}>{t === 'CREATE' ? 'CREATE TABLE' : t}</button>)}</div>
            </div>
          </div>
          <div className="sql-gen-columns">
            <div className="sql-gen-columns-header">
              <span className="sql-gen-col-name">Column</span><span className="sql-gen-col-type">Type</span>
              {showNullable && <span className="sql-gen-col-bool">Nullable</span>}
              {showPK && <span className="sql-gen-col-bool">Primary</span>}
              {showValue && <span className="sql-gen-col-val">Value</span>}
              <span className="sql-gen-col-del"></span>
            </div>
            {columns.map(col => (
              <div key={col.id} className="sql-gen-columns-row">
                <input className="sql-gen-col-input sql-gen-col-name" value={col.name} onChange={e => updCol(col.id, 'name', e.target.value)} placeholder="column" />
                <select className="sql-gen-col-select sql-gen-col-type" value={col.type.replace(/\(\d+\)/, '')} onChange={e => { const b = e.target.value; updCol(col.id, 'type', /^(VARCHAR|CHAR|NVARCHAR)$/.test(b) ? b + '(255)' : b) }}>{types.map(t => <option key={t}>{t}</option>)}</select>
                {showNullable && <div className="sql-gen-col-center"><input type="checkbox" checked={col.nullable} onChange={e => updCol(col.id, 'nullable', e.target.checked)} /></div>}
                {showPK && <div className="sql-gen-col-center"><input type="checkbox" checked={col.primaryKey} onChange={e => updCol(col.id, 'primaryKey', e.target.checked)} /></div>}
                {showValue && <input className="sql-gen-col-input sql-gen-col-val" value={col.value || ''} onChange={e => updCol(col.id, 'value', e.target.value)} placeholder="value" />}
                <button className="sql-gen-del-btn" onClick={() => rmCol(col.id)}>×</button>
              </div>
            ))}
            <button className="sql-gen-add-btn" onClick={addCol}>+ Add Column</button>
          </div>
          {showWhere && <div className="sql-gen-row"><div className="sql-gen-field sql-gen-field-grow"><label className="sql-gen-label">WHERE</label><input className="sql-gen-input" value={where} onChange={e => setWhere(e.target.value)} placeholder="e.g. id = 1" /></div></div>}
          <div className="sql-gen-actions"><button className="sql-gen-generate-btn" onClick={handleGenerate}>Generate SQL</button></div>
        </div>
        <div className="workspace-panel sql-gen-output-panel">
          <div className="panel-header"><span className="panel-label">Generated SQL</span>
            <div className="sql-output-actions"><button className="sql-action-btn" onClick={() => output && copyText(output)} disabled={!output}>Copy</button><button className="sql-action-btn" onClick={() => output && downloadFile('query.sql', output)} disabled={!output}>Download .sql</button></div>
          </div>
          <div className="panel-body">{error ? <div className="error-detail"><div className="error-detail-header"><span className="error-detail-icon">✕</span><span>Error</span></div><div className="error-detail-section"><div className="error-detail-text">{error}</div></div></div> : <CodeEditor value={output} language="sql" readOnly placeholder="Click 'Generate SQL'..." />}</div>
        </div>
      </div>
      {history.length > 0 && <div className="sql-gen-history"><div className="sql-gen-history-header"><span className="sql-gen-history-title">Recent</span><button className="sql-gen-history-clear" onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }}>Clear</button></div><div className="sql-gen-history-list">{history.map((h, i) => <button key={i} className="sql-gen-history-item" onClick={() => { setOutput(h.sql); setError(null) }}><span className="sql-gen-history-type">{h.type}</span><span className="sql-gen-history-table">{h.table || 'untitled'}</span><span className="sql-gen-history-time">{timeAgo(h.time)}</span></button>)}</div></div>}
    </>
  )
}

// ─── Query Builder Mode ───────────────────────────────────
function QueryBuilderMode({ db, setDb, fullscreen, setFullscreen }) {
  const [tables, setTables] = useState([makeTable('users', 'u')])
  const [columns, setColumns] = useState([makeColumn('u', 'name', 'NONE'), makeColumn('u', 'id', 'COUNT', 'total')])
  const [joins, setJoins] = useState([makeJoin('LEFT JOIN', 'orders', 'o', 'u.id', 'o.user_id')])
  const [conditions, setConditions] = useState([makeCondition('AND', 'o.status', '=', "'paid'")])
  const [groupBy, setGroupBy] = useState([makeGroupBy('u.name')])
  const [having, setHaving] = useState([makeHaving('AND', 'COUNT', 'o.id', '>', '5')])
  const [orderBy, setOrderBy] = useState([makeOrderBy('COUNT(o.id)', 'DESC')])
  const [limit, setLimit] = useState('10')
  const [offset, setOffset] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(loadHistory)

  // Sections toggle
  const [sections, setSections] = useState({ tables: true, columns: true, joins: true, where: true, groupBy: false, having: false, orderBy: true, limit: false })

  const toggle = (key) => setSections(s => ({ ...s, [key]: !s[key] }))

  const handleBuild = () => {
    setError(null)
    const r = buildQuery({ tables, columns, joins, conditions, groupBy, having, orderBy, limit: limit || null, offset: offset || null })
    if (r.success) {
      const f = formatSQL(r.result, { keywordCase: 'upper', indent: true, addSemicolon: true, mode: 'beautify' })
      const sql = f.success ? f.result : r.result + ';'
      setOutput(sql)
      saveHistory({ type: 'SELECT', table: tables.map(t => t.name).join(','), sql })
      setHistory(loadHistory())
    } else { setOutput(''); setError(r.error) }
  }

  const handleLoadExample = () => {
    setTables([makeTable('users', 'u')])
    setColumns([makeColumn('u', 'name', 'NONE'), makeColumn('u', 'id', 'COUNT', 'total')])
    setJoins([makeJoin('LEFT JOIN', 'orders', 'o', 'u.id', 'o.user_id')])
    setConditions([makeCondition('AND', 'o.status', '=', "'paid'")])
    setGroupBy([makeGroupBy('u.name')])
    setHaving([makeHaving('AND', 'COUNT', 'o.id', '>', '5')])
    setOrderBy([makeOrderBy('COUNT(o.id)', 'DESC')])
    setLimit('10')
    setOffset('')
  }

  const addTable = () => setTables([...tables, makeTable()])
  const rmTable = (id) => setTables(tables.filter(t => t.id !== id))
  const updTable = (id, f, v) => setTables(tables.map(t => t.id === id ? { ...t, [f]: v } : t))

  const addCol = () => setColumns([...columns, makeColumn()])
  const rmCol = (id) => setColumns(columns.filter(c => c.id !== id))
  const updCol = (id, f, v) => setColumns(columns.map(c => c.id === id ? { ...c, [f]: v } : c))

  const addJoin = () => setJoins([...joins, makeJoin()])
  const rmJoin = (id) => setJoins(joins.filter(j => j.id !== id))
  const updJoin = (id, f, v) => setJoins(joins.map(j => j.id === id ? { ...j, [f]: v } : j))

  const addCond = () => setConditions([...conditions, makeCondition()])
  const rmCond = (id) => setConditions(conditions.filter(c => c.id !== id))
  const updCond = (id, f, v) => setConditions(conditions.map(c => c.id === id ? { ...c, [f]: v } : c))

  const addGB = () => setGroupBy([...groupBy, makeGroupBy()])
  const rmGB = (id) => setGroupBy(groupBy.filter(g => g.id !== id))
  const updGB = (id, v) => setGroupBy(groupBy.map(g => g.id === id ? { ...g, column: v } : g))

  const addHav = () => setHaving([...having, makeHaving()])
  const rmHav = (id) => setHaving(having.filter(h => h.id !== id))
  const updHav = (id, f, v) => setHaving(having.map(h => h.id === id ? { ...h, [f]: v } : h))

  const addOB = () => setOrderBy([...orderBy, makeOrderBy()])
  const rmOB = (id) => setOrderBy(orderBy.filter(o => o.id !== id))
  const updOB = (id, f, v) => setOrderBy(orderBy.map(o => o.id === id ? { ...o, [f]: v } : o))

  return (
    <>
      <div className="workspace-header">
        <SEO title="SQL Query Builder - Generate SQL Online | DevForgeKit" description="Build complex SQL queries online with visual query builder. Create SELECT, JOIN, WHERE, GROUP BY and advanced SQL statements." />
        <div className="workspace-info">
          <Link to="/" className="workspace-back">← Back</Link>
          <span className="workspace-title">SQL Query Builder</span>
          <span className="workspace-desc">Build complex SELECT queries visually</span>
        </div>
        <div className="toolbar"><Toolbar onClear={() => { setTables([makeTable()]); setColumns([]); setJoins([]); setConditions([]); setGroupBy([]); setHaving([]); setOrderBy([]); setLimit(''); setOffset(''); setOutput(''); setError(null) }} onFullscreen={() => setFullscreen(!fullscreen)} isFullscreen={fullscreen} /></div>
      </div>

      <div className="workspace-body sql-qb-body">
        <div className="sql-qb-config">
          {/* Database */}
          <div className="sql-qb-row">
            <div className="sql-gen-field"><label className="sql-gen-label">Database</label><select className="sql-gen-select" value={db} onChange={e => setDb(e.target.value)}>{DB_OPTIONS.map(d => <option key={d}>{d}</option>)}</select></div>
            <button className="sql-qb-example-btn" onClick={handleLoadExample}>Load Example</button>
          </div>

          {/* Tables */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('tables')}>
              <span className="sql-qb-section-toggle">{sections.tables ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">FROM - Tables</span>
              <span className="sql-qb-section-count">{tables.length}</span>
            </div>
            {sections.tables && (
              <div className="sql-qb-section-body">
                {tables.map(t => (
                  <div key={t.id} className="sql-qb-item-row">
                    <input className="sql-gen-col-input sql-qb-flex2" value={t.name} onChange={e => updTable(t.id, 'name', e.target.value)} placeholder="table_name" />
                    <input className="sql-gen-col-input sql-qb-flex1" value={t.alias} onChange={e => updTable(t.id, 'alias', e.target.value)} placeholder="alias" />
                    {tables.length > 1 && <button className="sql-gen-del-btn" onClick={() => rmTable(t.id)}>×</button>}
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addTable}>+ Add Table</button>
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('columns')}>
              <span className="sql-qb-section-toggle">{sections.columns ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">SELECT - Columns</span>
              <span className="sql-qb-section-count">{columns.filter(c => c.selected).length}</span>
            </div>
            {sections.columns && (
              <div className="sql-qb-section-body">
                {columns.map(c => (
                  <div key={c.id} className="sql-qb-item-row">
                    <div className="sql-gen-col-center"><input type="checkbox" checked={c.selected} onChange={e => updCol(c.id, 'selected', e.target.checked)} /></div>
                    <input className="sql-gen-col-input sql-qb-flex1" value={c.tableAlias} onChange={e => updCol(c.id, 'tableAlias', e.target.value)} placeholder="table.alias" />
                    <input className="sql-gen-col-input sql-qb-flex1" value={c.name} onChange={e => updCol(c.id, 'name', e.target.value)} placeholder="column" />
                    <select className="sql-gen-col-select sql-qb-agg" value={c.aggregate} onChange={e => updCol(c.id, 'aggregate', e.target.value)}>
                      <option value="NONE">-</option>
                      {AGGREGATE_FUNCTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <input className="sql-gen-col-input sql-qb-alias" value={c.alias} onChange={e => updCol(c.id, 'alias', e.target.value)} placeholder="AS" />
                    <button className="sql-gen-del-btn" onClick={() => rmCol(c.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addCol}>+ Add Column</button>
              </div>
            )}
          </div>

          {/* Joins */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('joins')}>
              <span className="sql-qb-section-toggle">{sections.joins ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">JOIN</span>
              <span className="sql-qb-section-count">{joins.length}</span>
            </div>
            {sections.joins && (
              <div className="sql-qb-section-body">
                {joins.map(j => (
                  <div key={j.id} className="sql-qb-item-row">
                    <select className="sql-gen-col-select sql-qb-join-type" value={j.type} onChange={e => updJoin(j.id, 'type', e.target.value)}>
                      {JOIN_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input className="sql-gen-col-input sql-qb-flex1" value={j.table} onChange={e => updJoin(j.id, 'table', e.target.value)} placeholder="table" />
                    <input className="sql-gen-col-input sql-qb-alias" value={j.alias} onChange={e => updJoin(j.id, 'alias', e.target.value)} placeholder="alias" />
                    <input className="sql-gen-col-input sql-qb-flex1" value={j.onLeft} onChange={e => updJoin(j.id, 'onLeft', e.target.value)} placeholder="left.id" />
                    <span className="sql-qb-eq">=</span>
                    <input className="sql-gen-col-input sql-qb-flex1" value={j.onRight} onChange={e => updJoin(j.id, 'onRight', e.target.value)} placeholder="right.id" />
                    <button className="sql-gen-del-btn" onClick={() => rmJoin(j.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addJoin}>+ Add Join</button>
              </div>
            )}
          </div>

          {/* WHERE */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('where')}>
              <span className="sql-qb-section-toggle">{sections.where ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">WHERE</span>
              <span className="sql-qb-section-count">{conditions.length}</span>
            </div>
            {sections.where && (
              <div className="sql-qb-section-body">
                {conditions.map((c, i) => (
                  <div key={c.id} className="sql-qb-item-row">
                    {i > 0 && <select className="sql-gen-col-select sql-qb-logic" value={c.logic} onChange={e => updCond(c.id, 'logic', e.target.value)}>{LOGIC_OPTIONS.map(l => <option key={l}>{l}</option>)}</select>}
                    {i === 0 && <span className="sql-qb-logic-placeholder"></span>}
                    <input className="sql-gen-col-input sql-qb-flex2" value={c.left} onChange={e => updCond(c.id, 'left', e.target.value)} placeholder="column" />
                    <select className="sql-gen-col-select sql-qb-op" value={c.operator} onChange={e => updCond(c.id, 'operator', e.target.value)}>
                      {WHERE_OPERATORS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    {!['IS NULL', 'IS NOT NULL'].includes(c.operator) && <input className="sql-gen-col-input sql-qb-flex2" value={c.right} onChange={e => updCond(c.id, 'right', e.target.value)} placeholder="value" />}
                    <button className="sql-gen-del-btn" onClick={() => rmCond(c.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addCond}>+ Add Condition</button>
              </div>
            )}
          </div>

          {/* GROUP BY */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('groupBy')}>
              <span className="sql-qb-section-toggle">{sections.groupBy ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">GROUP BY</span>
              <span className="sql-qb-section-count">{groupBy.length}</span>
            </div>
            {sections.groupBy && (
              <div className="sql-qb-section-body">
                {groupBy.map(g => (
                  <div key={g.id} className="sql-qb-item-row">
                    <input className="sql-gen-col-input sql-qb-flex2" value={g.column} onChange={e => updGB(g.id, e.target.value)} placeholder="column" />
                    <button className="sql-gen-del-btn" onClick={() => rmGB(g.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addGB}>+ Add Group By</button>
              </div>
            )}
          </div>

          {/* HAVING */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('having')}>
              <span className="sql-qb-section-toggle">{sections.having ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">HAVING</span>
              <span className="sql-qb-section-count">{having.length}</span>
            </div>
            {sections.having && (
              <div className="sql-qb-section-body">
                {having.map((h, i) => (
                  <div key={h.id} className="sql-qb-item-row">
                    {i > 0 && <select className="sql-gen-col-select sql-qb-logic" value={h.logic} onChange={e => updHav(h.id, 'logic', e.target.value)}>{LOGIC_OPTIONS.map(l => <option key={l}>{l}</option>)}</select>}
                    {i === 0 && <span className="sql-qb-logic-placeholder"></span>}
                    <select className="sql-gen-col-select sql-qb-agg" value={h.aggregate} onChange={e => updHav(h.id, 'aggregate', e.target.value)}>{AGGREGATE_FUNCTIONS.map(a => <option key={a}>{a}</option>)}</select>
                    <input className="sql-gen-col-input sql-qb-flex1" value={h.column} onChange={e => updHav(h.id, 'column', e.target.value)} placeholder="column" />
                    <select className="sql-gen-col-select sql-qb-op" value={h.operator} onChange={e => updHav(h.id, 'operator', e.target.value)}><option>=</option><option>!=</option><option>&gt;</option><option>&lt;</option><option>&gt;=</option><option>&lt;=</option></select>
                    <input className="sql-gen-col-input sql-qb-flex1" value={h.value} onChange={e => updHav(h.id, 'value', e.target.value)} placeholder="value" />
                    <button className="sql-gen-del-btn" onClick={() => rmHav(h.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addHav}>+ Add Having</button>
              </div>
            )}
          </div>

          {/* ORDER BY */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('orderBy')}>
              <span className="sql-qb-section-toggle">{sections.orderBy ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">ORDER BY</span>
              <span className="sql-qb-section-count">{orderBy.length}</span>
            </div>
            {sections.orderBy && (
              <div className="sql-qb-section-body">
                {orderBy.map(o => (
                  <div key={o.id} className="sql-qb-item-row">
                    <input className="sql-gen-col-input sql-qb-flex2" value={o.column} onChange={e => updOB(o.id, 'column', e.target.value)} placeholder="column" />
                    <select className="sql-gen-col-select sql-qb-dir" value={o.direction} onChange={e => updOB(o.id, 'direction', e.target.value)}><option>ASC</option><option>DESC</option></select>
                    <button className="sql-gen-del-btn" onClick={() => rmOB(o.id)}>×</button>
                  </div>
                ))}
                <button className="sql-gen-add-btn" onClick={addOB}>+ Add Order By</button>
              </div>
            )}
          </div>

          {/* LIMIT/OFFSET */}
          <div className="sql-qb-section">
            <div className="sql-qb-section-header" onClick={() => toggle('limit')}>
              <span className="sql-qb-section-toggle">{sections.limit ? '▾' : '▸'}</span>
              <span className="sql-qb-section-title">LIMIT / OFFSET</span>
            </div>
            {sections.limit && (
              <div className="sql-qb-section-body">
                <div className="sql-qb-item-row">
                  <label className="sql-gen-label">LIMIT</label>
                  <input className="sql-gen-col-input sql-qb-flex1" value={limit} onChange={e => setLimit(e.target.value)} placeholder="10" />
                  <label className="sql-gen-label">OFFSET</label>
                  <input className="sql-gen-col-input sql-qb-flex1" value={offset} onChange={e => setOffset(e.target.value)} placeholder="0" />
                </div>
              </div>
            )}
          </div>

          <div className="sql-gen-actions"><button className="sql-gen-generate-btn" onClick={handleBuild}>Build SQL Query</button></div>
        </div>

        <div className="workspace-panel sql-gen-output-panel">
          <div className="panel-header"><span className="panel-label">Generated SQL</span>
            <div className="sql-output-actions"><button className="sql-action-btn" onClick={() => output && copyText(output)} disabled={!output}>Copy</button><button className="sql-action-btn" onClick={() => output && downloadFile('query.sql', output)} disabled={!output}>Download .sql</button></div>
          </div>
          <div className="panel-body">{error ? <div className="error-detail"><div className="error-detail-header"><span className="error-detail-icon">✕</span><span>Error</span></div><div className="error-detail-section"><div className="error-detail-text">{error}</div></div></div> : <CodeEditor value={output} language="sql" readOnly placeholder="Click 'Build SQL Query'..." />}</div>
        </div>
      </div>

      {history.length > 0 && <div className="sql-gen-history"><div className="sql-gen-history-header"><span className="sql-gen-history-title">Recent</span><button className="sql-gen-history-clear" onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]) }}>Clear</button></div><div className="sql-gen-history-list">{history.map((h, i) => <button key={i} className="sql-gen-history-item" onClick={() => { setOutput(h.sql); setError(null) }}><span className="sql-gen-history-type">{h.type}</span><span className="sql-gen-history-table">{h.table || 'untitled'}</span><span className="sql-gen-history-time">{timeAgo(h.time)}</span></button>)}</div></div>}
    </>
  )
}

// ─── Generator Mode (tabs: Query Builder / Simple Generator) ──
function GeneratorMode({ fullscreen, setFullscreen }) {
  const [db, setDb] = useState('MySQL')
  const [genTab, setGenTab] = useState('builder')

  return (
    <>
      <div className="sql-gen-subtabs">
        <button className={`sql-mode-tab ${genTab === 'builder' ? 'active' : ''}`} onClick={() => setGenTab('builder')}>Query Builder</button>
        <button className={`sql-mode-tab ${genTab === 'simple' ? 'active' : ''}`} onClick={() => setGenTab('simple')}>Simple Generator</button>
      </div>
      {genTab === 'builder' ? <QueryBuilderMode db={db} setDb={setDb} fullscreen={fullscreen} setFullscreen={setFullscreen} /> : <SimpleGenerator db={db} setDb={setDb} fullscreen={fullscreen} setFullscreen={setFullscreen} />}
    </>
  )
}

// ─── Main Component ───────────────────────────────────────
export default function SqlFormatter() {
  const [tab, setTab] = useState('formatter')
  const [fullscreen, setFullscreen] = useState(false)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle')

  return (
    <>
    <div className="workspace" style={fullscreen ? { position: 'fixed', inset: 0, zIndex: 999, height: '100vh' } : {}}>
      <div className="sql-mode-tabs">
        <button className={`sql-mode-tab ${tab === 'formatter' ? 'active' : ''}`} onClick={() => setTab('formatter')}>Format SQL</button>
        <button className={`sql-mode-tab ${tab === 'generator' ? 'active' : ''}`} onClick={() => setTab('generator')}>Generate SQL</button>
      </div>
      {tab === 'formatter' ? (
        <FormatterMode input={input} setInput={setInput} output={output} setOutput={setOutput} error={error} setError={setError} status={status} setStatus={setStatus} fullscreen={fullscreen} setFullscreen={setFullscreen} />
      ) : (
        <GeneratorMode fullscreen={fullscreen} setFullscreen={setFullscreen} />
      )}
    </div>
      {!fullscreen && (<><Breadcrumb toolId="sql-formatter" /><ToolGuide toolId="sql-formatter" /><RelatedTools toolId="sql-formatter" /></>)}
    </>
  )
}
