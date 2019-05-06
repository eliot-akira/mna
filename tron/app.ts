import { app, BrowserWindow } from 'electron'
import initExtensions from './extensions'
import { createMainWindow } from './window'
import initInstance from './instance'
import initUpdater from './updater'

interface AppConfig {
  appTitle: string,
  indexHtmlSrc: string,
  updater?: boolean
}

const createApp = (config: AppConfig) => {

  if (!initInstance()) return

  app.on('ready', async () => {

    await initExtensions()

    createMainWindow(config)

    if (config.updater) initUpdater()
  })
}

export default createApp
