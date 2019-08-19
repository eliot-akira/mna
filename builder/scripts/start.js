const path = require('path')
const webpack = require('webpack')
const nodemon = require('nodemon')
const webpackConfig = require('../config/webpack')(process.env.NODE_ENV || 'development')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')

const paths = require('../config/paths')
const { logMessage, compilerPromise, appConfig, prepareBuildFolder } = require('./utils')

const app = express()

const WEBPACK_PORT =
    process.env.WEBPACK_PORT ||
    (!isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) + 1 : 8501)

const start = async () => {

  await prepareBuildFolder({ paths })

  let [clientConfig, serverConfig] = webpackConfig

  await appConfig({ paths, clientConfig, serverConfig })

  /*
  Webpack Hot Middleware

  Entry was: `webpack-hot-middleware/client?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr`
  Changed below to allow separate builder from app

  See: https://github.com/webpack-contrib/webpack-hot-middleware#config
  */
  const hmrPath = path.dirname(require.resolve('webpack-hot-middleware'))
  const hmrEntry = path.join(hmrPath, 'client')
    +`?path=http://localhost:${WEBPACK_PORT}/__webpack_hmr` // reload=true&

  clientConfig.entry.bundle = [
    hmrEntry,
    ...clientConfig.entry.bundle,
  ]

  clientConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
  clientConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js'

  serverConfig.entry.server.unshift('webpack/hot/poll?300')
  //serverConfig.watch = true
  serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json'
  serverConfig.output.hotUpdateChunkFilename = 'updates/[id].[hash].hot-update.js'

  const publicPath = clientConfig.output.publicPath

  clientConfig.output.publicPath = [`http://localhost:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

  serverConfig.output.publicPath = [`http://localhost:${WEBPACK_PORT}`, publicPath]
    .join('/')
    .replace(/([^:+])\/+/g, '$1/')

  const multiCompiler = webpack([clientConfig, serverConfig])

  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

  const watchOptions = {
    //poll: true,
    ignored: /node_modules/,
    stats: clientConfig.stats,
  }

  // Start webpack dev server for client

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    return next()
  })

  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: clientConfig.stats,
    watchOptions,
    logLevel: 'silent', // Using friendlyErrors
  }))

  app.use(webpackHotMiddleware(clientCompiler, {
    log: false // Using friendlyErrors
  }))

  app.use(paths.publicPath, express.static(paths.buildClient))

  app.listen(WEBPACK_PORT)


  serverCompiler.watch(watchOptions, (errors, stat) => {
    // Using friendlyErrors
  })

  logMessage('Building client and server..')
  try {

    const clientPromise = compilerPromise('client', clientCompiler)
    const serverPromise = compilerPromise('server', serverCompiler)

    await Promise.all([serverPromise, clientPromise])

  } catch (error) {
    logMessage(error, 'error')
    process.exit(1)
  }

  // Start server with nodemon

  const serverBuilt = `${paths.buildServer}/server.js`

  const script = nodemon({
    script: serverBuilt,
    watch: 'nothing', //serverBuilt, //`${paths.buildServer}/*.js`,

    // Show deprecation warnings with stack trace
    // https://nodejs.org/en/docs/guides/buffer-constructor-deprecation/
    //execMap: { js: 'node --trace-warnings --pending-deprecation' }
  })

  script.on('restart', () => {
    logMessage('App server has been restarted.', 'warning')
  })

  script.on('quit', () => {
    //console.log('Process ended')
    process.exit()
  })

  script.on('error', () => {
    logMessage('An error occured. Exiting', 'error')
    process.exit(1)
  })
}

start().catch(console.error)
