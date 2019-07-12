const { promisify } = require('util')

module.exports = function extendFind({ db, instance }) {

  // Find one: Wrap to accept empty query

  const findOne = promisify(instance.findOne.bind(instance))

  db.findOne = (query = {}, ...args) => findOne(query, ...args)

  // Find: Extend query with several operators

  db.find = (extendedQuery = {}, options = {}) => new Promise((resolve, reject) => {

    const {
      $page,
      $pageMax = 10,
      $sort, $skip,
      $include, $exclude, // Fields
      $projection = options.projection,
      $count,
      ...query
    } = extendedQuery

    if ($include) {
      $include.forEach(key => $projection[key] = 1)
    } else if ($exclude) {
      $exclude.forEach(key => $projection[key] = 0)
    }

    if (!$page) {

      let cursor = instance.find(query, $projection)

      if ($sort) cursor = cursor.sort($sort)
      if ($skip) cursor = cursor.skip($skip)

      return cursor.exec((err, docs) => err ? reject(err) : resolve(!docs ? [] :
        (!$count ? docs : docs.slice(0, parseInt($count, 10)))
      ))
    }

    // Paged result

    db.count(query).then(maxItems => {

      let cursor = instance.find(query, $projection)

      if ($sort) cursor = cursor.sort($sort)
      if ($skip) cursor = cursor.skip($skip)

      const maxPages = Math.ceil(maxItems / $pageMax)
      const startIndex = ($page - 1) * $pageMax
      const endIndex = $pageMax

      return cursor
        .skip(startIndex)
        .limit(endIndex)
        .exec((err, docs) => err ? reject(err) :
          resolve({
            result: docs,
            currentPage: $page,
            pageMax: $pageMax,
            maxItems,
            maxPages
          })
        )
    })
  })

  return db
}
