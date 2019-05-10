import axios from 'axios'

// responseType: 'arraybuffer', 'blob', 'document', 'json' (default), 'text', 'stream'

class API {

  // https://github.com/axios/axios#request-config
  static defaultOptions = {
    withCredentials: false
  }

  props: any
  axios: any

  constructor(props: any = {}) {

    const {
      url = '',
      prefix = '',
      options = {},
      mock,
      methods = ['get', 'post', 'put', 'delete']
    } = props

    this.props = { url, prefix, options, mock }

    methods.forEach((method: string) =>
      this[method] = (route: string, ...args) => this.request(method, route, ...args)
    )
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

    const { prefix, mock } = this.props

    if (mock) return mock({ method, route, params })

    // Init late, to allow setting default options
    if (!this.axios) this.init()

    // Expected arg syntax
    const args = ['get', 'delete'].indexOf(method) >= 0
      ? [{ params, ...options }]
      : [ params, options ]

    return new Promise((resolve, reject) => {

      this.axios[method](prefix+route, ...args)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {

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

/**
 * Set default options for subsequent requests
 * For example, to set absolute URL for server-side requests
 */
function setDefaultOptions(options) {
  Object.assign(API.defaultOptions, options)
}

interface APIInterface {
  // Methods
  [method: string]: (
    route: string,
    params?: { [key: string]: any },
    options?: { [key: string]: any }
  ) => Promise<any>,
}

const api = new API()

export default api
export { API, setDefaultOptions }
