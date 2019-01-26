const bcrypt = require('bcryptjs')
const jwt = require('./jwt') // jsonwebtoken
const { promisify } = require('util')

const compare = promisify(bcrypt.compare)
const genSalt = promisify(bcrypt.genSalt)
const hash = promisify(bcrypt.hash)

module.exports = async function createAuth({ config }) {

  const {
    tokenSecret = process.env.TOKEN_SECRET || 'random characters',
    expireDuration = 14 * 24 * 60 * 60 // 14 days in seconds
  } = config.auth || {}

  const
    compareHash = async (password, hashed) => {
      return await compare(password, hashed)
    },
    createHash = async (password) => {
      return await hash(password, await genSalt())
    },
    encodeToken = async (id, extra = {}) => {
      const now = Date.now() / 1000
      const payload = {
        sub: id, // Subject
        iat: now,
        exp: now + expireDuration,
        ...extra
      }
      return jwt.encode(payload, tokenSecret)
    },
    decodeToken = async (token, callback) => {
      const payload = jwt.decode(token, tokenSecret)
      const now = Date.now() / 1000

      // Check token expiration
      if (now > payload.exp) throw new Error('Token has expired')

      return payload
    }

  return {
    compareHash, createHash,
    encodeToken, decodeToken
  }
}
