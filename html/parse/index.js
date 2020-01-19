import lexer from './lexer'
import parser from './parser'
import { format } from './formats'
import * as parseContext from '../context'

const parseDefaults = {
  format, // transform for v0 spec
  ...parseContext
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

export default parse