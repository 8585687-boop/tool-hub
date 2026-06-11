import { Helmet } from "react-helmet-async"
import { useLocation } from "react-router-dom"

const SITE_URL = "https://devforgekit.com"

export default function SEO({ title, description }) {
  const { pathname } = useLocation()
  const url = `${SITE_URL}${pathname}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </Helmet>
  )
}
