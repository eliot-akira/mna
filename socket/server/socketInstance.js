import { Emitter } from '@mna/event'

// Converted to class for efficient memory use in method creation

class Socket extends Emitter {

  constructor({ io, ws, socketId }) {
    super()
    this.io = io
    this.ws = ws
    this.id = socketId

    ws.on('message', this._onSocketMessage)
  }

  _onSocketMessage = (rawData, req) => {

    const { io } = this
    const socket = this

    const data = JSON.parse(rawData)
    const {
      serverRequestId,
      clientRequestId
    } = data

    // R1. Client response for matching server request
    if (serverRequestId) {

      const resolve = io.serverRequestListeners[serverRequestId]

      if (resolve) resolve(data)
      delete io.serverRequestListeners[serverRequestId]
      return
    }

    // R2. Client request that waits for matching server response
    if (clientRequestId) {
      socket.emit('clientRequest', data, req)
      return
    }

    socket.emit('message', data, req)
  }

  send = (data) => {
    const { ws } = this
    if (!ws) return false
    ws.send(JSON.stringify(data))
    return true
  }

  // R1. Server request that waits for matching client response
  request = (data = {}) => new Promise((resolve, reject) => {

    const { io } = this
    const socket = this

    const requestId = Date.now()

    io.serverRequestListeners[requestId] = resolve
    socket.send({ ...data, serverRequestId: requestId })      
  })

  // R2. Server response for matching client request
  handleClientRequest = fn => {

    const socket = this

    socket.on('clientRequest', async data => {

      const { clientRequestId } = data
  
      let result
      try {
        result = await fn(data)
      } catch(e) { /**/ }
  
      socket.send({
        clientRequestId,
        ...(result || {})
      })
    })  
  }
}

export default function createSocketInstance(props) {
  return new Socket(props)
}
