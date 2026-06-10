export default function ColumnSelector({ columns, onToggle }) {
  return (
    <div className="ea-column-selector">
      <div className="ea-section-title">Columns</div>
      {columns.map(col => (
        <div key={col.name} className="ea-column-item">
          <label className="ea-column-label">
            <input
              type="checkbox"
              checked={col.selected}
              onChange={() => onToggle(col.name)}
            />
            <span className="ea-column-name">{col.name}</span>
          </label>
          <span className={`ea-column-type ea-type-${col.type}`}>{col.type}</span>
        </div>
      ))}
    </div>
  )
}
