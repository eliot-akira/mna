
// Based on: https://github.com/adam-p/markdown-it-headinganchor

const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
// Unicode-friendly
// function slugify(s, md) {
//   var spaceRegex = new RegExp(md.utils.lib.ucmicro.Z.source, 'g')
//   return encodeURIComponent(s.replace(spaceRegex, '').trim().toLowerCase().replace(/\s+/g, '-'))
// }

function makeRule(md, options) {
  return function addHeadingAnchors(state) {
    // Go to length-2 because we're going to be peeking ahead.
    for (let i = 0; i < state.tokens.length-1; i++) {
      if (state.tokens[i].type !== 'heading_open' ||
          state.tokens[i+1].type !== 'inline') {
        continue
      }

      const headingOpenToken = state.tokens[i]
      const headingInlineToken = state.tokens[i+1]

      if (!headingInlineToken.content) {
        continue
      }

      let anchorName

      if (headingOpenToken.attrs) {
        for (const [key, value] of headingOpenToken.attrs) {
          if (key==='name') {
            anchorName = value
            break
          }
        }
      }

      if (!anchorName) anchorName = options.slugify(headingInlineToken.content, md)

      if (options.addHeadingID) {
        state.tokens[i].attrPush(['id', anchorName])
      }

      if (options.addHeadingAnchor) {
        var anchorToken = new state.Token('html_inline', '', 0)
        anchorToken.content =
          '<a name="' +
          anchorName +
          '" class="' +
          options.anchorClass +
          '" href="#"></a>'

        headingInlineToken.children.unshift(anchorToken)
      }

      // Advance past the inline and heading_close tokens.
      i += 2
    }
  }
}

module.exports = function headinganchor_plugin(md, opts) {
  var defaults = {
    anchorClass: 'markdown-heading-anchor',
    addHeadingID: false,
    addHeadingAnchor: true,
    slugify: slugify
  }
  var options = md.utils.assign(defaults, opts)
  md.core.ruler.push('heading_anchors', makeRule(md, options))
}

// Previously

// const position = {
//   false: 'push',
//   true: 'unshift'
// }

// const hasProp = Object.prototype.hasOwnProperty

// const permalinkHref = slug => `#${slug}`

// const renderPermalink = (slug, opts, state, idx) => {
//   const space = () => Object.assign(new state.Token('text', '', 0), { content: ' ' })

//   const linkTokens = [
//     Object.assign(new state.Token('link_open', 'a', 1), {
//       attrs: [
//         ['class', opts.permalinkClass],
//         ['href', opts.permalinkHref(slug, state)],
//         ['aria-hidden', 'true']
//       ]
//     }),
//     Object.assign(new state.Token('html_block', '', 0), { content: opts.permalinkSymbol }),
//     new state.Token('link_close', 'a', -1)
//   ]

//   // `push` or `unshift` according to position option.
//   // Space is at the opposite side.
//   linkTokens[position[!opts.permalinkBefore]](space())
//   state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens)
// }

// const uniqueSlug = (slug, slugs) => {
//   let uniq = slug
//   let i = 2
//   while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`
//   slugs[uniq] = true
//   return uniq
// }

// const isLevelSelectedNumber = selection => level => level >= selection
// const isLevelSelectedArray = selection => level => selection.includes(level)

// const anchor = (md, opts) => {
//   opts = Object.assign({}, anchor.defaults, opts)

//   md.core.ruler.push('anchor', state => {
//     const slugs = {}
//     const tokens = state.tokens

//     const isLevelSelected = Array.isArray(opts.level)
//       ? isLevelSelectedArray(opts.level)
//       : isLevelSelectedNumber(opts.level)

//     tokens
//       .filter(token => token.type === 'heading_open')
//       .filter(token => isLevelSelected(Number(token.tag.substr(1))))
//       .forEach(token => {
//         // Aggregate the next token children text.
//         const title = tokens[tokens.indexOf(token) + 1].children
//           .filter(token => token.type === 'text' || token.type === 'code_inline')
//           .reduce((acc, t) => acc + t.content, '')

//         let slug = token.attrGet('id')

//         if (slug == null) {
//           slug = uniqueSlug(opts.slugify(title), slugs)
//           token.attrPush(['id', slug])
//         }

//         if (opts.permalink) {
//           opts.renderPermalink(slug, opts, state, tokens.indexOf(token))
//         }

//         if (opts.callback) {
//           opts.callback(token, { slug, title })
//         }
//       })
//   })
// }

// anchor.defaults = {
//   level: 1,
//   slugify,
//   permalink: false,
//   renderPermalink,
//   permalinkClass: 'header-anchor',
//   permalinkSymbol: '¶',
//   permalinkBefore: false,
//   permalinkHref
// }

// module.exports = anchor
