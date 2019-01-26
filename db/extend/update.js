module.exports = function extendUpdate({ db, instance }) {

  // Update with $multi, $replace, $upsert

  db.update = (query = {}, props, options = {}) => new Promise((resolve, reject) => {

    // TODO: Simplify query and props

    if (!props) {
      const { id, name, ...restOfQuery } = query
      if (id || name) {
        query = { id, name }
        props = { name, ...restOfQuery }
      } else {
        const { query: updateQuery, ...restOfProps } = query
        query = updateQuery
        props = restOfProps
        if (!query) {
          reject(new Error('Database update needs "id" or "query"'))
          return
        }
      }
    }

    const {
      $replace = options.replace,
      $multi = options.multi,
      $upsert = options.upsert,
      id, // Remove ID from data, as it shouldn't change
      ...data
    } = props

    const method = $multi ? 'find' : 'findOne'
    const withModifier = Object.keys(data).filter(key => key[0]==='$').length

    // Clear undefined query keys, to not interfere with find/findOne below
    Object.keys(query).forEach(key => {
      if (typeof query[key]==='undefined') delete query[key]
    })

    return db[method](query).then(docs => {

      if (!docs) {
        if (!$upsert) return resolve(0)
        return db.insert(data).then(resolve).catch(reject)
      }
      if (!$multi) docs = [docs]

      docs.forEach(doc => {

        const { id, ...origData } = doc

        const newData = ($replace || withModifier) ? data
          // Shallow merge
          : { ...origData, ...data }

        // Prevent mixing modifiers and normal fields
        if (withModifier) {
          Object.keys(newData).forEach(key => {
            if (key[0]==='$') return
            if (!newData.$set) newData.$set = {}
            newData.$set[key] = newData[key]
            delete newData[key]
          })
        }

        // Original update function
        instance.update(
          { id },
          newData,
          options,
          (err, num) => err ? reject(err) : resolve(num)
        )
      })
    }).catch(reject)
  })

  return db
}