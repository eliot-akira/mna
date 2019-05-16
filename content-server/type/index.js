import path from 'path'
import createDefaultDatabase from '@mna/db'
import defaultTypeActions from './defaultTypeActions'

const log = (...args) => console.log('@mna/content/type', ...args)

export const createType = async (props) => {

  const {
    state, setState,
    store: content,

    // Type config
    type,
    createDatabase,
    permissions = [],
    defaultContent = [],
    typeActions: customTypeActions = props.actions || {},
    middlewares = [],
    ensureIndex = [], // [ { fieldName, expireAfterSeconds? } ]
    logger = false,
    timestamp = props.logger ? true : false, // Automatic timestamp fields: created & updated
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
          ensureIndex,
          logger
          //...options
        })
        : {} // No database
    typeActionProps.store = stores[type]
  }

  // Used by /api
  types[type] = {
    permissions,
  }

  const addActions = (actionsDefinition) => {
    for (const key in actionsDefinition) {

      types[type][key] = function(data) {

        // TODO: Middlewares per action, field

        return actionsDefinition[key]({
          ...typeActionProps,
          action: key,
          ...data
        })
      }
    }
  }

  // For internal use for late binding
  // Prefixed to avoid name collision with type "action" in ../action
  types[type]._addActions = addActions

  addActions(typeActions)
  setState({ stores, types })

  // Default content

  if (defaultContent.length && !await stores[type].findOne()) {
    for (const item of defaultContent) {
      await types[type].create({ data: item })
    }
  }

  // Use content.api to interact with data types and actions
}

export const addTypeActions = ({ type, typeActions, state, setState }) => {

  const { types } = state

  types[type]._addActions(typeActions)

  setState({ types })
}
