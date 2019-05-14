import getPermissionProps from './permissions'

const log = (...args) => console.log('@mna/content-server/api', ...args)

// API action
// Called from /api or server-side via content.api
// Request payload: { type, action, data }

export async function api(props) {

  const {
    // From client
    type, action, data,

    // From ./route or react-server/render
    content, user, req, res,

    // Content server store
    state, actions
  } = props

  const { auth, types } = state

  if (!type) throw { message: `Field "type" is required` }
  if (!action) throw { message: `Field "action" is required` }
  if (!types[type]) throw { message: `Type "${type}" doesn't exist` }
  if (!types[type][action]) throw { message: `Type "${type}" doesn't have action "${action}"` }

  const { permissions = [] } = types[type]
  const actionProps = {
    type, action, data,
    types, content, auth,
    user, permissions, req, res
  }

  Object.assign(actionProps, getPermissionProps(actionProps))

  // Default and content type actions are created in ../type

  //log({ type, action, data })
  try {
    return await types[type][action](actionProps)
  } catch (e) {
    log('Error', { type, action, data }, e)
    throw e
  }
}
