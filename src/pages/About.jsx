import SEO from '../components/SEO'
import { pages } from '../data/tools'

const page = pages.find(p => p.id === 'about')

export default function About() {
  return (
    <div className="static-page">
      <SEO title={page.seoTitle} description={page.seoDescription} />
      <h1>About ToolHub</h1>
      <p>ToolHub is a collection of free online developer tools.</p>
      <p>All tools run entirely in your browser — no data is sent to servers.</p>
      <p>No login, no installation, no limits.</p>
      <p>Built for developers, by developers.</p>
    </div>
  )
}
