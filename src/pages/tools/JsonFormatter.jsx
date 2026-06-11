import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { tools } from '../../data/tools'
import { formatJson, minifyJson } from '../../tools/json/formatter'
import { parseJsonError } from '../../tools/json/errorParser'

const tool = tools.find(t => t.id === 'json-formatter')

export default function JsonFormatter() {
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
    try {
      const result = formatJson(input)
      setOutput(result)
      setErrorDetail(null)
      setStatus('valid')
    } catch (e) {
      setErrorDetail(parseJsonError(e, input))
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
      toolId="json-formatter"
      seoTitle={tool.seoTitle}
      seoDescription={tool.seoDescription}
      title="JSON Formatter"
      description="Format and minify JSON"
      inputLanguage="json"
      outputLanguage="json"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      placeholder='Paste your JSON here, e.g. {"name":"Tom","age":20}'
    />
  )
}
