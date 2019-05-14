const renderMarkdown = require('./index')

test('Markdown', it => {

  it('runs', renderMarkdown())

  const source =
`---
title: Title
tags: [abc, def]
---

# H1

[Link](http://example.com)

`

  const snapshot = {
    html: '<h1 id="h1">H1</h1>\n<p><a href="http://example.com">Link</a></p>\n',
    attributes: {
      title: 'Title',
      tags: [ 'abc', 'def' ]
    }
  }

  const result = renderMarkdown(source)

  it('returns rendered html and attributes from Markdown front matter', result.html && result.attributes)
  it('renders html correctly', result.html===snapshot.html)
  it('parses Markdown frontmatter correctly',
    it.is(snapshot.attributes, result.attributes)
  )
})
