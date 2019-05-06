import {
  BrowserWindow,
} from 'electron'

export interface MenuProps {
  mainWindow: BrowserWindow,
  appTitle?: string
}
