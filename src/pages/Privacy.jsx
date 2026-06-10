import SEO from '../components/SEO'
import { pages } from '../data/tools'

const page = pages.find(p => p.id === 'privacy')

export default function Privacy() {
  return (
    <div className="static-page">
      <SEO title={page.seoTitle} description={page.seoDescription} />
      <h1>Privacy Policy</h1>
      <p>ToolHub does not collect, store, or upload any of your input data.</p>
      <p>All processing happens locally in your browser.</p>
      <p>We may use anonymous analytics (Cloudflare) to improve performance and user experience.</p>
      <p>No personal information is collected.</p>
      <p>If you have questions, contact us.</p>
    </div>
  )
}
