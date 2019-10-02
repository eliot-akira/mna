import convert from '@mna/html/react'
import * as defaultTags from './tags'

export const globalTags = {}
export const addTags = tags => Object.assign(globalTags, tags)

export default function htmr(post, options = {}) {

  const { tags = {}, ...convertOptions } = options

  const context = {
    nodeIndex: 0
  }

  return convert(post, {
    context,
    tags: {
      ...defaultTags,
      ...globalTags,
      ...tags
    },
    ...convertOptions
  })
}
