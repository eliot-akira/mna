import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

const initUpdater = () => {

  // Set up auto updates

  class AppUpdater {
    constructor() {
      log.transports.file.level = 'info'
      autoUpdater.logger = log
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
  
  new AppUpdater()
}

export default initUpdater
