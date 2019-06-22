import { Link } from '@mna/react'
import decodeEntities from '@mna/html/entities/decode'
import Prism from '../Prism'
import ScrollLink from '../Scroll/Link'
import ScrollTarget from '../Scroll/Target'

export const input = (props) => {
  if (props.type==='checkbox') {
    props.checked = props.checked ? 'checked' : false
    //props.disabled = 'disabled'
    props.readOnly = 'readOnly'
  }
  return <input {...props} />
}

export const a = (props, children, { render }) => {

  // Smooth-scroll anchors
  if (props.name) {
    return <ScrollTarget {...{
      tag: 'a',
      ...props
    }}>{render(children)}</ScrollTarget>
  }

  if (props.href) {

    const href = props.href.replace(/^\//, '')

    if (href[0]==='#') {
      return <ScrollLink {...{
        ...props,
        offset: props.offset!=undefined ? props.offset : 12,
        href,
        to: href.replace(/^\#/, ''),
      }}>{render(children)}</ScrollLink>
    }
  } else {
    //console.log('No link target', props)
  }

  return <Link {...props}>{render(children)}</Link>
}

export const pre = (props, children, { render, context = { nodexIndex: 0 }}) => {

  const code = children[0]
  if (!code || !code.tagName==='code'
        || !code.children[0]
  ) return ''

  const { attributes: { className = '' } } = code
  const { content: rawContent = '' } = code.children[0]

  const language = className.replace(/^language-/, '') || 'markup'
  const content = decodeEntities(rawContent) // Content from markdown

  return <Prism
    key={`prism-${context.nodeIndex++}`}
    className={className}
    {...{ ...props, language, children: content }}
  />
}

// Remove empty text nodes in table, due to markdown render
const renderCompact = ({ tag, childTag, childTags = [] }) =>
  (props, children, { render }) => render([
    {
      tagName: tag,
      attributes: props,
      children: children.filter(n =>
        n.tagName && (n.tagName===childTag || childTags.indexOf(n.tagName)>=0)
      )
    }
  ], { rawTag: true })

export const table = renderCompact({ tag: 'table', childTags: ['thead', 'tbody', 'foot'] })
export const thead = renderCompact({ tag: 'thead', childTag: 'tr' })
export const tbody = renderCompact({ tag: 'tbody', childTag: 'tr' })
export const tfoot = renderCompact({ tag: 'tfoot', childTag: 'tr' })
export const tr = renderCompact({ tag: 'tr', childTags: ['th', 'td'] })
