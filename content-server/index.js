import createStore from '@mna/store'

const createState = () => ({
  auth: null,
  config: {},
  stores: {},
  types: {},
  currentRouteData: {}
})

const actions = {
  ...require('./init'),
  ...require('./type'),
  ...require('./auth'),
  ...require('./user'),
  ...require('./routes'),
  ...require('./api'),
}


const store = createStore({
  createState, actions
})

export default store