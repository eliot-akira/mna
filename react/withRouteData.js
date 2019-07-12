import { Component } from '@mna/react'

// Depends on content-client, content-server

const log = (...args) => console.log('withRouteData', ...args)

async function ensureRouteData(props) {

  const {
    actions, state, setState,
    api, user,
    siteName = 'unknown',
    routeName,
    createKey,
    getRouteData,
    isServer
  } = props

  // Must be the same as in RouteDataProvider
  const key = !createKey ? `${siteName}/${routeName}` : createKey(props)

  let currentRouteData = state.routeData[key]
  if (currentRouteData) return currentRouteData

  if (state.fetchingRouteData && state.fetchingRouteData[key]) {
    //log('Route data fetching', key)
    return
  }

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
        state,
        siteName = 'unknown',
        routeName,
        createKey,
      } = this.props

      const key = !createKey ? `${siteName}/${routeName}` : createKey(this.props)
      const routeData = state.routeData[key]

      return <C {...{ routeData, ...this.props }} />
    }
  }

  return RouteDataProvider
}

export default withRouteData
