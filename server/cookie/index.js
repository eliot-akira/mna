const { parse: parseCookie } = require('cookie')

module.exports = function() {

  // Parse cookie

  return (req, res) => {
    req.cookies = parseCookie((req.headers && req.headers.cookie) || '')
  }
}