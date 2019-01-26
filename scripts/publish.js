const path = require('path')
const { execSync } = require('child_process')
const libs = require('./libs')

module.exports = function publish({ args, options }) {

  const src = '.'
  const dest = 'publish'

  const allLibs = args[0]
    ? [args[0]]
    : [...libs.client, ...libs.server, ...libs.copy]

  for (const lib of allLibs) {
    const libPath = path.join(dest, lib)
    execSync(`cd ${libPath} && npm publish --access public`)
  }

}
