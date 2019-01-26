import axios from 'axios'

export class API {

  static methods = ['get', 'post', 'put', 'delete']

  // https://github.com/axios/axios#request-config
  static defaultOptions = {
    withCredentials: false
  }

  constructor(props = {}) {
    const { url = '', prefix = '', options = {} } = props
    this.prefix = prefix
    API.methods.forEach(method => this.createMethod(method, url, prefix, options))
  }

  init({ url = '', axiosOptions = {} }) {
    this.axios = axios.create({ baseURL: url, ...API.defaultOptions, ...axiosOptions })
  }

  createMethod(method, url, prefix, axiosOptions) {

    this[method] = (route, params = {}, options = {}) => {

      // Init late, to allow setting default options
      if (!this.axios) this.init({ url, prefix, axiosOptions })

      // Expected arg syntax
      const args = ['get', 'delete'].indexOf(method) >= 0
        ? [{ params, ...options }]
        : [ params, options ]

      return new Promise((resolve, reject) => {

        this.axios[method](this.prefix+route, ...args)
          .then(response => {
            const { data } = response
            resolve(data)
          })
          .catch(error => {

            // https://github.com/axios/axios#handling-errors

            if (error.response && error.response.data) reject(error.response.data)
            //else if (error.message) reject(error.message)
            else reject(error)
          })
      })
    }
  }
}

/*
Server-side requests must be absolute URL
Set options before first request with server-specific options
*/
export function setDefaultOptions(options) {
  API.defaultOptions = {
    ...API.defaultOptions,
    ...options
  }
}

const api = new API()

export default api
