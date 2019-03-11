const path = require('path')
const createDefaultDatabase = require('@mna/db')
const defaultTypeActions = require('./defaultTypeActions')

const log = (...args) => console.log('@mna/content/type', ...args)

export const createType = async (props) => {

  const {
    state, setState,
    store: content,

    // Type config
    type,
    createDatabase,
    permissions = ['admin'],
    defaultContent = [],
    typeActions: customTypeActions = props.actions || {},
    middlewares = [],

    timestamp = false, // Automatic timestamp fields: created & updated
  } = props

  // Set from init
  const { config, stores, types, auth } = state

  // Actions config
  let typeActions = { ...defaultTypeActions, ...customTypeActions }
  const typeActionProps = {
    type,
    store: stores[type],
    content,
    config,
    auth,
    permissions
  }

  // Database

  if (!stores[type]) {
    stores[type] = createDatabase
      ? await createDatabase(typeActionProps)
      : createDatabase!==false
        ? await createDefaultDatabase({
          filename: `${ path.join(config.dataPath, type) }.db`,
          timestampData: timestamp,
          //...options
        })
        : {}
    typeActionProps.store = stores[type]
  }

  // API actions

  const boundTypeActions = Object.keys(typeActions).reduce((obj, key) => {

    obj[key] = function(data) {

      // TODO: Middlewares per action, field

      return typeActions[key]({
        ...typeActionProps,
        action: key,
        ...data
      })
    }

    return obj
  }, {})

  // Used by /api
  types[type] = {
    permissions,
    ...boundTypeActions
  }

  setState({ stores, types })

  // Default content

  if (defaultContent.length && !await stores[type].findOne()) {
    for (const item of defaultContent) {
      await types[type].create({
        data: item
      })
    }
  }
}
