import { serialize as makeCookie } from 'cookie'

// Authentication for all routes

const TOKEN_KEY = 'mna_jwt'
const emptyCookie = makeCookie(TOKEN_KEY, '', { path: '/', maxAge: 0 })

const log = (...args) => console.log('@mna/content/auth/middleware', ...args)

export default async function createAuthMiddleware({ auth, stores }) {

  const users = stores.user

  // Utilities

  // JSON web token

  const tokenFromUser = async (user) => {

    const sub = user.id // Subject

    return await auth.encodeToken(sub)
  }

  const userFromToken = async (token) => {

    const { sub } = await auth.decodeToken(token) || {}

    if (sub) return await users.findOne({ id: sub })
  }

  // Cookie

  auth.login = async (req, res, user) => {

    const domain = (req.headers.host || '').split(':')[0]

    const token = await tokenFromUser(user)

    const cookieOptions = {
      path: '/', // Important: for the whole domain
      maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
      domain,
      sameSite: 'strict', // No third-party
      //req.headers.origin || '', // Enable for subdomains
      //httpOnly: true, // Also prevents client-side delete
      //secure: true, // Requires HTTPS
    }

    //log('login/makeCookie', domain)

    // Cookie - See: https://github.com/jshttp/cookie
    res.setHeader('Set-Cookie', makeCookie(TOKEN_KEY, token, cookieOptions))
  }

  auth.logout = (res) => res.setHeader('Set-Cookie', emptyCookie)


  return async (req, res) => {

    req.context.user = null

    // Get token

    let token

    if (req.cookies) {

      token = req.cookies[TOKEN_KEY]

    } else if (req.headers && req.headers.authorization) {

      // TODO: From "Authorization: Bearer"

      token = req.headers.authorization.split(' ')[1]

      log('Check auth header', token)
    }

    if (!token) return

    // Get user and pass to all routes

    try {
      const user = await userFromToken(token)

      if (user) {
        req.context.user = user
      }

    } catch (e) {

      // TODO: Expired or invalid token

      log('Auth token expired or invalid')
    }

    // TODO: Consider CSRF token

    // https://github.com/pillarjs/csrf
    // https://github.com/pillarjs/understanding-csrf
  }
}
