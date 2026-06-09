export default function LineOutput({ text, isError }) {
  if (!text) {
    return (
      <div className="line-output">
        <div className="line-output-line">
          <span className="line-output-num">1</span>
          <span className="line-output-content placeholder">Result will appear here...</span>
        </div>
      </div>
    )
  }

  const lines = text.split('\n')

  return (
    <div className={`line-output ${isError ? 'error' : ''}`}>
      {lines.map((line, i) => (
        <div key={i} className="line-output-line">
          <span className="line-output-num">{i + 1}</span>
          <span className="line-output-content">{line || ' '}</span>
        </div>
      ))}
    </div>
  )
}
