import http from 'http'
import { Emitter } from '@mna/event'
import WebSocketServer from './lib/websocket-server'
import createSocketInstance from './socketInstance'

/*

Main library at ./lib is based on ws@6.2.0: https//github.com/websockets/ws

It was forked with changes:

- Remove dynamic requires of native dependencies to allow webpack bundling
- Remove permessage-deflate for no dependency on async-limiter

*/

// Call with http server instance and port config

export default function createWebSocketServer({
  appServer,
  port, socketPort,
  options = {}
}) {

  let wss

  if (port==socketPort) {
    wss = new WebSocketServer({
      server: appServer, ...options
    })
  } else {
    const server =  http.createServer()
    wss = new WebSocketServer({
      server, ...options
    })
    server.listen(socketPort)
  }

  const io = new Emitter

  io.wss = wss
  io.sockets = {}
  io.maxSocketId = 0
  io.serverRequestListeners = {}

  wss.on('connection', (ws, req) => {

    const socketId = ++io.maxSocketId

    let socket = createSocketInstance({
      io, ws, socketId
    })

    io.sockets[socketId] = socket
 
    ws.on('close', () => {
      delete io.sockets[socketId]
      socket.emit('disconnect')
      socket = null // Free!
    })
  
    io.emit('connect', socket, req)
  })

  wss.on('close', () => {
    io.emit('disconnect')
  })

  // io.off() can be called to reload listeners

  return io
}
