import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { decodeUrl } from '../../tools/url/urlDecoder'

const tool = tools.find(t => t.id === 'url-decoder')

export default function UrlDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [errorDetail, setErrorDetail] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setErrorDetail(null)
      setStatus('idle')
      return
    }
    const result = decodeUrl(input.trim())
    if (result.success) {
      setOutput(result.result)
      setErrorDetail(null)
      setStatus('valid')
    } else {
      setErrorDetail({ message: result.error, line: 0, column: 0, position: 0, suggestions: ['Check for invalid percent-encoding (e.g. %XX where XX is not a valid hex)', 'Make sure all % characters are followed by two hex digits'] })
      setOutput('')
      setStatus('invalid')
    }
  }, [input])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setErrorDetail(null)
    setStatus('idle')
  }

  return (
    <ToolWorkspace
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="URL Decoder"
      description="Decode URL-encoded text"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      errorTitle="Decoding Error"
      placeholder="Paste URL-encoded text, e.g. hello%20world%3Fname%3DTom"
    />
  )
}
