import { Link } from 'react-router-dom'
import { tools } from '../data/tools'

export default function Breadcrumb({ toolId }) {
  const tool = tools.find(t => t.id === toolId)
  if (!tool) return null

  return (
    <nav className="breadcrumb">
      <Link to="/">Home</Link>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-category">{tool.category}</span>
      <span className="breadcrumb-sep">/</span>
      <span className="breadcrumb-current">{tool.name}</span>
    </nav>
  )
}
