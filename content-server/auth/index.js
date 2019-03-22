import createAuth from '@mna/auth'

export const initAuth = async({ setState, actions, config }) => {

  setState({
    auth: await createAuth({ config })
  })
}
