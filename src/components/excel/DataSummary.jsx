import { computeStats } from '../../tools/utils/dataAnalyzer'

export default function DataSummary({ data, columns }) {
  const numberCols = columns.filter(c => c.selected && c.type === 'number')

  return (
    <div className="ea-data-summary">
      <div className="ea-section-title">Data Summary</div>
      <div className="ea-summary-grid">
        <div className="ea-summary-stat">
          <span className="ea-summary-label">Total Rows</span>
          <span className="ea-summary-value">{data.length.toLocaleString()}</span>
        </div>
        {columns.filter(c => c.missing > 0).map(c => (
          <div key={c.name} className="ea-summary-stat ea-summary-warning">
            <span className="ea-summary-label">{c.name} missing</span>
            <span className="ea-summary-value">{c.missing}</span>
          </div>
        ))}
      </div>
      {numberCols.length > 0 && (
        <div className="ea-summary-table-wrap">
          <table className="ea-summary-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Avg</th>
                <th>Sum</th>
                <th>Min</th>
                <th>Max</th>
                <th>Median</th>
              </tr>
            </thead>
            <tbody>
              {numberCols.map(col => {
                const stats = computeStats(data, col.name)
                if (!stats) return null
                return (
                  <tr key={col.name}>
                    <td>{col.name}</td>
                    <td>{stats.avg.toLocaleString()}</td>
                    <td>{stats.sum.toLocaleString()}</td>
                    <td>{stats.min.toLocaleString()}</td>
                    <td>{stats.max.toLocaleString()}</td>
                    <td>{stats.median.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
