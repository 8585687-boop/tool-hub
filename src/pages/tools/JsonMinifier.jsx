import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { minifyJSON } from '../../tools/json/minifier'
import { parseJsonError } from '../../tools/json/errorParser'

const tool = tools.find(t => t.id === 'json-minifier')

export default function JsonMinifier() {
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
    const result = minifyJSON(input)
    if (result.success) {
      setOutput(result.result)
      setErrorDetail(null)
      setStatus('valid')
    } else {
      try {
        JSON.parse(input)
      } catch (e) {
        setErrorDetail(parseJsonError(e, input))
      }
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
      toolId="json-minifier"
      inputLanguage="json"
      outputLanguage="json"
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="JSON Minifier"
      description="Compress JSON, remove whitespace"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      placeholder='Paste your JSON to minify, e.g. {\n  "name": "Tom",\n  "age": 20\n}'
    />
  )
}
