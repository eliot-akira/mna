export default function initDebug() {

  // https://github.com/sindresorhus/electron-debug

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    require('electron-debug')()
  }

}
