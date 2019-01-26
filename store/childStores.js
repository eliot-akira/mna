module.exports = function withChildStores(store, props, createStore) {

  store.childStores = {}

  const addChildStores = childStores => Object.keys(childStores).forEach(key => {

    const childStore = createStore(childStores[key])

    store.childStores[key] = childStore
    store.state[key] = childStore.getState()
    store.actions[key] = childStore.actions

    // Provide child store directly on store
    if (!store[key]) store[key] = childStore

    childStore.on('setState', childState => store.setState({
      [key]: childState
    }))

    childStore.on('action', ({ name, ...args }) => {
      store.emit('action', { name: `${key}.${name}`, ...args })
    })

    childStore.on('actionError', ({ name, ...args }) => {
      store.emit('actionError', { name: `${key}.${name}`, ...args })
    })
  })

  store.addChildStores = addChildStores

  if (props.stores) addChildStores(props.stores)

  return store
}