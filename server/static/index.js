const serveStatic = require('./middleware')
const { mime } = serveStatic

module.exports = {
  serveStatic,
  mime
}