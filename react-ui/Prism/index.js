import prism from './prism'

const translate = {
  sh: 'bash'
}
const phpStartTag = '<?php '
const phpStartTagReplace = '<span class="token delimiter important">&lt;?php</span> '

export function highlight({ language, content }) {

  if (translate[language]) language = translate[language]
  const grammar = prism.languages[language] || prism.languages.markup

  // Workaround for PHP to not start with markup
  if (language==='php' && content.substr(2)!=='<?') {
    return prism.highlight(
      phpStartTag+content,
      grammar, language
    ).replace(phpStartTagReplace, '')
  }

  return prism.highlight(content, grammar, language)
}

export default function Prism({ language, children, ...props }) {

  const rendered = highlight({ language, content: children })

  return <pre {...props}>
    <code {...{
      dangerouslySetInnerHTML: { __html: rendered }
    }}></code>
  </pre>

}
