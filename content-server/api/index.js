
const log = (...args) => console.log('@mna/content/api', ...args)

// API action
// Called from /api or server-side via content.api
// Payload: { type, action, data }

export async function api(props) {

  const {
    // From client
    type, action, data,

    // From ./route or react-server/render
    content, user, req, res,

    state,
  } = props

  const { auth, types } = state

  if (!type) throw { message: `Field "type" is required` }
  if (!action) throw { message: `Field "action" is required` }
  if (!types[type]) throw { message: `Type "${type}" doesn't exist` }
  if (!types[type][action]) throw { message: `Action "${action}" doesn't exist for type "${type}"` }

  // Default and content type actions are created in ../type

  //log({ type, action, data })
  try {
    return await types[type][action]({
      types, type, action, data,
      auth, content, user, req, res
    })
  } catch (e) {
    log('Error', { type, action, data }, e)
    throw e
  }
}
