const path = require('path')
const createDatabase = require('@mna/db')
const defaultTypeActions = require('./defaultTypeActions')

const log = (...args) => console.log('@mna/content/type', ...args)

export const createType = async (props) => {

  const {
    state, setState,

    // Type config
    type,
    databaseType = 'default',
    permissions = ['admin'],
    defaultContent = [],
    typeActions: customTypeActions = props.actions || {},
    middlewares = [],

    timestamp = false, // Automatic timestamp fields: created & updated
  } = props

  // Set from init
  const { config, stores, types, auth } = state

  // Database

  if (!stores[type]) {
    if (databaseType==='default') {
      stores[type] = await createDatabase({
        filename: `${ path.join(config.dataPath, type) }.db`,
        timestampData: timestamp,
        //...options
      })
    }
  }

  // API actions

  const typeActions = { ...defaultTypeActions, ...customTypeActions }
  const typeActionProps = {
    store: stores[type],
    config,
    type,
    auth,
    permissions
  }

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
