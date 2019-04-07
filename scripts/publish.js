const path = require('path')
const { execSync } = require('child_process')
const libs = require('./libs')

module.exports = function publish({ args, options }) {

  const src = '.'
  const dest = '_publish'

  // Publish only specified libs
  const allLibs = args[0]
    ? (args[0]==='all'
      ? [...libs.client, ...libs.server, ...libs.copy]
      : args[0].split(',')
    )
    : []

  for (const lib of allLibs) {
    const libPath = path.join(dest, lib)
    execSync(`cd ${libPath} && npm publish --access public`)
  }

}
