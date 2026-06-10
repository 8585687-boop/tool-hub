import { Link, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo">ToolHub</Link>
        </div>
      </header>
      <div className="layout-body">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <footer className="footer">
        <span>ToolHub — Free Online Developer Tools</span>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <span className="footer-sep">|</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  )
}
