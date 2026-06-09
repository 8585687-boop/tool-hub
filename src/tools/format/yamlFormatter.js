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
    const result = JSON.stringify(obj, null, 2)
    return { success: true, result }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
