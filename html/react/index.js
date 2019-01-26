const { createElement } = require('react')
const parse = require('../parse')
const decodeEntities = require('../entities/decode')

const context = {}

function render(str, options = {}) {
  const nodes = typeof str==='string' ? parse(str) : str
  return renderNodes(nodes, options)
}

function renderNodes(nodes, options = {}) {
  return nodes.map((node, nodeIndex) =>
    node.type==='Element'
      ? renderTag(node.tagName, { key: nodeIndex, ...node.attributes }, node.children, options)
      : node.type==='Text'
        ? decodeEntities(node.content)
        : null // HTML Comment
  ).filter(n => n)
}

function renderTag(tagName, attributes, children, options = {}) {

  // Registered tags
  const { tags = {} } = options

  const renderedAttributes = renderAttributes(tagName, attributes, options)

  if (tags[tagName]) {
    return tags[tagName](renderedAttributes, children, {
      context,
      options,
      render: (str, childOptions = {}) => render(str, { ...options, ...childOptions })
    })
  }

  const childElements = renderNodes(children, options)

  return createElement(
    tagName,
    renderedAttributes,
    childElements && childElements.length ? childElements : null
  )
}

function renderAttributes(tagName, attributes, options = {}) {

  const { keys, ...atts } = attributes

  keys.forEach(key => atts[key] = true)

  return atts
}

module.exports = render