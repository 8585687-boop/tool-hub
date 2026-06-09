export function formatJson(input) {
  const obj = JSON.parse(input)
  return JSON.stringify(obj, null, 2)
}

export function minifyJson(input) {
  const obj = JSON.parse(input)
  return JSON.stringify(obj)
}
