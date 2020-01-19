import paul from '../paul'
import { stringIncludes, arrayIncludes } from '../utils'
import * as defaultContext from '../context'

import parse from '../parse'
import { serializeAttr, dasherize, inlineStyle } from './utils'

async function render(source, options = {}) {

  const context = { ...defaultContext, ...options }
  const nodes = typeof source==='string' ? parse(source, context) : source

  return await renderNodes(nodes, context)
}

async function renderNodes(nodes, options = {}) {
  let result = ''
  for (const node of nodes) {
    result += await renderNode(node, options)
  }
  return result
}

async function renderNode(node, options = {}) {

  const {
    type,
    tagName,
    attributes,
    children,
    content
  } = node

  if (type === 'Text') return await renderTextNode(content, options)
  if (type === 'Comment') return await renderCommentNode(content, options)

  if (!tagName) return ''

  return await renderTag(tagName, attributes, children, options)
}

function renderTextNode(content, options) {
  return content
}

function renderCommentNode(content, options) {
  return `<!--${ content }-->`
}

async function renderTag(tagName, attributes, children, options = {}) {

  const context = { ...defaultContext, ...options }
  const { voidTags, isXml } = context

  if (!options.tags || !options.tags[tagName]) {
    return await renderRawTag(tagName, attributes, children, context)
  }

  // Tag functions

  return await options.tags[tagName](attributes, children, context)
}


async function renderRawTag(tagName, attributes, children, options) {

  const context = { ...defaultContext, ...options }
  const { voidTags, isXml } = context

  let tag = '<' + tagName
  tag += await renderAttributes(attributes, options)
  tag += '>'

  const autoClose = !options.isXml && arrayIncludes(voidTags, tagName.toLowerCase())
  if (autoClose) return tag

  const innerds = await renderNodes(children, options)

  return tag + innerds + `</${tagName}>`
}

async function renderAttributes(attributes, options) {

  const context = { ...defaultContext, ...options }
  const { isXml } = context

  let result = ''

  for (const attr in attributes) {

    let val = attributes[attr]

    if (attr === 'dataset') {
      for (const prop in val) {
        const key = 'data-' + dasherize(prop)
        result += ' ' + serializeAttr(key, val[prop], isXml)
      }
      continue
    }

    if (attr === 'style') {
      result += ' ' + serializeAttr(attr, inlineStyle(val))
      continue
    }

    if (attr === 'className') {
      result += ' ' + serializeAttr('class', val.join(' '))
      continue
    }

    // Attribtues without value - See parse/formats/formatAttributes
    if (attr==='keys') {
      if (val.length) result += ' '+(val.join(' '))
      continue
    }

    // Render tags in attribute value

    if (typeof val==='string') {

      val = val
        .replace(/{/g, '<')
        .replace(/}/g, '>')
        .replace(/<</g, '{')
        .replace(/>>/g, '}')

      val = await render(val, context)
    }

    // TODO: Filter attributes

    result += ' ' + serializeAttr(dasherize(attr), val, isXml)
  }

  return result
}

Object.assign(defaultContext, {
  render,
  renderTag,
  renderRawTag,
  renderAttributes
})

export default render