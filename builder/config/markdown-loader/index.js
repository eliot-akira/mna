const loaderUtils = require('loader-utils')
const renderMarkdown = require('@mna/markdown')

module.exports = function (content) {

  if (this.cacheable) this.cacheable()

  const options = loaderUtils.getOptions(this) || {}
  const { html, meta } = renderMarkdown(content, options)

  return `module.exports = {
  html: ${JSON.stringify(html)},
  meta: ${JSON.stringify(meta)}
}`
}
