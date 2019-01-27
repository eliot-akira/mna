import decodeEntities from '@mna/html/entities/decode'
import prism from './prism'

const translate = {
  sh: 'bash'
}
const phpStartTag = '<?php '
const phpStartTagReplace = '<span class="token delimiter important">&lt;?php</span> '

export default function Prism({ children, ...props }) {
  console.log('Prism', props, children)
  const code = children[0]
  if (!code || !code.tagName==='code'
          || !code.children[0]
  ) return ''

  const { attributes: { className = '' } } = code
  const { content: rawContent = '' } = code.children[0]

  let language = className.replace(/^language-/, '') || 'markup'
  if (translate[language]) language = translate[language]

  const grammar = prism.languages[language] || prism.languages.markup

  let content = decodeEntities(rawContent)

  // Workaround for PHP to not start with markup
  let addedPhpTag = false
  if (language==='php' && content.substr(2)!=='<?') {
    content = phpStartTag+content
    addedPhpTag = true
  }

  let rendered = prism.highlight(content, grammar, language)

  if (addedPhpTag) rendered = rendered.replace(phpStartTagReplace, '')

  return <pre {...props} className={className}>
    <code {...{
      dangerouslySetInnerHTML: { __html: rendered }
    }}></code>
  </pre>

}