/*!
 * serve-static
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2014-2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var encodeUrl = require('encodeurl')
var escapeHtml = require('escape-html')
var parseUrl = require('parseurl')
var path = require('path')
var send = require('./send')
var url = require('url')

/**
 * Module exports.
 * @public
 */

module.exports = serveStatic
module.exports.mime = send.mime

/**
 * @param {string} root
 * @param {object} [options]
 * @return {function}
 * @public
 */

function serveStatic (root, options) {

  if (!root) {
    throw new TypeError('root path required')
  }

  let getRoot

  if (typeof root === 'string') {
    //getRoot = () => root
  } else if (typeof root === 'function') {
    getRoot = root
  } else {
    throw new TypeError('root path must be a string or function')
  }

  // copy options object
  var opts = Object.create(options || null)

  // fall-though
  var fallthrough = opts.fallthrough !== false

  // default redirect
  var redirect = opts.redirect !== false

  // headers listener
  var setHeaders = opts.setHeaders

  if (setHeaders && typeof setHeaders !== 'function') {
    throw new TypeError('option setHeaders must be function')
  }

  // setup options for send
  opts.maxage = opts.maxage || opts.maxAge || 0
  if (!getRoot) opts.root = path.resolve(root)
  opts.index = opts.index===undefined ? false : opts.index

  // construct directory listener
  var onDirectory = redirect
    ? createRedirectDirectoryListener()
    : createNotFoundDirectoryListener()

  return function serveStatic (req, res) {
    return new Promise((resolve, reject) => {

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (fallthrough) return resolve()
        // method not allowed
        res.statusCode = 405
        res.setHeader('Allow', 'GET, HEAD')
        res.setHeader('Content-Length', '0')
        res.end()
        resolve()
      }

      var forwardError = !fallthrough
      var originalUrl = parseUrl.original(req)
      var pathname = parseUrl(req).pathname


      // make sure redirect occurs at mount
      if (pathname === '/' && originalUrl.pathname.substr(-1) !== '/') {
        pathname = ''
      }

      if (getRoot) opts.root = getRoot({ pathname, req })

      // create send stream
      var stream = send(req, pathname, opts)

      // add directory handler
      stream.on('directory', onDirectory)

      // add headers listener
      if (setHeaders) {
        stream.on('headers', setHeaders)
      }

      // add file listener for fallthrough
      if (fallthrough) {
        stream.on('file', function onFile () {
        // once file is determined, always forward error
          forwardError = true
        })
      }

      // forward errors
      stream.on('error', function error (err) {
        if (forwardError || !(err.statusCode < 500)) reject(err)
        else resolve()
      })

      // pipe
      stream.pipe(res)

    })
  }
}

/**
 * Collapse all leading slashes into a single slash
 * @private
 */
function collapseLeadingSlashes (str) {
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) !== 0x2f /* / */) {
      break
    }
  }

  return i > 1
    ? '/' + str.substr(i)
    : str
}

/**
 * Create a minimal HTML document.
 *
 * @param {string} title
 * @param {string} body
 * @private
 */

function createHtmlDocument (title, body) {
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<meta charset="utf-8">\n' +
    '<title>' + title + '</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n'
}

/**
 * Create a directory listener that just 404s.
 * @private
 */

function createNotFoundDirectoryListener () {
  return function notFound () {
    this.error(404)
  }
}

/**
 * Create a directory listener that performs a redirect.
 * @private
 */

function createRedirectDirectoryListener () {
  return function redirect (res) {
    if (this.hasTrailingSlash()) {
      this.error(404)
      return
    }

    // get original URL
    var originalUrl = parseUrl.original(this.req)

    // append trailing slash
    originalUrl.path = null
    originalUrl.pathname = collapseLeadingSlashes(originalUrl.pathname + '/')

    // reformat the URL
    var loc = encodeUrl(url.format(originalUrl))
    var doc = createHtmlDocument('Redirecting', 'Redirecting to <a href="' + escapeHtml(loc) + '">' +
      escapeHtml(loc) + '</a>')

    // send redirect response
    res.statusCode = 301
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.setHeader('Content-Length', Buffer.byteLength(doc))
    res.setHeader('Content-Security-Policy', "default-src 'self'")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Location', loc)
    res.end(doc)
  }
}