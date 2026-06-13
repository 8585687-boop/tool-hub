import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { pages } from '../data/tools'

const page = pages.find(p => p.id === 'privacy')

export default function Privacy() {
  const { t } = useTranslation()

  return (
    <div className="static-page">
      <SEO title={page.seoTitle} description={page.seoDescription} />
      <h1>{t('privacyTitle')}</h1>
      <p>{t('privacyP1')}</p>
      <p>{t('privacyP2')}</p>
      <p>{t('privacyP3')}</p>
      <p>{t('privacyP4')}</p>
      <p>{t('privacyP5')}</p>
    </div>
  )
}
