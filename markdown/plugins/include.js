// Originally based on: https://github.com/camelaissani/markdown-it-include

const path = require('path')
const fs = require('fs')
const cwd = process.cwd()

//  var INCLUDE_RE = /\!{3}\s*include\s*\(\s*(.+?)\s*\)\s*\!{3}/i
const INCLUDE_RE = /<include\s*(.+?)=[\'|\"]?(.+?)[\'|\"]?\s*>/i

module.exports = function include_plugin(md, options) {

  let root = '.'
  let includeRe = INCLUDE_RE

  if (options) {
    if (typeof options === 'string') {
      root = options
    } else {
      root = options.root || root
      includeRe = options.includeRe || includeRe
    }
  }

  function _replaceIncludeByContent({
    src,
    rootDir = cwd,
    fileDir,
    parentFilePath,
    filesProcessed
  }) {

    filesProcessed = filesProcessed ? filesProcessed.slice() : [] // making a copy

    let cap

    // store parent file path to check circular references
    if (parentFilePath) {
      filesProcessed.push(parentFilePath)
    }

    while ((cap = includeRe.exec(src))) {

      const fileType = cap[1]
      const fileBasePath = cap[2].trim()
      const relativeFilePath = path.resolve(fileDir, fileBasePath)
        .replace(rootDir, '') // Prevent going above "root"
      const filePath = path.join(
        rootDir,
        relativeFilePath
      )

      // check if circular reference
      const indexOfCircularRef = filesProcessed.indexOf(filePath)
      if (indexOfCircularRef !== -1) {
        throw new Error('Circular reference between ' + filePath + ' and ' + filesProcessed[indexOfCircularRef])
      }

      let content = ''

      // replace include by file content
      try {
        content = _replaceIncludeByContent({
          src: fs.readFileSync(filePath, 'utf8'),
          rootDir,
          fileDir: path.dirname(filePath),
          parentFilePath: filePath,
          filesProcessed
        })
      } catch(e) {
        content = `Error loading: ${relativeFilePath}`
      }

      src = src.slice(0, cap.index) + content + src.slice(cap.index + cap[0].length, src.length)
    }

    return src
  }

  function _includeFileParts(state) {
    const currentRoot = (state.env && state.env.root) || root
    state.src = _replaceIncludeByContent({
      src: state.src,
      rootDir: currentRoot,
      fileDir: currentRoot
    })
  }

  md.core.ruler.before('normalize', 'include', _includeFileParts)
}
