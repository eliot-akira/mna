
export default function createWebSocketInstance({ io, socketUrl }) {

  io.connected = false
  io.reconnectAttempts = io.reconnectAttempts!==undefined
    ? io.reconnectAttempts+1
    : 0

  if (io.reconnectAttempts>5) {
    console.warn('Gave up trying to reconnect to web socket server. Refresh the browser when server is ready again.')
    io.reconnectAttempts = 0
    return false
  }

  let ws
  try {
    ws = new WebSocket(socketUrl)
  } catch(e) {
    return false
  }

  ws.onerror = e => io.emit('error', e)

  ws.onopen = e => {
    io.connected = true
    io.reconnectAttempts = 0
    io.emit('connect', e)
  }

  ws.onclose = e => {

    io.ws = null
    io.connected = false
    io.emit('disconnect', e)

    // Try reconnect: Make sure to set long enough interval,
    // because there will be another `onclose` event if it's not successful
    setTimeout(() => {
      console.log('Try connecting to web socket server', io.reconnectAttempts)
      io.ws = createWebSocketInstance({ io, socketUrl })
    }, 5000)
  }

  ws.onmessage = e => {

    const data = JSON.parse(e.data)
    const {
      serverRequestId,
      clientRequestId
    } = data

    if (clientRequestId) {

      const resolve = io.clientRequestListeners[clientRequestId]

      if (resolve) resolve(data)
      delete io.clientRequestListeners[clientRequestId]
      return
    }

    if (serverRequestId) {
      io.emit('serverRequest', data)
      return
    }

    io.emit('message', data)
  }
  
  return ws
}
