import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { pages } from '../data/tools'

const page = pages.find(p => p.id === 'about')

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="static-page">
      <SEO title={page.seoTitle} description={page.seoDescription} />
      <h1>{t('aboutTitle')}</h1>
      <p>{t('aboutP1')}</p>
      <p>{t('aboutP2')}</p>
      <p>{t('aboutP3')}</p>
      <p>{t('aboutP4')}</p>
    </div>
  )
}
