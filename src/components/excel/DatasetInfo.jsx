export default function DatasetInfo({ fileName, rows, columns, sheets, currentSheet, onSheetChange }) {
  return (
    <div className="ea-dataset-info">
      <div className="ea-info-title">{fileName}</div>
      <div className="ea-info-stats">
        <div className="ea-info-stat">
          <span className="ea-info-label">Rows</span>
          <span className="ea-info-value">{rows.toLocaleString()}</span>
        </div>
        <div className="ea-info-stat">
          <span className="ea-info-label">Columns</span>
          <span className="ea-info-value">{columns}</span>
        </div>
        {sheets.length > 1 && (
          <div className="ea-info-stat">
            <span className="ea-info-label">Sheet</span>
            <select
              className="ea-sheet-select"
              value={currentSheet}
              onChange={(e) => onSheetChange(e.target.value)}
            >
              {sheets.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
