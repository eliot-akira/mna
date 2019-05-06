
// Browser extensions

const defaultExtensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

const installExtensions = async (extensions: string[] = defaultExtensions) => {

  const shouldInstall =
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'

  if (!shouldInstall) return

  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log)
}

export default installExtensions
