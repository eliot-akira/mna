
export const initAction = async({ actions }) => {

  // Generic actions called from client by content.api, type "action"
  // See ../api

  await actions.createType({
    type: 'action',
    createDatabase: false,
  })
}

export const addActions = ({ props: typeActions, actions }) => {
  actions.addTypeActions({
    type: 'action',
    typeActions
  })
}
