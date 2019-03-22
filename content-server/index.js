import createStore from '@mna/store'
import * as initActions from './init'
import * as typeActions from './type'
import * as authActions from './auth'
import * as userActions from './user'
import * as actionActions from './action'
import * as routesActions from './routes'
import * as apiActions from './api'

const createState = () => ({
  auth: null,
  config: {},
  stores: {},
  types: {}
})

const actions = {
  ...initActions,
  ...typeActions,
  ...authActions,
  ...userActions,
  ...actionActions,
  ...routesActions,
  ...apiActions,
}


const store = createStore({
  createState, actions
})

export default store
