const parseUrl = require('url').parse
const parsePath = require('path').parse
const UrlPattern = require('url-pattern')

const patterns = {} // [method][path]
const patternOpts = { segmentNameCharset: 'a-zA-Z0-9_-' }
const stripEndSlash = c => (c!=='/' && c[c.length - 1]==='/') ? c.slice(0, -1) : c
const ensureFrontSlash = (c = '') => ((!c || c[0]!=='/') ? '/' : '')+c

const routeContext = req => {

  const { pathname, query } = parseUrl(req.url, true)
  const name = stripEndSlash(pathname)
  const {
    base: fileName,
    name: fileBase,
    ext: extension
  } = parsePath(name) // dir, root, base, name, ext

  const [site, port] = req.headers.host.split(':') // Without protocol

  req.pathname = name
  req.query = query
  req.context = {
    route: {
      // .params may be set by method handler
      name, query,
      fileName, fileBase, extension,
      site, port,
      https: req.connection.encrypted ? true : false,
    },
  }
}

// Router

const router = (...handlers) => async (req, res) => {

  // Route context
  if (!req.context) routeContext(req)
  if (handlers[0] && Array.isArray(handlers[0])) {
    const fns = handlers.shift()
    handlers.unshift(...fns)
  }

  // Run handlers
  for (const fn of handlers) {
    if (!(fn instanceof Function)) continue
    const result = await fn(req, res)
    if (result || res.headersSent) return result
  }
}

// Methods

const methodFn = method => (path, ...handlers) => {

  if (path instanceof Function) {
    handlers.unshift(path)
    path = '*'
  }
  if (!path) throw new Error('You need to set a valid path')

  if (!handlers.length) throw new Error('You need to set a valid handler')

  const isRoute = method==='route'
  const handler = handlers.length===1 ? handlers[0] : router(...handlers)
  const matchPath = path==='*' ? '(/*)' : ensureFrontSlash(path)
  const matchMethod = method === 'del' ? 'DELETE' : method.toUpperCase()

  return async (req, res) => {

    if (!isRoute && req.method !== matchMethod) return

    const matchParent = req.matchParent || ''
    const matchCurrent = stripEndSlash(matchParent+matchPath)
    const check = matchCurrent+(isRoute ? '(/*)' : '')

    if (!patterns[method]) patterns[method] = {}
    if (!patterns[method][check]) {
      patterns[method][check] = new UrlPattern(check, patternOpts)
    }

    const params = patterns[method][check].match(req.pathname)
    if (!params) return

    req.params = params
    req.context.route.params = params

    if (!isRoute) return await handler(req, res)

    // Add current match to child routes, then restore
    req.matchParent = matchCurrent
    const result = await handler(req, res)
    req.matchParent = matchParent

    return
  }
}

;['get', 'post', 'put', 'del', 'route' /*, 'patch', 'head', 'options'*/]
  .forEach(method => router[method] = methodFn(method))

router.router = router // Alias

module.exports = router