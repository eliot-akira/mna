// Based on: https://github.com/akiran/react-highlight
// Modified to accept pre-escaped code block from markdown

// Optimized to load only needed langauges
// https://react-highlight.neostack.com/docs/optimisation

import hljs from'highlight.js/lib/highlight'
import React from'react'

class Highlight extends React.Component {

  componentDidMount() {
    this.highlightCode()
  }

  shouldComponentUpdate = () => false

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {

    const { className, languages, innerHTML, children } = this.props
    const nodes = this.el.querySelectorAll(innerHTML ? 'pre code' : 'code')

    if ((languages.length === 0) && className) {
      languages.push(className)
    }

    languages.forEach(lang => {
      if (lang==='js') lang = 'javascript'
      hljs.registerLanguage(lang, require('highlight.js/lib/languages/' + lang))
    })

    for (let i = 0; i < nodes.length; i++) {
      hljs.highlightBlock(nodes[i])
    }
  }

  setEl = (el) => {
    this.el = el
  }

  render() {
    const { children, className, element: Element, innerHTML } = this.props
    const props = { ref: this.setEl, className }

    if (innerHTML) {
      props.dangerouslySetInnerHTML = { __html: children }
      if (Element) {
        return <Element {...props} />
      }
      return <div {...props} />
    }

    if (Element) {
      return <Element {...props}>{children}</Element>
    }

    return <pre className="hljs-pre" ref={this.setEl}>
      <code className={className} {...{
        dangerouslySetInnerHTML: { __html: children }
      }}></code></pre>
  }
}

Highlight.defaultProps = {
  innerHTML: false,
  className: '',
  languages: [],
}

export default Highlight
