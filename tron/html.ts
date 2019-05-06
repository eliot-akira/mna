
const loadHtml = ({ mainWindow, indexHtmlSrc }) => {

  // TODO: Implement Content Security Policy for HTML
  // https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

  mainWindow.loadURL(`file://${indexHtmlSrc}`)

  // Dynamic HTML

  // Looks like simplest way is to write it to a file and loadURL.
  // The method below has issue with finding root folder for scripts and styles

  //     `<!DOCTYPE html>
  //     <html>
  //       <head>
  //         <meta charset="utf-8">
  //         <!--meta http-equiv="Content-Security-Policy" content="script-src 'self'"-->
  //         <title>App</title>
  //         ${ process.env.HOT ? '' : `<link rel="stylesheet" href="./dist/style.css" />` }
  //       </head>
  //       <body>
  //         <div id="root"></div>
  //         ${ process.env.NODE_ENV!=='development' ? '' : `<script defer src="../dll/renderer.dev.dll.js"></script>` }
  //         <script defer src="${
  //   process.env.HOT
  //     ? 'http://localhost:' + (process.env.PORT || 1212) + '/dist/renderer.dev.js'
  //     : './dist/renderer.prod.js'
  // }"></script>
  //       </body>
  //     </html>
  //     `

  //mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`)

}

export default loadHtml
