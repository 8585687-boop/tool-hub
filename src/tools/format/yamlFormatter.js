import jsyaml from 'js-yaml'

export function formatYAML(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter YAML text' }
  }

  try {
    const obj = jsyaml.load(input, { schema: jsyaml.DEFAULT_SCHEMA })
    if (obj === undefined) {
      return { success: false, error: 'Empty YAML document' }
    }
    const result = jsyaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true })
    return { success: true, result }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export function validateYAML(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter YAML text' }
  }

  try {
    jsyaml.load(input, { schema: jsyaml.DEFAULT_SCHEMA })
    return { success: true, result: 'Valid YAML' }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export function yamlToJson(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter YAML text' }
  }

  try {
    const obj = jsyaml.load(input, { schema: jsyaml.DEFAULT_SCHEMA })
    if (obj === undefined) {
      return { success: false, error: 'Empty YAML document' }
    }
    const result = JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) return value.toISOString()
      if (value instanceof Int8Array || value instanceof Uint8Array) return Array.from(value)
      if (typeof value === 'bigint') return value.toString()
      if (typeof value === 'undefined') return null
      return value
    }, 2)
    return { success: true, result }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
