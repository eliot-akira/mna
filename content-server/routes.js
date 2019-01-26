const createAuthMiddleware = require('./auth/middleware')

export async function createRoutes(props) {

  // Route props from react/server
  const { state, actions, config } = props
  const { auth, stores } = state

  return [

    require('@mna/server/cookie')(),
    require('@mna/server/json')(),

    await createAuthMiddleware({ auth, stores }),

    require('./api/route')({ ...props, auth })
  ]
}
