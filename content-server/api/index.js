
const log = (...args) => console.log('@mna/content/api', ...args)

// API action - called from /api with payload { type, action, data }
// See: ./route

export async function api(props) {

  const {
    // From client
    type, action, data,

    // From ./route - Not available when called directly from serverAction
    auth, content, user, req, res,

    state,
  } = props

  const { types, currentRouteData = {} } = state

  if (!type) throw { message: `Field "type" is required` }
  if (!action) throw { message: `Field "action" is required` }
  if (!types[type]) throw { message: `Type "${type}" doesn't exist` }
  if (!types[type][action]) throw { message: `Action "${action}" doesn't exist for type "${type}"` }

  // Default and content type actions are created in ../type

  //log({ type, action, data })
  try {
    return await types[type][action]({
      types, type, action, data,
      auth, content, user, req, res,
      ...currentRouteData
    })
  } catch (e) {
    log('Error', { type, action, data }, e)
    throw e
  }
}
