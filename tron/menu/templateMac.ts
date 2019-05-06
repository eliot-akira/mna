import { app, shell, MenuItemConstructorOptions } from 'electron'
import { MenuProps } from './typings'

const createMenuTemplateMac = ({ mainWindow, appTitle = 'App' }: MenuProps): MenuItemConstructorOptions[] => {

  const subMenuAbout = {
      label: appTitle,
      submenu: [
        { label: `About ${appTitle}`, selector: 'orderFrontStandardAboutPanel:' },
        //{ type: 'separator' }, { label: 'Services', submenu: [] },
        { type: 'separator' },
        { label: `Hide ${appTitle}`, accelerator: 'Command+H', selector: 'hide:' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]

    }
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
      ]
    }
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => { mainWindow.webContents.reloadIgnoringCache()
        } },
        { label: 'Toggle Developer Tools', accelerator: 'Alt+Command+I', click: () => { mainWindow.webContents.toggleDevTools() } },
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { mainWindow.setFullScreen(!mainWindow.isFullScreen()) } },
      ]
    }
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        { label: 'Toggle Full Screen', accelerator: 'Ctrl+Command+F', click: () => { mainWindow.setFullScreen(!mainWindow.isFullScreen()) } }
      ]
    }
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    }

    const subMenuHelp = {
      label: 'Help',
      submenu: [
        { label: 'Learn More', click() { shell.openExternal('http://electron.atom.io') } },
        { label: 'Documentation', click() { shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme') } },
        { label: 'Community Discussions', click() { shell.openExternal('https://discuss.atom.io/c/electron') } },
        { label: 'Search Issues', click() { shell.openExternal('https://github.com/atom/electron/issues') } }
      ]
    }

    const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd

    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      //subMenuHelp
    ] as MenuItemConstructorOptions[]
}

export default createMenuTemplateMac
