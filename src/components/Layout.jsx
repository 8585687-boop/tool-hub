import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout() {
  const { t } = useTranslation()

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo">{t('siteName')}</Link>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
        </div>
      </header>
      <div className="layout-body">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <footer className="footer">
        <span>{t('footerText')}</span>
        <div className="footer-links">
          <Link to="/about">{t('about')}</Link>
          <span className="footer-sep">|</span>
          <Link to="/privacy">{t('privacyPolicy')}</Link>
        </div>
      </footer>
    </div>
  )
}
