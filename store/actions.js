module.exports = function withActions(store, props) {

  const { state, getState, setState } = store

  const actionCallbacks = {}
  const actionContext = {}
  const boundActions = {}

  // Wrapper to pass state and bound actions to all actions
  const action = (name, props = {}, ...args) => {

    if (typeof props!=='object' || Array.isArray(props)) {
      args.unshift(props)
      props = { args }
    }

    if (!actionCallbacks[name]) {
      throw new Error(`Action "${name}" doesn't exist`)
    }

    const result = actionCallbacks[name]({
      state, getState, setState,
      actions: boundActions,
      store,
      props,
      ...actionContext,
      ...props,
    }, ...args)

    const done = () => {
      store.emit('action', { name, props, state })
      return result
    }

    if (result instanceof Promise) {
      return result.then(done)
    }

    return done()
  }

  const extendActions = (actions = {}) =>
    Array.isArray(actions)
      ? actions.forEach(extendActions)
      : Object.keys(actions).forEach(key => {

        if (typeof actions[key]!=='function') return

        actionCallbacks[key] = actions[key]
        boundActions[key] = (...args) => action(key, ...args)

        // Provide bound actions directly on store
        if (!store[key]) store[key] = boundActions[key]
      })

  // Context to pass to every action
  const setActionContext = obj => Object.assign(actionContext, obj)

  Object.assign(store, {
    actions: boundActions,
    extendActions,
    setActionContext,
  })

  if (props.actions) extendActions(props.actions)

  return store
}
