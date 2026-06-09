import { Link } from 'react-router-dom'

export default function ToolCard({ tool }) {
  return (
    <Link to={tool.path} className="tool-card">
      <div className="tool-card-top">
        <span className="tool-icon">{tool.icon}</span>
        <span className="tool-category">{tool.category}</span>
      </div>
      <h2>{tool.name}</h2>
      <p>{tool.description}</p>
      <span className="tool-arrow">→</span>
    </Link>
  )
}
