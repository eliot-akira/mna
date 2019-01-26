module.exports = (server, context) => {

  // Clean exit

  const onExit = () => {
    server.close()
    process.exit(0)
  }

  const onError = (err) => {
    console.error('Server error', err)
    server.close()
    process.exit(0)
  }

  process.on('SIGINT', onExit)
  process.on('SIGTERM', onExit)
  process.on('exit', onExit)
  process.on('uncaughtException', onError)  
}
