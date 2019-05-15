import { app, shell, MenuItemConstructorOptions } from 'electron'
import { MenuProps } from './typings'

const createMenuTemplate = ({ mainWindow }: MenuProps): MenuItemConstructorOptions[] => {

  const templateDefault = [{
    label: '&File',
    submenu: [{
      label: '&Open',
      accelerator: 'Ctrl+O'
    }, {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click: () => {
        mainWindow.close()
      }
    }]
  }, {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click: () => { mainWindow.webContents.reloadIgnoringCache() }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click: () => { mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click: () => { mainWindow.webContents.toggleDevTools() }
    }] : [{
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click: () => { mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
    }]
  } /*, {
    label: 'Help',
    submenu: [
      { label: 'Learn More', click() { shell.openExternal('http://electron.atom.io') } },
      { label: 'Documentation', click() { shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme') } },
      { label: 'Community Discussions', click() { shell.openExternal('https://discuss.atom.io/c/electron') } },
      { label: 'Search Issues', click() { shell.openExternal('https://github.com/atom/electron/issues') } }
    ]
  } */ ]

  return templateDefault
}

export default createMenuTemplate
