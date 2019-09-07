import { Component } from '@mna/react'

// Depends on content-client, content-server

const log = (...args) => console.log('withRouteData', ...args)

function createKeyWithDefault(props) {

  const {
    createKey,
    siteName = 'unknown',
    routeName, // See createRouteHandler
  } = props

  return !createKey ? `${siteName}/${
    routeName
  }` : createKey(props)
}

async function ensureRouteData(props) {

  const {
    state: localState, setState: localSetState,
    app = {}, // App-wide state/setState
    api, user,
    siteName = 'unknown',
    routeName, originalRouteName,
    createKey,
    getRouteData,
    isServer
  } = props

  const state = app.state || localState
  const setState = app.setState || localSetState

  // Must be the same as in RouteDataProvider
  const key = createKeyWithDefault(props)

  let currentRouteData = state.routeData[key]
  if (currentRouteData) return currentRouteData

  if (state.fetchingRouteData && state.fetchingRouteData[key]) {
    //log('Route data fetching', key)
    return
  }

  if (state.routeData && state.routeData[key]) return state.routeData[key]

  if (!api) {
    log('No api')
    return
  }

  setState({ fetchingRouteData: { ...state.fetchingRouteData, [key]: true } })


  //log('Fetch route data', key)

  currentRouteData = await getRouteData({ key, ...props }) || {}
  const { context: siteContext = {} } = currentRouteData

  setState({
    siteContext: {
      ...state.siteContext, ...siteContext
    },
    routeData: { ...state.routeData, [key]: currentRouteData },
    fetchingRouteData: { ...state.fetchingRouteData, [key]: false }
  })

  //log('Return route data', key)
  return currentRouteData
}

const withRouteData = (ensurerPropsOrFn) => C => {

  const ensurerProps = ensurerPropsOrFn instanceof Function
    ? { getRouteData: ensurerPropsOrFn }
    : ensurerPropsOrFn

  class RouteDataProvider extends Component {

    static serverAction = async (props) => {
      //log('RouteDataProvider.serverAction')
      await ensureRouteData({ ...ensurerProps, ...props, isServer: true })
    }

    constructor(props) {
      super(props)
    }

    ensureRouteData = () =>
      ensureRouteData({ ...ensurerProps, ...this.props })
        .catch(e => console.error('RouteDataProvider.ensureRouteData error', e))

    componentDidMount() {
      this.ensureRouteData()
    }
    componentDidUpdate() {
      this.ensureRouteData()
    }

    render() {

      const {
        state, setState,
        siteName = 'unknown',
        routeName, originalRouteName,
        createKey,
      } = this.props

      const key = createKeyWithDefault(this.props)
      const routeData = state.routeData[key]
      //const clearRouteData = () => setState({ routeData: { ...routeData, [key]: null } })

      return <C {...{ routeData, ...this.props }} />
    }
  }

  return RouteDataProvider
}

export default withRouteData
