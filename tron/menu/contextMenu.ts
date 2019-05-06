import { Menu } from 'electron'
import { MenuProps } from './typings'

const createContextMenu = ({ mainWindow }: MenuProps) => {

  mainWindow.webContents.on('context-menu', (e, props) => {

    const { x, y } = props

    Menu.buildFromTemplate([
      { label: 'Inspect element',
        click: () => mainWindow.webContents.inspectElement(x, y)
      },
      /*{ label: 'Reload',
          click: () =>
            mainWindow.webContents.reloadIgnoringCache()
        }*/
    ])
      .popup({ window: mainWindow })
  })
}

export default createContextMenu
