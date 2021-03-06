import http from 'http'
import createServerHandler from './handler'
import createWebSocketServer from '@mna/socket/server'

export default async function createServer(props = {}) {

  let serverHandler = await createServerHandler(props)
  const { config } = serverHandler

  const appServer = http.createServer(serverHandler)
  let webSocketServer

  appServer.config = config
  appServer.reload = async newProps => {

    await serverHandler.exit()

    const newHandler = await createServerHandler(newProps)

    appServer.config = newHandler.config

    appServer.removeListener('request', serverHandler)
    appServer.on('request', newHandler)
    serverHandler = newHandler

    // Reload WebSocket handler
    if (newProps.socket && webSocketServer) {
      webSocketServer.off()
      newProps.socket(webSocketServer)
    }

    return appServer
  }

  appServer.listen(config.port)

  console.log(`Server in ${
    config.isDev ? 'development' : 'production'
  } running at ${
    config.isDev ? `http://localhost:${config.port}` : `port ${config.port}`
  }`)

  // WebSocket server
  if (props.socket) {
    const socketPort = config.socketPort || config.port
    webSocketServer = createWebSocketServer({
      appServer,
      port: config.port,
      socketPort: socketPort,
      options: {}
    })
    props.socket(webSocketServer)

    console.log(`WebSocket server at port ${socketPort}`)
  }

  // Clean exit

  const onExit = async () => {
    await serverHandler.exit()
    appServer.close()
    process.exit(0)
  }

  const onError = async (err) => {
    console.error('Server error', err)
    await serverHandler.exit()
    appServer.close()
    process.exit(1)
  }

  process.on('SIGINT', onExit)
  process.on('SIGTERM', onExit)
  process.on('uncaughtException', onError)

  return appServer
}
