// global WebSocket, location

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket

import createEmitter from '@mna/event'
import createSocketInstance from './socketInstance'
let io

export default function createWebSocketClient(props = {}) {

  if (io) {
    // Remove event listeners
    io.off()
    io.clientRequestListeners = {}
    // Trigger connect on next tick, to allow attaching new events after return
    if (io.connected) setTimeout(() => io.emit('connect'), 0)
    return io
  }

  const { host, port } = props

  const socketUrl = `ws://${host || location.host}${
    port ? `:${port}` : ''
  }`

  io = createEmitter()
  io.clientRequestListeners = {}

  io.ws = createSocketInstance({ io, socketUrl })

  io.send = (data) => io.ws && io.ws.send(JSON.stringify(data))
  io.close = () => {
    const { ws } = io // Ensure to reference current instance
    ws.onerror = ws.onopen = ws.onclose = ws.onmessage = null
    ws.close()
    io.connected = false
  }

  io.request = (data = {}) => new Promise((resolve, reject) => {

    const requestId = Date.now()

    io.clientRequestListeners[requestId] = resolve
    io.send({ ...data, clientRequestId: requestId })      
  })

  io.handleServerRequest = fn => io.on('serverRequest', async data => {

    const { serverRequestId } = data

    let result
    try {
      result = await fn(data)
    } catch(e) { /**/ }

    io.send({
      serverRequestId,
      ...(result || {})
    })
  })

  return io
}
