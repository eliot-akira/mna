const loaderUtils = require('loader-utils')
const frontmatter = require('front-matter')

const md = require('markdown-it')({
  preset: 'default',
  html: true,
  //highlight: renderHighLight
})
  .use(require('./taskList'), {
    // Without `disabled` attribute
    enabled: true
  })

module.exports = function (source) {

  if (this.cacheable) this.cacheable()

  const options = loaderUtils.getOptions(this) || {}

  const { body, attributes } = frontmatter(source)

  const html = options.markdown
    ? options.markdown(body)
    : md.render(body)

  return `module.exports = {
  html: ${JSON.stringify(html)},
  meta: ${JSON.stringify(attributes)}
}`
}
