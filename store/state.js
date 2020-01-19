export default function withState(store, props) {

  const state = {}
  const getState = key => key ? state[key] : state
  const setState = (newState = {}, options = {}) => {

    // Keep reference to same object

    if (options.reset) {
      Object.keys(state).forEach(key => delete state[key])
    }

    Object.assign(state, newState)

    if (options.silent) return

    store.emit('setState', state)
  }

  const extendState = fn =>
    Array.isArray(fn)
      ? fn.forEach(extendState)
      : Object.assign(state, fn instanceof Function ? fn() : fn)

  Object.assign(store, {
    state, getState, setState, extendState
  })

  if (props.state) props.createState = () => JSON.parse(JSON.stringify(props.state))
  if (props.createState) extendState(props.createState)

  return store
}
