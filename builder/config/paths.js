const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (...f) => path.resolve(appDirectory, ...f)

const srcPath = resolveApp('src')
const buildPath = resolveApp('build')

let srcClient = path.join(srcPath, 'client', 'index.js')
if (!fs.existsSync(srcClient)) srcClient = path.join(srcPath, 'client.js')

let srcServer = path.join(srcPath, 'server', 'index.js')
if (!fs.existsSync(srcServer)) srcServer = path.join(srcPath, 'server.js')

const paths = {
  appDirectory,
  src: srcPath,
  build: buildPath,
  resolveApp,
  srcClient,
  srcServer,
  buildClient: path.join(buildPath, 'client'),
  buildServer: path.join(buildPath, 'server'),
  dotenv: resolveApp('.env'),
  publicPath: '/', //'/static/',
}

paths.resolveModules = [
  paths.src,
  resolveApp('node_modules'),
  // Inside builder
  path.join(__dirname, '..', 'node_modules'),
  //'node_modules'
]

module.exports = paths
