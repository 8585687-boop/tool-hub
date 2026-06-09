import { Link, Outlet, useLocation } from 'react-router-dom'

const categories = [
  { label: 'Developer Tools', path: '/' },
]

export default function Layout() {
  const location = useLocation()
  const isToolPage = location.pathname !== '/'

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo">ToolHub</Link>
          <nav className="header-nav">
            {categories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className={location.pathname === cat.path ? 'active' : ''}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      {!isToolPage && (
        <footer className="footer">
          ToolHub — Free Online Developer Tools
        </footer>
      )}
    </div>
  )
}
