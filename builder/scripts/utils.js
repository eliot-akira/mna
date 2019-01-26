const path = require('path')
const fs = require('fs-extra')
const rimraf = require('rimraf')
const chalk = require('chalk')
const sync = require('../helpers/sync')

const logMessage = (message, level = 'info') => {
  const color = level === 'error' ? 'red' : level === 'warning' ? 'yellow' : 'white'
  console.log(chalk[color](message))
}

const compilerPromise = (name, compiler) => {
  return new Promise((resolve, reject) => {

    /*logMessage(`[${name}] Compiling..`)
    compiler.hooks.compile.tap(name, () => {
    })*/

    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        //logMessage(`[${name}] Compiled`)
        resolve()
      } else {
        reject(`Failed to compile ${name}`)
      }
      /*if (name==='server'
        && process.env.NODE_ENV==='development'
      ) logMessage('Type `rs` and enter to restart server')*/
    })
  })
}

const compilerWatchHandler = config => (error, stats) => {

  if (!error && !stats.hasErrors()) {
    console.log(stats.toString(config.stats))
    return
  }

  if (stats.hasErrors()) {
    const info = stats.toJson()
    const errors = info.errors[0].split('\n')
    logMessage(errors[0], 'error')
    logMessage(errors[1])
    logMessage(errors[2])
  }
}

async function prepareBuildFolder({ paths }) {
  const { appDirectory, buildClient, buildServer } = paths

  // Clean folders

  // Sanity check!
  if (buildClient) {
    rimraf.sync(`{${
      [ 'assets/**', 'updates/**',
        '**/*.css', '**/*.js',
        'manifest.json'
      ].map(f => `${buildClient}/${f}`).join(',')
    }}`, {
      //glob: { ignore: `${buildClient}/static` }
    })
  }
  if (buildServer) {
    rimraf.sync(buildServer)
  }

  // Sync /static
  const staticFolder = path.join(appDirectory, 'static')
  if (await fs.exists(staticFolder)) {

    const staticFolderTarget = path.join(buildClient)

    await fs.ensureDir(staticFolderTarget)
    await sync(staticFolder, staticFolderTarget)

    console.log('Synced /static')
  }
}

const appConfig = async ({ paths, clientConfig, serverConfig }) => {

  let appConfigFn

  try {
    appConfigFn = require(path.join(paths.appDirectory, 'app.config.js'))
  } catch (e) {
    return
  }

  await appConfigFn({
    paths,
    clientConfig, serverConfig,
    ...require('../helpers')
  })
}

module.exports = {
  logMessage,
  compilerPromise,
  compilerWatchHandler,
  prepareBuildFolder,
  appConfig
}
