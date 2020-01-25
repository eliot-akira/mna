import Emitter from '@mna/event/Emitter'

// Converted to class for efficient memory use in method creation

class Socket extends Emitter {

  constructor({ io, ws, socketId }) {

    super()

    this.io = io
    this.ws = ws
    this.id = socketId

    this._clientRequestListener = null

    ws.on('message', this._onMessage)
  }

  _onMessage = (rawData, req) => {

    const socket = this

    const data = JSON.parse(rawData)
    const {
      serverRequestId,
      clientRequestId
    } = data

    // Client request that waits for matching server response
    if (clientRequestId) {
      this._onClientRequest(data, req)
      return
    }

    // Client response for matching server request
    if (serverRequestId) {
      this._onClientResponse(data, req)
      return
    }

    socket.emit('message', data, req)
  }

  _onClientRequest = (data, req) => {

    const socket = this
    const { clientRequestId } = data
    const fn = this._clientRequestListener
    const sendServerResponse = response =>
      socket.send({
        clientRequestId,
        ...response
      })


    if (!fn) {
      sendServerResponse({
        error: { message: 'No listener for client request' }
      })
      return
    }

    fn(data)
      .then(result => {
        sendServerResponse(result || {})
      })
      .catch(error => {
        sendServerResponse({
          error: { message: error.message }
        })
      })
  }

  _onClientResponse = (data, req) => {

    const { io } = this
    const { serverRequestId } = data
    const fn = io.serverRequestListeners[serverRequestId]

    if (fn) fn(data)
    delete io.serverRequestListeners[serverRequestId]
  }

  send = (data) => {
    const { ws } = this
    if (!ws || !ws.isOpen()) {
      // Socket not available
      return false
    }
    ws.send(JSON.stringify(data))
    return true
  }

  // Server response for matching client request
  handleClientRequest = fn => {
    this._clientRequestListener = fn
  }

  // Server request that waits for matching client response
  request = (data = {}) => new Promise((resolve, reject) => {

    const { io } = this
    const socket = this

    const requestId = Date.now()

    io.serverRequestListeners[requestId] = resolve
    socket.send({ ...data, serverRequestId: requestId })
  })

}

export default function createSocketInstance(props) {
  return new Socket(props)
}
