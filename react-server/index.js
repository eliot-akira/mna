import path from 'path'
import http from 'http'
import server from '@mna/server'
import content from '@mna/content-server'

import createConfig from './config'
import render from './render'

const configBase = createConfig()

export default async function createServer(props = {}) {

  const {
    App, routes,
    config: userConfig,
    content: contentInit = true,
    init: serverInit
  } = props

  const config = { ...configBase, ...userConfig }
  const routeProps = { config, server, content }

  const serverRoutes = [
    ...(contentInit ? await content.init(routeProps) : []),
    ...(await serverInit(routeProps) || [])
  ]

  const {
    serve, router,
    serveStatic,
    get, send, status, redirect
  } = server

  const serveFromAppRoot = serveStatic(config.cwd)

  const serverInstance = serve(router([

    get('.well-known/*', serveFromAppRoot), // Let's Encrypt
    get('robots.txt', serveFromAppRoot),

    serveStatic(config.buildClient),

    ...serverRoutes,

    get(async (req, res) => {

      const location = req.url // From lib/server/router
      const user = req.context.user // From lib/content/user

      const { html, redirectLocation, statusCode } = await render({
        App,
        routes,
        assets: config.assets,
        content, location, user, status
      })

      if (html) {

        send(res, statusCode || status.ok, html)

      } else if (redirectLocation) {

        redirect(res, statusCode || status.redirect, redirectLocation)
      }
    }),

    (req, res) => send(res, status.notFound)
  ]))


  const appServer = http.createServer(serverInstance)

  appServer.listen(config.port)

  console.log(`Server in ${
    config.isDev ? 'development' : 'production'
  } running http://localhost:${config.port}`)


  // TODO: WebSocket server

  // Clean exit

  const onExit = () => {
    appServer.close()
    process.exit(0)
  }

  const onError = (err) => {
    console.error('Server error', err)
    appServer.close()
    process.exit(1)
  }

  process.on('SIGINT', onExit)
  process.on('SIGTERM', onExit)
  process.on('uncaughtException', onError)

  appServer.config = config

  return appServer
}
