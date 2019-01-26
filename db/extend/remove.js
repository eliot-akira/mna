const { promisify } = require('util')

function extendRemove({ db, instance }) {

  // Remove: Wrap to accept $multi

  const remove = promisify(instance.remove.bind(instance))

  db.remove = (query = {}, options = {}) => {

    const { $multi, ...restOfQuery } = query

    if ($multi) options.multi = true

    return remove(restOfQuery, options)
  }

  return db
}

module.exports = extendRemove