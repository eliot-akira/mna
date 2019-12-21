const frontmatter = require('front-matter')

const preprocessMermaid = function(source) {
  return source
    .replace(/\</g, '&lt;')
    .replace(/\>/g, '&gt;')
}

const md = require('markdown-it')({
  preset: 'default',
  html: true,
  linkify: true,
  //highlight: renderHighLight

  // Mermaid is too heavy..
  // highlight: function(code, lang) {
  //   if (!lang || !lang.match(/\bmermaid\b/i)) return '' // Use default escape
  //   return `<div class="mermaid">${preprocessMermaid(code)}</div>`
  // }
})
//.use(require('./include'))

  // Set attr before anchor to allow specifying anchor name with <!--{name=""}-->
  .use(require('./attr'))

  .use(require('./anchor'))
  .use(require('./taskList'), {
    // Without `disabled` attribute
    enabled: true
  })

module.exports = function renderMarkdown(content = '', options = {}) {

  const { body, attributes } = frontmatter(content)

  const html = options.markdown
    ? options.markdown(body, options)
    : md.render(body, options)

  return { html, attributes }
}
