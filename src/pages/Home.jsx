import { tools } from '../data/tools'
import ToolCard from '../components/ToolCard'

export default function Home() {
  const categories = [...new Set(tools.map(t => t.category))]

  return (
    <div className="home">
      <div className="home-hero">
        <h1>ToolHub</h1>
        <p>Free online developer tools. Fast, simple, no signup.</p>
      </div>
      {categories.map(cat => (
        <div key={cat}>
          <div className="home-section-title">{cat}</div>
          <div className="tool-grid">
            {tools.filter(t => t.category === cat).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
