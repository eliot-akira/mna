const path = require('path')
const { fs, glob } = require('../builder/helpers')
const { execSync } = require('child_process')
const libs = require('./libs')

module.exports = function install({ args, options }) {

  const src = '.'
  const dest = '_publish'

  // Publish only specified libs
  const allLibs = [...libs.client, ...libs.server, ...libs.copy]

  const pkgPaths = glob.sync(`{./package.json,${
    allLibs.map(lib => `${src}/${lib}/package.json`).join(',')
  }}`)

  const installModules = {}

  for (const pkgPath of pkgPaths) {
    const pkg = fs.readJsonSync(pkgPath)
    const { dependencies = {}, devDependencies = {} } = pkg
    // Deduplicate
    const allDeps = { ...dependencies, ...devDependencies }
    for (const dep in allDeps) {
      if (dep.indexOf('@mna/')>=0) continue
      installModules[dep] = allDeps[dep]
    }
  }


  const masterPackagePath = 'package.json'
  const pkg = fs.readJsonSync(masterPackagePath)
  pkg.devDependencies = {
    ...pkg.devDependencies,
    ...installModules
  }
  fs.writeJsonSync(masterPackagePath, pkg, { spaces: 2 })

  execSync(`rm -rf node_modules`)
}
