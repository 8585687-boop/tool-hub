const CHART_TYPES = ['Bar', 'Line', 'Pie', 'Area', 'Scatter', 'Radar']
const AGG_METHODS = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'max', label: 'Max' },
  { value: 'min', label: 'Min' }
]

export default function ChartBuilder({ columns, config, onChange }) {
  const selectedCols = columns.filter(c => c.selected)
  const xOptions = selectedCols
  const yOptions = selectedCols.filter(c => c.type === 'number')

  const update = (key, value) => {
    onChange({ ...config, [key]: value })
  }

  const toggleY = (colName) => {
    const current = config.yFields || []
    const next = current.includes(colName)
      ? current.filter(c => c !== colName)
      : [...current, colName]
    update('yFields', next)
  }

  return (
    <div className="ea-chart-builder">
      <div className="ea-section-title">Chart Builder</div>

      <div className="ea-builder-field">
        <label>X Axis</label>
        <select value={config.xField || ''} onChange={e => update('xField', e.target.value)}>
          <option value="">Select...</option>
          {xOptions.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="ea-builder-field">
        <label>Y Axis</label>
        <div className="ea-y-checkboxes">
          {yOptions.map(c => (
            <label key={c.name} className="ea-y-check">
              <input
                type="checkbox"
                checked={(config.yFields || []).includes(c.name)}
                onChange={() => toggleY(c.name)}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="ea-builder-field">
        <label>Aggregation</label>
        <div className="ea-agg-options">
          {AGG_METHODS.map(m => (
            <label key={m.value} className="ea-agg-radio">
              <input
                type="radio"
                name="agg"
                value={m.value}
                checked={config.method === m.value}
                onChange={() => update('method', m.value)}
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="ea-builder-field">
        <label>Chart Type</label>
        <div className="ea-chart-types">
          {CHART_TYPES.map(t => (
            <button
              key={t}
              className={`ea-chart-type-btn ${config.chartType === t ? 'active' : ''}`}
              onClick={() => update('chartType', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
