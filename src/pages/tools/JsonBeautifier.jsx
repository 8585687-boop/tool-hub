import { useState, useEffect } from 'react'
import ToolWorkspace from '../../components/ToolWorkspace'
import { beautifyJSON } from '../../tools/json/beautifier'
import { parseJsonError } from '../../tools/json/errorParser'

export default function JsonBeautifier() {
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
    const result = beautifyJSON(input)
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
      title="JSON Beautifier"
      description="Beautify JSON with 4-space indent"
      status={status}
      input={input}
      output={output}
      onInputChange={setInput}
      onClear={handleClear}
      errorDetail={errorDetail}
      placeholder='Paste your JSON to beautify, e.g. {"name":"Tom","age":20}'
    />
  )
}
