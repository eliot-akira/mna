const webpack = require('webpack')
const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')

const webpackConfig = require('../config/webpack')(process.env.NODE_ENV || 'production')
const paths = require('../config/paths')
const {
  logMessage, compilerPromise, compilerWatchHandler,
  appConfig, prepareBuildFolder
} = require('./utils')

const build = async () => {

  await prepareBuildFolder({ paths })

  const [clientConfig, serverConfig] = webpackConfig

  await appConfig({ paths, clientConfig, serverConfig })

  const multiCompiler = webpack([clientConfig, serverConfig])

  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

  const clientPromise = compilerPromise('client', clientCompiler)
  const serverPromise = compilerPromise('server', serverCompiler)

  serverCompiler.watch({}, compilerWatchHandler(serverConfig))
  clientCompiler.watch({}, compilerWatchHandler(clientConfig))

  logMessage('Building client and server..')

  try {
    await serverPromise
    await clientPromise
  } catch (error) {
    logMessage(error, 'error')
    process.exit(1)
    return
  }

  await generateProductionServerPackage({ paths })

  logMessage('Done!', 'info')
  process.exit(0)
}

build().catch(console.error)


async function generateProductionServerPackage({ paths }) {

  logMessage('Generating production server package..', 'info')

  const { resolveApp } = paths
  const resolveBuild = (...f) => path.join(paths.build, ...f)

  const serverEntry = path.join(
    path.relative(paths.appDirectory, paths.buildServer),
    'server.js'
  )
  const serverEntryRegEx = new RegExp(serverEntry, 'g')
  const newServerEntry = serverEntry.replace('build/', '')

  // package.json

  const packageJson = fs.readJsonSync(resolveApp('package.json'))

  delete packageJson.devDependencies

  const newPackageJson = JSON.stringify(packageJson, null, 2)
    .replace(serverEntryRegEx, newServerEntry)

  fs.writeFileSync(resolveBuild('package.json'), newPackageJson, 'utf8')

  // pm2.config.js

  let pm2ConfigJs
  try {
    pm2ConfigJs = fs.readFileSync(resolveApp('pm2.config.js'), 'utf8')
  } catch (e) {
    pm2ConfigJs = `
// PM2 process file
// http://pm2.keymetrics.io/docs/usage/application-declaration/

// Make sure log directory exists
try { require('fs').mkdirSync('.log') } catch (e) { /**/ }

module.exports = {
  name: require('./package.json').name,
  script: '${serverEntry}',
  error_file: '.log/errors.log',
  out_file: '.log/out.log'
}
`
  }

  const newPm2ConfigJs = pm2ConfigJs
    .replace(serverEntryRegEx, newServerEntry)

  fs.writeFileSync(resolveBuild('pm2.config.js'), newPm2ConfigJs, 'utf8')

  // .env.production

  try {
    const envProduction = fs.readFileSync(resolveApp('.env.production'), 'utf8')
    fs.writeFileSync(resolveBuild('.env.production'), envProduction, 'utf8')
  } catch (e) {
    logMessage('Production server needs .env.production', 'warning')
  }
}
