// Based on micro

// Native
const createServer = require('http').Server
const { Stream } = require('stream')

// Packages
const contentType = require('content-type')
const getRawBody = require('raw-body')
const { readable } = require('is-stream')

const { NODE_ENV } = process.env
const DEV = NODE_ENV === 'development'

const send = (res, code, obj = null) => {
  res.statusCode = code

  if (obj === null) {
    res.end()
    return
  }

  if (Buffer.isBuffer(obj)) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/octet-stream')
    }

    res.setHeader('Content-Length', obj.length)
    res.end(obj)
    return
  }

  if (obj instanceof Stream || readable(obj)) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/octet-stream')
    }

    obj.pipe(res)
    return
  }

  let str = obj

  if (typeof obj === 'object' || typeof obj === 'number') {
    // We stringify before setting the header
    // in case `JSON.stringify` throws and a
    // 500 has to be sent instead

    // the `JSON.stringify` call is split into
    // two cases as `JSON.stringify` is optimized
    // in V8 if called with only one argument
    if (DEV) {
      str = JSON.stringify(obj, null, 2)
    } else {
      str = JSON.stringify(obj)
    }

    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
  }

  res.setHeader('Content-Length', Buffer.byteLength(str))
  res.end(str)
}

const createError = (code, message, original) => {
  const err = new Error(message)

  err.statusCode = code
  err.originalError = original

  return err
}

const sendError = (req, res, errorObj) => {
  const statusCode = errorObj.statusCode || errorObj.status
  const message = statusCode ? errorObj.message : 'Internal Server Error'
  send(res, statusCode || 500, DEV ? errorObj.stack : message)
  if (errorObj instanceof Error) {
    console.error(errorObj.stack)
  } else {
    console.warn('thrown error must be an instance Error')
  }
}

const run = (req, res, fn) =>
  new Promise(resolve => resolve(fn(req, res)))
    .then(val => {
      if (val === null) {
        send(res, 204, null)
        return
      }

      // Send value if it is not undefined, otherwise assume res.end
      // will be called later
      if (undefined !== val) {
        send(res, res.statusCode || 200, val)
      }
    })
    .catch(err => sendError(req, res, err))

// Maps requests to buffered raw bodies so that
// multiple calls to `json` work as expected
const rawBodyMap = new WeakMap()

const parseJSON = str => {
  try {
    return JSON.parse(str)
  } catch (err) {
    console.log('BAD JSON', str)
    throw createError(400, 'Invalid JSON', err)
  }
}

const buffer = (req, { limit = '1mb', encoding } = {}) =>
  Promise.resolve().then(() => {
    const type = req.headers['content-type'] || 'text/plain'
    const length = req.headers['content-length']

    if (encoding === undefined) {
      encoding = contentType.parse(type).parameters.charset
    }

    const body = rawBodyMap.get(req)

    if (body) {
      return body
    }

    return getRawBody(req, { limit, length, encoding })
      .then(buf => {
        rawBodyMap.set(req, buf)
        return buf
      })
      .catch(err => {
        if (err.type === 'entity.too.large') {
          throw createError(413, `Body exceeded ${limit} limit`, err)
        } else {
          throw createError(400, 'Invalid body', err)
        }
      })
  })

const text = (req, { limit, encoding } = {}) =>
  buffer(req, { limit, encoding }).then(body => body.toString(encoding))

const json = (req, opts) =>
  text(req, opts).then(body => parseJSON(body))

const base = fn => createServer((req, res) => run(req, res, fn))

// Create request handler without http.Server instance
// Can be used to hot-reload server
const serve = fn => (req, res) => run(req, res, fn)

Object.assign(base, {
  serve,
  buffer, text, json,
  send, sendError, createError,
  redirect: require('./redirect'),
  status: require('./status'),
  onExit: require('./exit'),
  ...require('./static'),
  ...require('./router') // router, route
})

module.exports = base
