import React from 'react'
import { Link } from '@mna/react'
import convert from '@mna/html/react'
import Highlight from '@mna/react-ui/Highlight'

//import highlightLanguages from '@mna/builder/config/highlightLanguages'
const highlightLanguages = [
  'javascript', 'typescript', 'json',
  'scss', 'css',
  'xml', // Includes HTML
  'shell'
]

export default function htmr(post, options = {}) {

  const { tags, ...convertOptions } = options

  return convert(post, {
    tags: {

      input(props) {
        if (props.checked) {
          props.checked = 'checked'
          props.readOnly = 'readOnly'
        }
        if (props.disabled) {
          delete props.disabled
          if (!props.checked) props.checked = false
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

        const { className = '' } = code
        const { content = '' } = code.children[0]

        return (
          <Highlight
            key={new Date()} // Fix for "set unique key" warning in react dev build
            languages={highlightLanguages}
            className={className}>{
              content
            }</Highlight>
        )
        // return <pre {...props}>{render(children)}</pre>
      },

      ...tags
    },
    ...convertOptions
  })
}