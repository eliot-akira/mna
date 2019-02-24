import createServer from '@mna/react-server'
import App from '../App'
import routes from '../routes'
import init from './init'
import exportStaticSite from './export'

// Source map for compiled production server
if (process.env.NODE_ENV!=='development') {
  require('source-map-support').install()
}

createServer({
  App,
  routes,
  init
})
  .catch(console.error)
  .then(server => {
    if (!process.env.APP_EXPORT) return
    exportStaticSite(server)
      .then(process.exit)
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })
