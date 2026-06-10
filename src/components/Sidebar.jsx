import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categories } from '../data/tools'

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState({})

  const toggle = (name) => {
    setCollapsed(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <aside className="sidebar">
      <Link to="/" className={`sidebar-item ${location.pathname === '/' ? 'active' : ''}`}>
        <span className="sidebar-icon">🏠</span>
        <span>Home</span>
      </Link>
      <div className="sidebar-divider" />
      {categories.map(cat => (
        <div key={cat.name} className="sidebar-group">
          <div className="sidebar-group-title" onClick={() => toggle(cat.name)}>
            <span>{cat.name}</span>
            <span className="sidebar-arrow">{collapsed[cat.name] ? '›' : '‹'}</span>
          </div>
          {!collapsed[cat.name] && cat.tools.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className={`sidebar-item ${location.pathname === tool.path ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{tool.icon}</span>
              <span>{tool.name}</span>
            </Link>
          ))}
        </div>
      ))}
    </aside>
  )
}
