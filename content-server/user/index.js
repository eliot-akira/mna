import * as typeActions from './typeActions'



export const initUser = async({ setState, actions, config }) => {

  await actions.createType({
    type: 'user',

    permissions: [
      'admin',
      //'self'
      // TODO: { role: 'self', actions: ['findOne', 'update', 'register'] }
    ],

    defaultContent: [
      { name: 'admin', password: 'admin', role: ['admin'] }
    ],

    typeActions
  })
}

export { cleanUserData } from './utils'
