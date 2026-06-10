import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function RelatedTools({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  if (!tool) return null

  const related = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="related-tools">
      <div className="related-tools-title">Related Tools</div>
      <div className="related-tools-grid">
        {related.map(t => (
          <Link key={t.id} to={t.path} className="related-tool-card">
            <span className="related-tool-icon">{t.icon}</span>
            <div className="related-tool-info">
              <div className="related-tool-name">{t.name}</div>
              <div className="related-tool-desc">{t.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
