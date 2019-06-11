const renderMarkdown = require('../index')

test('Markdown', it => {

  it('runs', renderMarkdown())

  const source =
`---
title: Title
tags: [abc, def]
---

# H1

[Link](http://example.com)

<include file="./test-include.md">

`

  const snapshot = {
    html:
`<h1><a name="h1" class="markdown-heading-anchor" href="#"></a>H1</h1>
<p><a href="http://example.com">Link</a></p>
<p>Test include success</p>
`,
    attributes: {
      title: 'Title',
      tags: [ 'abc', 'def' ]
    }
  }

  const result = renderMarkdown(source, {
    root: __dirname
  })

  it('returns rendered html and attributes from Markdown front matter', result.html && result.attributes)
  it('renders html correctly', result.html===snapshot.html, { snapshot: snapshot.html, result: result.html })
  it('parses Markdown frontmatter correctly',
    it.is(snapshot.attributes, result.attributes)
  )
})
