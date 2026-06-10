import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { decodeBase64 } from '../../tools/encoding/base64Decoder'

const tool = tools.find(t => t.id === 'base64-decoder')

export default function Base64Decoder() {
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
    const result = decodeBase64(input.trim())
    if (result.success) {
      setOutput(result.result)
      setErrorDetail(null)
      setStatus('valid')
    } else {
      setErrorDetail({ message: result.error, line: 0, column: 0, position: 0, suggestions: ['Check for invalid Base64 characters (only A-Z, a-z, 0-9, +, /, = are allowed)', 'Make sure the input is a valid Base64 string'] })
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
      toolId="base64-decoder"
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="Base64 Decoder"
      description="Decode Base64 to text"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      errorTitle="Invalid Base64"
      placeholder="Paste Base64 string here, e.g. SGVsbG8gV29ybGQ="
    />
  )
}
