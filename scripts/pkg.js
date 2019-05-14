const path = require('path')
const { fs, glob } = require('../builder/helpers')
const { execSync } = require('child_process')
const libs = require('./libs')

module.exports = function gatherPackages({ args, options }) {

  const src = '.'
  const dest = '_publish'

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
  const pkgs = {
    ...pkg.devDependencies,
    ...installModules
  }
  const keys = Object.keys(pkgs)
  keys.sort()

  pkg.devDependencies = keys.reduce((obj, key) => {
    obj[key] = pkgs[key]
    return obj
  }, {})

  fs.writeJsonSync(masterPackagePath, pkg, { spaces: 2 })

  // Install node_modules in publish

  execSync(`cp package.json ${dest} && cd ${dest} && rm -rf node_modules && yarn && mkdir node_modules/@mna && cd node_modules/@mna ${
    allLibs.map(lib => `ln -s ../../${lib}`).join(' && ')
  }`) // rm -rf node_modules
}
