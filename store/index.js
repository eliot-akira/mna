import withEvent from '@mna/event'
import withState from './state'
import withActions from './actions'
import withChildStores from './childStores'

export default function createStore(props = {}) {

  const store = withEvent()

  withState(store, props)
  withActions(store, props)
  withChildStores(store, props, createStore)

  if (props.states) {
    props.states.forEach(({ createState, actions }) => {
      if (createState) store.extendState(createState)
      if (actions) store.extendActions(actions)
    })
  }

  return store
}