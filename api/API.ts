import axios, { AxiosError } from 'axios'

type ApiMethod = (route: string, params: any, options?: any) => Promise<any>

export default class API {

  // https://github.com/axios/axios#request-config
  static defaultOptions = {
    responseType: 'json', // 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
    withCredentials: false,
  }

  props: any
  axios: any
  mock: boolean
  mockApi: (req: { method: string, route: string, params: any }) => any

  get: ApiMethod
  post: ApiMethod
  put: ApiMethod
  delete: ApiMethod


  /**
   * Set default options for subsequent requests
   * For example, to set absolute URL for server-side requests
   */
  setDefaultOptions(options: any) {
    Object.assign(API.defaultOptions, options)
  }

  // TypeScript can't use index signature for class instance..
  //[method: string]: ApiMethod //(route: string, params: any, options?: any) => Promise<any>

  constructor(props: any = {}) {

    const {
      url = '',
      prefix = '',
      options = {},
      mock,
      //methods = ['get', 'post', 'put', 'delete']
    } = props

    this.props = { url, prefix, options, mock }
    this.mock = mock ? true : false
    this.mockApi = mock || (async () => ({}))

    // methods.forEach((method: string) =>
    //   this[method] = (route: string, ...args) => this.request(method, route, ...args)
    // )

    this.get = (route, ...args) => this.request('get', route, ...args)
    this.post = (route, ...args) => this.request('post', route, ...args)
    this.put = (route, ...args) => this.request('put', route, ...args)
    this.delete = (route, ...args) => this.request('delete', route, ...args)
  }

  init() {
    const { url = '', options = {} } = this.props
    this.axios = axios.create({
      baseURL: url,
      ...API.defaultOptions,
      ...options
    })
  }

  request(method: string, route: string, params = {}, options = {}) {

    const { prefix } = this.props
    const { mock: singleMock = this.mock } = options as any

    if (singleMock) return this.mockApi({ method, route, params })

    // Init late, to allow setting default options
    if (!this.axios) this.init()

    // Expected arg syntax
    const args = ['get', 'delete'].indexOf(method) >= 0
      ? [{ params, ...options }]
      : [ params, options ]

    return new Promise((resolve, reject) => {

      this.axios[method](prefix+route, ...args)
        .then((response: any) => {
          const { data } = response
          resolve(data)
        })
        .catch((error: AxiosError) => {

          // https://github.com/axios/axios#handling-errors

          if (error.response) {
            // Request was made and server responded with a status code not 2xx
            const { status, statusText, data } = error.response
            reject({
              status,
              message: statusText,
              data
            })
            return
          }

          if (error.request) {
            reject({
              status: 504, // Gateway Timeout
              message: 'Request was made but no response was received'
            })
            return
          }

          reject({
            status: 400, // Bad Request
            message: error.message || 'Request failed'
          })
        })
    })
  }
}
