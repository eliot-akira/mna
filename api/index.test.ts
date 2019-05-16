import http, { Server, IncomingMessage, ServerResponse } from 'http'
import url from 'url'
import api, { API } from './index'

declare var test: {
  (title: string, fn: (it: (title: string, pass: any) => void) => void): void,
  setup(fn: () => Promise<void> | void): void
}

const serverPort = process.env.TEST_SERVER_PORT || 2222
const serverUrl = `http://localhost:${serverPort}/`

let server: Server

test.setup(() => {

  server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

    const method =  req.method.toLowerCase()
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

    const query = parsedUrl.query
    let body: any = ''

    req.on('data', data => body += data)
    req.on('end', function() {

      try {
        body = JSON.parse(body)
      } catch(e) { /**/ }

      const shouldError = query.error || body.error

      res.statusCode = shouldError ? 500 : 200
      res.setHeader('Content-Type', 'application/json')

      // Return array to ensure order
      res.end(JSON.stringify([method, pathname, query, body]))
    })
  })

  server.listen(serverPort)
})

const methods = ['get', 'post', 'put', 'delete']

test('api', async it => {

  it('default export exists', api)

  for (const method of methods) {
    it(`has method api.${method}`, api[method])
  }
})

for (const method of methods) {

  test(`api.${method}`, async it => {

    let result = await api[method](`${serverUrl}/test`, { key: 'value' })

    it('succeeds', result)
    it('parses JSON response', Array.isArray(result))

    it(`method: ${method}`, result[0]===method)
    it(`pathname: test`, result[1]==='test')
    if (['get', 'delete'].includes(method)) {
      it(`query: key=value`, result[2].key && result[2].key==='value')
    } else {
      it(`body: { key: 'value' }`, result[3].key && result[3].key==='value')
    }

    try {
      result = await api[method](serverUrl, { error: true })
      it('rejects on error', false)
    } catch(e) {
      it('rejects on error', true)
      it('error.status', e.status===500)
      it('error.message', e.message)
      it('error.data', e.message)
    }

  })
}

test('api.mock', async it => {

  const mockApi = new API({
    mock: (data) => {
      it('calls mock function', true)
      it('calls mock function with data', data)
    }
  })

  it('exists', mockApi)

  await mockApi.get('/test', { key: 'value' })
})

test.setup(() => {
  server.close()
})
