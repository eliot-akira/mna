const frontmatter = require('front-matter')

const md = require('markdown-it')({
  preset: 'default',
  html: true,
  linkify: true
  //highlight: renderHighLight
})
  //.use(require('./include'))
  .use(require('./anchor'))
  .use(require('./attr'))
  .use(require('./taskList'), {
    // Without `disabled` attribute
    enabled: true
  })

module.exports = function renderMarkdown(content = '', options = {}) {

  const { body, attributes } = frontmatter(content)

  const html = options.markdown
    ? options.markdown(body)
    : md.render(body)

  return { html, attributes }
}
