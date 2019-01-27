import React from 'react'
import { Link } from '@mna/react'
import convert from '@mna/html/react'
import Prism from '../Prism'

export default function htmr(post, options = {}) {

  const { tags, ...convertOptions } = options

  let nodeIndex = 0

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
        return <Prism key={`prism-${nodeIndex++}`} {...{ ...props, children }} />
      },

      ...tags
    },
    ...convertOptions
  })
}