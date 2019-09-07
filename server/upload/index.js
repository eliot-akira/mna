
const fileUpload = require('./middleware')

/*
Example use:

const { send } = require('micro')
const { upload, move } = require('micro-upload')

module.exports = upload(async (req, res) => {
  if (!req.files) {
    return send(res, 400, 'no file uploaded')
  }

  let file = req.files.file
  await move(file, `/tmp/uploads/${file.name}`)
  send(res, 200, 'upload success')
})
*/

exports.upload = function upload (opts, fn) {
  if (!fn) {
    fn = opts
    opts = {}
  }

  const handler = fileUpload(opts)

  return (req, res) => {
    return new Promise(resolve => handler(req, res, resolve))
      .then(() => fn(req, res))
  }
}

exports.move = function move (src, dst) {
  return new Promise((resolve, reject) => {
    if (!src || typeof src.mv !== 'function') {
      reject(new TypeError('First argument must be an upload file object'))
    }

    src.mv(dst, err => {
      if (err) return reject(err)

      resolve()
    })
  })
}
