let Persistence = require('./persistence')
  , model = require('./model')
  , customUtils = require('./customUtils')
  , mkdirp = require('mkdirp')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')


function Logger({ onload, ...dbOptions }) {
  dbOptions.inMemoryOnly = false
  dbOptions.autoload = false

  // Make sure file and containing directory exist, create them if they don't
  mkdirp.sync(path.dirname(dbOptions.filename))
  if (!fs.existsSync(dbOptions.filename)) { fs.writeFileSync(dbOptions.filename, '', 'utf8') }

  this.persistence = new Persistence({ db: dbOptions })

  // Call onload *after* the instance has been returned
  if (onload) setImmediate(onload)
}

// docs can be one document or an array of documents
Logger.prototype.insert = function (_docs, cb) {
  let callback = cb || function () {}
    , docs = util.isArray(_docs) ? _docs : [_docs]
    , preparedDocs = []

  try {
    docs.forEach(function (doc) {
      preparedDocs.push(model.deepCopy(doc))
    })
    preparedDocs.forEach(function(doc) {
      doc.id = customUtils.uid(16)
      doc.created = new Date()
      model.checkObject(doc)
    })
    this.persistence.persistNewState(preparedDocs, callback)
  } catch (err) {
    return callback(err)
  }
}

// Interface
module.exports = Logger
