export function formatXML(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter XML text' }
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      return { success: false, error: parserError.textContent }
    }

    const result = prettifyXml(doc.documentElement, 0)
    return { success: true, result: result }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

function prettifyXml(node, indent) {
  const INDENT = '  '
  const lines = []
  const pad = INDENT.repeat(indent)

  if (node.nodeType === Node.DOCUMENT_NODE) {
    for (const child of node.childNodes) {
      lines.push(prettifyXml(child, indent))
    }
    return lines.filter(Boolean).join('\n')
  }

  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    return `${pad}<?${node.target} ${node.data}?>`
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${pad}<!-- ${node.data} -->`
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim()
    return text ? `${pad}${text}` : ''
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    let tag = `<${node.tagName}`

    // Attributes
    for (const attr of node.attributes) {
      tag += ` ${attr.name}="${attr.value}"`
    }

    // Check children
    const children = Array.from(node.childNodes).filter(c =>
      c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.textContent.trim())
    )

    if (children.length === 0) {
      return `${pad}${tag} />`
    }

    // Only one text child
    if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
      return `${pad}${tag}>${children[0].textContent.trim()}</${node.tagName}>`
    }

    // Multiple children
    lines.push(`${pad}${tag}>`)
    for (const child of children) {
      const childResult = prettifyXml(child, indent + 1)
      if (childResult) lines.push(childResult)
    }
    lines.push(`${pad}</${node.tagName}>`)
    return lines.join('\n')
  }

  return ''
}

export function validateXML(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter XML text' }
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      return { success: false, error: parserError.textContent }
    }
    return { success: true, result: 'Valid XML' }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export function xmlToJson(input) {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter XML text' }
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'application/xml')
    const parserError = doc.querySelector('parsererror')
    if (parserError) {
      return { success: false, error: parserError.textContent }
    }

    const obj = nodeToJson(doc.documentElement)
    const result = JSON.stringify(obj, null, 2)
    return { success: true, result }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

function nodeToJson(node) {
  const result = {}

  // Attributes as @attr
  if (node.attributes && node.attributes.length) {
    for (const attr of node.attributes) {
      result[`@${attr.name}`] = attr.value
    }
  }

  const children = Array.from(node.childNodes)
  const textContent = children
    .filter(c => c.nodeType === Node.TEXT_NODE)
    .map(c => c.textContent.trim())
    .filter(Boolean)
    .join(' ')

  const elementChildren = children.filter(c => c.nodeType === Node.ELEMENT_NODE)

  if (elementChildren.length === 0) {
    if (textContent) {
      if (Object.keys(result).length > 0) {
        result['#text'] = textContent
      } else {
        return textContent
      }
    }
    return Object.keys(result).length > 0 ? result : ''
  }

  // Group elements by tag name
  const groups = {}
  for (const child of elementChildren) {
    const name = child.tagName
    if (!groups[name]) groups[name] = []
    groups[name].push(nodeToJson(child))
  }

  for (const [name, items] of Object.entries(groups)) {
    if (items.length === 1) {
      result[name] = items[0]
    } else {
      result[name] = items
    }
  }

  if (textContent && Object.keys(result).length > 0) {
    result['#text'] = textContent
  }

  return result
}
