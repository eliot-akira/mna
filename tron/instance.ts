import { app } from 'electron'
import { getMainWindow } from './window'

const initAppInstance = () => {

  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return false
  }

  // On second instance request, focus the main window

  app.on('second-instance', (event, commandLine, workingDirectory) => {

    const { mainWindow } = getMainWindow()

    if (!mainWindow) return
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  })

  // On all windows closed, quit the app

  app.on('window-all-closed', () => {
    // Typically on macOS the app stays open
    //if (process.platform !== 'darwin')
    app.quit()
  })

  return true
}

export default initAppInstance
