/**
 * JSON Schema Validator
 * Validates JSON data against a JSON Schema.
 * Supports: type, required, properties, items, enum, pattern, minimum, maximum, minLength, maxLength
 */

function validateType(value, schemaType) {
  if (Array.isArray(schemaType)) {
    return schemaType.some(t => validateType(value, t))
  }
  switch (schemaType) {
    case 'string': return typeof value === 'string'
    case 'number': return typeof value === 'number' && !Number.isNaN(value)
    case 'integer': return Number.isInteger(value)
    case 'boolean': return typeof value === 'boolean'
    case 'null': return value === null
    case 'array': return Array.isArray(value)
    case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value)
    default: return true
  }
}

function typeOf(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function validate(data, schema, path) {
  const errors = []

  if (!schema || typeof schema !== 'object') return errors

  // type
  if (schema.type !== undefined) {
    if (!validateType(data, schema.type)) {
      const expected = Array.isArray(schema.type) ? schema.type.join(' or ') : schema.type
      errors.push({
        path,
        message: `Expected ${expected}`,
        received: typeOf(data),
        value: data,
      })
      return errors // stop further validation if type mismatch
    }
  }

  // enum
  if (schema.enum !== undefined) {
    if (!schema.enum.includes(data)) {
      errors.push({
        path,
        message: `Value must be one of: ${schema.enum.join(', ')}`,
        received: String(data),
        value: data,
      })
    }
  }

  // pattern (for strings)
  if (schema.pattern !== undefined && typeof data === 'string') {
    const re = new RegExp(schema.pattern)
    if (!re.test(data)) {
      errors.push({
        path,
        message: `String does not match pattern: ${schema.pattern}`,
        received: data,
        value: data,
      })
    }
  }

  // minLength / maxLength (for strings)
  if (typeof data === 'string') {
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      errors.push({
        path,
        message: `String length is less than ${schema.minLength}`,
        received: `length: ${data.length}`,
        value: data,
      })
    }
    if (schema.maxLength !== undefined && data.length > schema.maxLength) {
      errors.push({
        path,
        message: `String length is greater than ${schema.maxLength}`,
        received: `length: ${data.length}`,
        value: data,
      })
    }
  }

  // minimum / maximum (for numbers)
  if (typeof data === 'number') {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push({
        path,
        message: `Value must be >= ${schema.minimum}`,
        received: String(data),
        value: data,
      })
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push({
        path,
        message: `Value must be <= ${schema.maximum}`,
        received: String(data),
        value: data,
      })
    }
    if (schema.exclusiveMinimum !== undefined && data <= schema.exclusiveMinimum) {
      errors.push({
        path,
        message: `Value must be > ${schema.exclusiveMinimum}`,
        received: String(data),
        value: data,
      })
    }
    if (schema.exclusiveMaximum !== undefined && data >= schema.exclusiveMaximum) {
      errors.push({
        path,
        message: `Value must be < ${schema.exclusiveMaximum}`,
        received: String(data),
        value: data,
      })
    }
  }

  // Object validation
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // required
    if (schema.required !== undefined && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push({
            path: path ? `${path}.${field}` : `$.${field}`,
            message: `Missing required property: ${field}`,
            received: 'undefined',
            value: undefined,
          })
        }
      }
    }

    // properties
    if (schema.properties !== undefined && typeof schema.properties === 'object') {
      for (const key of Object.keys(data)) {
        if (schema.properties[key]) {
          const subPath = path ? `${path}.${key}` : `$.${key}`
          errors.push(...validate(data[key], schema.properties[key], subPath))
        }
      }
    }

    // additionalProperties
    if (schema.additionalProperties === false && schema.properties !== undefined) {
      for (const key of Object.keys(data)) {
        if (!(key in schema.properties)) {
          errors.push({
            path: path ? `${path}.${key}` : `$.${key}`,
            message: `Additional property not allowed: ${key}`,
            received: key,
            value: data[key],
          })
        }
      }
    }
  }

  // Array validation
  if (Array.isArray(data)) {
    // items
    if (schema.items !== undefined) {
      for (let i = 0; i < data.length; i++) {
        const subPath = path ? `${path}[${i}]` : `$[${i}]`
        errors.push(...validate(data[i], schema.items, subPath))
      }
    }

    // minItems / maxItems
    if (schema.minItems !== undefined && data.length < schema.minItems) {
      errors.push({
        path,
        message: `Array must have at least ${schema.minItems} items`,
        received: `length: ${data.length}`,
        value: data,
      })
    }
    if (schema.maxItems !== undefined && data.length > schema.maxItems) {
      errors.push({
        path,
        message: `Array must have at most ${schema.maxItems} items`,
        received: `length: ${data.length}`,
        value: data,
      })
    }
  }

  return errors
}

/**
 * Validate JSON data against a JSON Schema
 * @param {string} schemaStr - JSON Schema string
 * @param {string} dataStr - JSON data string
 * @returns {{ success: boolean, errors: Array, parsedSchema?: object, parsedData?: object }}
 */
export function validateJsonSchema(schemaStr, dataStr) {
  // Parse schema
  let schema
  try {
    schema = JSON.parse(schemaStr)
  } catch (e) {
    return { success: false, errors: [{ path: '$', message: `Invalid JSON Schema: ${e.message}`, received: '', value: '' }] }
  }

  // Parse data
  let data
  try {
    data = JSON.parse(dataStr)
  } catch (e) {
    return { success: false, errors: [{ path: '$', message: `Invalid JSON Data: ${e.message}`, received: '', value: '' }] }
  }

  // Validate
  const errors = validate(data, schema, '$')

  if (errors.length === 0) {
    return { success: true, errors: [], parsedSchema: schema, parsedData: data }
  }

  return { success: false, errors, parsedSchema: schema, parsedData: data }
}

// Templates
export const SCHEMA_TEMPLATES = {
  user: {
    label: 'User Schema',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', pattern: '^[^@]+@[^@]+\\.[^@]+$' },
        age: { type: 'number', minimum: 0, maximum: 150 },
        role: { enum: ['admin', 'user', 'guest'] },
      },
      required: ['name', 'email'],
    }, null, 2),
    data: JSON.stringify({
      name: 'Tom',
      email: 'tom@test.com',
      age: 25,
      role: 'admin',
    }, null, 2),
  },
  product: {
    label: 'Product Schema',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 200 },
        price: { type: 'number', minimum: 0 },
        tags: { type: 'array', items: { type: 'string' } },
        inStock: { type: 'boolean' },
      },
      required: ['id', 'name', 'price'],
    }, null, 2),
    data: JSON.stringify({
      id: 1,
      name: 'Laptop',
      price: 999.99,
      tags: ['electronics', 'computer'],
      inStock: true,
    }, null, 2),
  },
  api: {
    label: 'API Response Schema',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        status: { enum: ['success', 'error'] },
        code: { type: 'integer' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
            roles: { type: 'array', items: { type: 'string' } },
          },
          required: ['id', 'user'],
        },
      },
      required: ['status', 'code'],
    }, null, 2),
    data: JSON.stringify({
      status: 'success',
      code: 200,
      data: {
        id: 1,
        user: {
          name: 'Tom',
          email: 'tom@test.com',
        },
        roles: ['admin', 'user'],
      },
    }, null, 2),
  },
}
