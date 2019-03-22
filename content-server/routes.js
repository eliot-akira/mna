import createCookieMiddleware from '@mna/server/cookie'
import createJsonMiddleware from '@mna/server/json'
import createAuthMiddleware from './auth/middleware'
import createApiMiddleware from './api/route'

export async function createRoutes(props) {

  // Route props from react/server
  const { state, actions, config } = props
  const { auth, stores } = state

  return [

    createCookieMiddleware(),
    createJsonMiddleware(),

    await createAuthMiddleware({ auth, stores }),

    createApiMiddleware({ ...props, auth })
  ]
}
