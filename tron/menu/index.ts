import { Menu } from 'electron'
import { MenuProps } from './typings'
import createContextMenu from './contextMenu'
import createTemplate from './template'
import createTemplateMac from './templateMac'

const createMenu = (props: MenuProps) => {

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    createContextMenu(props)
  }

  const template =
    process.platform === 'darwin'
      ? createTemplateMac(props)
      : createTemplate(props)

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)

  return menu
}

export default createMenu
