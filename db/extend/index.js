const { promisify } = require('util')
const extendFind = require('./find')
const extendUpdate = require('./update')
const extendRemove = require('./remove')

function extendDatabaseMethods({ db, instance }) {

  const methods = [
    'insert',
    'count',
    'ensureIndex',
    'removeIndex'
  ]

  db = methods.reduce((api, method) => {
    api[method] = promisify(instance[method].bind(instance))
    return api
  }, {})

  extendFind({ db, instance })
  extendUpdate({ db, instance })
  extendRemove({ db, instance })

  // Alias
  db.create = db.insert
  db.upsert = (query, props, ...args) =>
    db.update(query, { $upsert: true, ...props }, ...args)

  db.close = function () {
    return new Promise((resolve, reject) => {
      instance.persistence.stopAutocompaction()
      instance.persistence.compactDatafile(resolve)
    })
  }

  return db
}

module.exports = extendDatabaseMethods
