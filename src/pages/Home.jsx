import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { tools, categories } from '../data/tools'
import SEO from '../components/SEO'

export default function Home() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    )
  }, [search])

  const popularTools = tools.filter(t => t.popular)

  return (
    <div className="home">
      <SEO title="ToolHub - 50+ Free Online Developer Tools & Utilities" description="ToolHub provides 50+ free online developer tools including JSON formatter, JSON validator, Base64 encoder, Base64 decoder, JWT decoder, URL tools, text tools, data converters and more. Fast, secure and browser-based." />

      <div className="home-hero">
        <h1>Free Developer Tools</h1>
        <p>Fast, private and browser-based utilities. No signup required.</p>
        <div className="home-search">
          <span className="home-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered ? (
        <div className="home-section">
          <div className="home-section-title">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
          <div className="tool-grid">
            {filtered.map(tool => (
              <Link key={tool.id} to={tool.path} className="tool-card">
                <div className="tool-card-top">
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-category">{tool.category}</span>
                </div>
                <h2>{tool.name}</h2>
                <p>{tool.description}</p>
                <span className="tool-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="home-section">
            <div className="home-section-title">Popular Tools</div>
            <div className="tool-grid">
              {popularTools.map(tool => (
                <Link key={tool.id} to={tool.path} className="tool-card">
                  <div className="tool-card-top">
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-category">{tool.category}</span>
                  </div>
                  <h2>{tool.name}</h2>
                  <p>{tool.description}</p>
                  <span className="tool-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="home-section">
            <div className="home-section-title">Categories</div>
            <div className="category-grid">
              {categories.map(cat => (
                <div key={cat.name} className="category-card">
                  <div className="category-name">{cat.name}</div>
                  <div className="category-count">{cat.tools.length} tool{cat.tools.length !== 1 ? 's' : ''}</div>
                  <div className="category-tools">
                    {cat.tools.slice(0, 3).map(t => (
                      <Link key={t.id} to={t.path} className="category-tool-link">{t.name}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
