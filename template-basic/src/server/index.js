import * as main from './main'

// Source map for compiled production server
if (process.env.NODE_ENV!=='development') {
  require('source-map-support').install()
}

let instance

main.createServer(main)
  .catch(console.error)
  .then(server => {
    instance = server
    if (!process.env.APP_EXPORT) return
    main.exportStaticSite(server)
      .then(process.exit)
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })

if (module.hot) {
  console.log('Server hot-reload enabled. Type rs and enter to restart manually.')
  module.hot.accept('./main', () => {
    instance.reload(require('./main'))
  })
}
