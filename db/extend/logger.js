const { promisify } = require('util')

function extendLoggerMethods({ db, instance }) {

  const methods = ['insert']

  db = methods.reduce((api, method) => {
    api[method] = promisify(instance[method].bind(instance))
    return api
  }, {})

  // Alias
  db.create = db.insert

  return db
}

module.exports = extendLoggerMethods
