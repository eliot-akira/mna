
export const init = async (props) => {

  // Called from lib/react-server

  const { state, actions, setState, config } = props

  setState({ config })
  await actions.initAuth(props)
  await actions.initUser(props)
  await actions.initAction(props)

  return await actions.createRoutes(props)
}
