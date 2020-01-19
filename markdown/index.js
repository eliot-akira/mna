const markdownIt = require('markdown-it')
const frontmatter = require('front-matter')

const attributesPlugin = require('./plugins/attributes')
const anchorPlugin = require('./plugins/anchor')
const taskListPlugin = require('./plugins/taskList')
//const includePlugin = require('./plugins/include')

const md = markdownIt({
  preset: 'default',
  html: true,
  linkify: true,
  //highlight: renderHighLight
})

  // <!--{ name="value" }-->
  .use(attributesPlugin)
  .use(anchorPlugin)

  .use(taskListPlugin, {
    // Checkbox without `disabled` attribute
    enabled: true
  })
  //.use(includePlugin)

module.exports = function renderMarkdown(content = '', options = {}) {

  const {
    body,
    attributes: meta = {}
  } = frontmatter(content)

  const html = options.markdown
    ? options.markdown(body, options)
    : md.render(body, options)

  return { html, meta }
}
