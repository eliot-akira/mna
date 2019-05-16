const Datastore = require('./main/datastore')
const Logger = require('./main/logger')
const extendDatabaseMethods = require('./extend')
const extendLoggerMethods = require('./extend/logger')
//const { match } = require('./main/model')

const dbs = {}
const compactionInterval = 1000 * 60 * 60 * 24 // Every day

async function createDatabase(config) {

  const {
    filename,
    ensureIndex,
    defaultContent,
    logger = false,
    ...storeOptions
  } = config

  let db = dbs[filename]

  // Can be called multiple times

  if (!db) {
    const Store = logger ? Logger : Datastore
    const instance = await new Promise((resolve, reject) => {
      let i
      i = new Store({
        filename,
        autoload: true,
        onload: err => err ? reject(err) : resolve(i),
        ...storeOptions,
      })
    })

    if (logger) {
      dbs[filename] = db = extendLoggerMethods({ db, instance })
    } else {
      instance.persistence.setAutocompactionInterval(compactionInterval)
      dbs[filename] = db = extendDatabaseMethods({ db, instance })
    }
  }

  if (logger) return db

  // New or existing db

  if (defaultContent && ! await db.findOne()) {
    if (defaultContent instanceof Function) {
      await defaultContent({ db })
    } else {
      await db.insert(defaultContent)
    }
  }

  if (ensureIndex) {
    // opt = { fieldName, unique, sparse, expireAfterSeconds }
    for (let opt of ensureIndex) {
      await db.ensureIndex(opt)
    }
  }

  return db
}

module.exports = createDatabase
