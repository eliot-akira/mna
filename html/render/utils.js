
function serializeAttr (attr, value = '', isXml) {
  //if (!isXml && attr === value) return attr
  if (value==='') return attr
  const text = value.toString()
  const quoteEscape = text.indexOf('\'') !== -1
  const quote = quoteEscape ? '"' : '\''
  return attr + '=' + quote + text + quote
}

function dasherize (str) {
  return str.trim()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
}

function inlineStyle (style) {
  return Object.keys(style).reduce((css, key) => {
    return `${css}; ${dasherize(key)}: ${style[key]}`
  }, '').slice(2)
}

module.exports = {
  serializeAttr, dasherize, inlineStyle
}