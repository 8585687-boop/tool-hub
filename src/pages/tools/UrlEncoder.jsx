import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { encodeUrl } from '../../tools/url/urlEncoder'

const tool = tools.find(t => t.id === 'url-encoder')

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [errorDetail, setErrorDetail] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (!input) {
      setOutput('')
      setErrorDetail(null)
      setStatus('idle')
      return
    }
    const result = encodeUrl(input)
    if (result.success) {
      setOutput(result.result)
      setErrorDetail(null)
      setStatus('valid')
    } else {
      setErrorDetail({ message: result.error, line: 0, column: 0, position: 0, suggestions: ['Check for invalid input characters'] })
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
      toolId="url-encoder"
      inputLanguage="plaintext"
      outputLanguage="plaintext"
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="URL Encoder"
      description="Encode text to URL-safe format"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      errorTitle="Encoding Error"
      placeholder="Enter text to encode, e.g. hello world?name=Tom&age=20"
    />
  )
}
