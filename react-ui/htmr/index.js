import React from 'react'
import { Link } from '@mna/react'
import convert from '@mna/html/react'
import decodeEntities from '@mna/html/entities/decode'
import Prism from '../Prism'

export const globalTags = {}
export const addTags = tags => Object.assign(globalTags, tags)

export default function htmr(post, options = {}) {

  const { tags, ...convertOptions } = options

  let nodeIndex = 0

  return convert(post, {
    tags: {

      input(props) {
        if (props.type==='checkbox') {
          props.checked = props.checked ? 'checked' : false
          //props.disabled = 'disabled'
          props.readOnly = 'readOnly'
        }
        return <input {...props} />
      },

      a(props, children, { render }) {
        return <Link {...props}>{render(children)}</Link>
      },

      pre(props, children, { render }) {

        const code = children[0]
        if (!code || !code.tagName==='code'
              || !code.children[0]
        ) return ''

        const { attributes: { className = '' } } = code
        const { content: rawContent = '' } = code.children[0]

        const language = className.replace(/^language-/, '') || 'markup'
        const content = decodeEntities(rawContent) // Content from markdown

        return <Prism
          key={`prism-${nodeIndex++}`}
          className={className}
          {...{ ...props, language, children: content }}
        />
      },
      ...globalTags,
      ...tags
    },
    ...convertOptions
  })
}