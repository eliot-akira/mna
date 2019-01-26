
const log = (...args) => console.log('@mna/content/api', ...args)

// API action - called from /api with payload { type, action, data }
// See: ./route

export async function api(props) {

  const {
    type, action, data,
    state,
    auth, content, user,
    req, res
  } = props

  const { types } = state

  if (!type) throw { message: `Field "type" is required` }
  if (!action) throw { message: `Field "action" is required` }
  if (!types[type]) throw { message: `Type "${type}" doesn't exist` }
  if (!types[type][action]) throw { message: `Action "${action}" doesn't exist for type "${type}"` }

  // Default and content type actions are created in ../type

  return await types[type][action]({
    type, action, data,
    auth, content, types, user,
    req, res
  })
}
