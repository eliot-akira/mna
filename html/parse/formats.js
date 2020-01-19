import { startsWith } from '../utils'

function format (nodes, options = {}) {

  return nodes.map(node => {

    const type = capitalize(node.type)

    if (type === 'Element') {

      const tagName = node.tagName.toLowerCase()
      const attributes = formatAttributes(node.attributes, options)
      const children = format(node.children, options)

      return { type, tagName, attributes, children }
    }

    if (type === 'Text' && options.trim) {
      node.content = node.content.trim()
      if (!node.content || !node.content.length) return
    }

    return { type, content: node.content }

  }).filter(n => n ? true : false)
}

function formatAttributes (attributes, options = {}) {

  const obj = !options.ignoreEmptyKeys ? { keys: [] } : {}

  return attributes.reduce((attrs, pair) => {

    let [key, value] = splitHead(pair.trim(), '=')

    if (typeof value!=='undefined') {
      value = unquote(value)
      if (key === 'class') {

        attrs.className = value
        //attrs.className = value.split(' ')

      } else if (key === 'style') {

        attrs.style = formatStyles(value)

      } else if (startsWith(key, 'data-')) {

        attrs.dataset = attrs.dataset || {}
        const prop = camelCase(key.slice(5))
        attrs.dataset[prop] = castValue(value)

      } else {

        // Handle checked="", disabled=""
        if (value==='' && (
          key==='checked' || key==='disabled'
        )) value = true

        attrs[camelCase(key)] = value // castValue(value)
      }

      //attrs[key] = value

    } else if (!options.ignoreEmptyKeys) {
      // Attributes without value
      // "keys" must be ignored in render/renderAttributes
      attrs.keys.push(key)
    }

    return attrs
  }, obj)
}

function formatStyles (str) {
  return str.trim().split(';')
    .map(rule => rule.trim().split(':'))
    .reduce((styles, keyValue) => {
      const [rawKey, rawValue] = keyValue
      if (rawValue) {
        const key = camelCase(rawKey.trim())
        const value = castValue(rawValue.trim())
        styles[key] = value
      }
      return styles
    }, {})
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function camelCase (str) {
  return str.split('-').reduce((str, word) => {
    return str + word.charAt(0).toUpperCase() + word.slice(1)
  })
}

function castValue (str) {
  if (typeof str !== 'string') return str
  if (str === '') return str
  const num = +str
  if (!isNaN(num)) return num
  return str
}

function unquote (str) {
  const car = str.charAt(0)
  const end = str.length - 1
  const isQuoteStart = car === '"' || car === "'"
  if (isQuoteStart && car === str.charAt(end)) {
    return str.slice(1, end)
  }
  return str
}

function splitHead (str, sep) {
  const idx = str.indexOf(sep)
  if (idx === -1) return [str]
  return [str.slice(0, idx), str.slice(idx + sep.length)]
}

export {
  format, formatAttributes, formatStyles,
  unquote, capitalize, camelCase, castValue, splitHead
}
