
// Similar to webpack-node-externals, but exclude only dependencies in package.json
// This will bundle modules in devDependencies

// See also: https://github.com/liady/webpack-node-externals

const fs = require('fs')
const path = require('path')

const scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+\/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9.\/]+)?', 'g')

function getModuleName(request, includeAbsolutePaths) {

  let req = request
  const delimiter = '/'

  if (includeAbsolutePaths) {
    req = req.replace(/^.*?\/node_modules\//, '')
  }
  // check if scoped module
  if (scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0
    return req.split(delimiter, 2).join(delimiter)
  }
  return req.split(delimiter)[0]
}

module.exports = function(options) {

  const isDev = process.env.NODE_ENV==='development'

  const importType = 'commonjs'

  let packageJson = {}
  try {
    packageJson = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), './package.json'), 'utf8'
    ))
  } catch (e){ /**/ }

  const dependencies = Object.keys((packageJson.dependencies || {}))


  return function(context, request, callback) {

    const moduleName = getModuleName(request, true)

    if (dependencies.indexOf(moduleName)===-1) return callback()

    // External
    return callback(null, importType + " " + request)
  }
}