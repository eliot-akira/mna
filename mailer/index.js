const nodemailer = require('nodemailer')
const defaultConfig  = { sendmail: true }

module.exports = (config = defaultConfig) => {

  // See: https://nodemailer.com

  const { sendMail } = nodemailer.createTransport(config)

  return (message) => new Promise((resolve, reject) => {
    sendMail(message, (err, info) => {
      if (err) return reject(err)
      resolve(info)
    })
  })
}