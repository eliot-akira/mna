const lexer = require('./lexer')
const parser = require('./parser')
const { format } = require('./formats')

const parseDefaults = {
  format, // transform for v0 spec
  ...require('../context')
}

function parse(str = '', userOptions = {}) {

  const options = {
    ...parseDefaults,
    ...userOptions
  }

  const tokens = lexer(str, options)
  const nodes = parser(tokens, options)

  return format(nodes, options)
}

module.exports = parse