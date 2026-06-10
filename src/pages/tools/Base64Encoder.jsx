import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { encodeBase64 } from '../../tools/encoding/base64Encoder'

const tool = tools.find(t => t.id === 'base64-encoder')

export default function Base64Encoder() {
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
    const result = encodeBase64(input)
    if (result.success) {
      setOutput(result.result)
      setErrorDetail(null)
      setStatus('valid')
    } else {
      setErrorDetail({ message: result.error, line: 0, column: 0, position: 0, suggestions: ['Check input for invalid characters'] })
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
      toolId="base64-encoder"
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="Base64 Encoder"
      description="Encode text to Base64"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      errorTitle="Invalid Base64"
      placeholder="Enter text to encode, e.g. Hello World"
    />
  )
}
