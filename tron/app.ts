import { app, BrowserWindow } from 'electron'
import initInstance from './instance'
import createIndexHtml from './html'
import initExtensions from './extensions'
import { createMainWindow } from './window'
import initUpdater from './updater'

interface AppConfig {
  appTitle: string,
  indexHtmlPath: string,
  updater?: boolean
}

const createApp = async (config: AppConfig) => {

  if (!initInstance()) return

  // Generate index.html

  await createIndexHtml({
    dest: config.indexHtmlPath
  })

  app.on('ready', async () => {

    await initExtensions()

    createMainWindow(config)

    if (config.updater) initUpdater()
  })
}

export default createApp
