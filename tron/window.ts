import { BrowserWindow, ipcMain } from 'electron'
import windowStateKeeper from 'electron-window-state'
import loadHtml from './html'
import createMenu from './menu'

let mainWindow = null
let mainWindowState = null

export const createMainWindow = ({
  appTitle,
  indexHtmlSrc
}) => {

  if (mainWindow) return { mainWindow, mainWindowState }

  //const defaultSize = screen.getPrimaryDisplay().workAreaSize
  mainWindowState = windowStateKeeper({
    defaultWidth: 1280, //defaultSize.width || 1280,
    defaultHeight: 800 //defaultSize.height || 800
  })

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    width: mainWindowState.width, // dev ? 1000 : 600,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: 640,
    minHeight: 640,
    backgroundColor: '#000', // ffffff
    // TODO: Replace placeholders in app.html
    webPreferences: { nodeIntegration: true }
  })

  loadHtml({ mainWindow, indexHtmlSrc })

  createMenu({ mainWindow, appTitle })

  // Keep window state

  mainWindowState.manage(mainWindow)

  ipcMain.on('resize', (e, { height, width }) =>
    mainWindow.setContentSize(width, height)
  )

  // Focus on main window when app frontend is ready

  mainWindow.once('ready-to-show', () => {
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize()
      return
    }
    mainWindow.show()
    mainWindow.focus()
    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools()
    }
  })

  mainWindow.on('closed', () => mainWindow = null)

  return { mainWindow, mainWindowState }
}

export const getMainWindow = () => {
  return { mainWindow, mainWindowState }
}
