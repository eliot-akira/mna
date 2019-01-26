
// https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/

const key = '__REDUX_DEVTOOLS_EXTENSION__'
const reduxDevTools =
  process.env.NODE_ENV!=='production'
  && typeof window !== 'undefined'
  && window[key]
    ? window[key] : null

module.exports = function connectReduxDevTools(name, store) {

  if (!reduxDevTools) return

  if (typeof name==='object') {
    store = name
    name = 'App'
  }

  const options = { serialize: true }
  const broadcaster = reduxDevTools.connect({ name })

  broadcaster.init(store.getState())

  store.on('action', ({ name, props, state }) => {
    broadcaster.send({ type: name, ...props },
      state, options, name
    )
  })
}