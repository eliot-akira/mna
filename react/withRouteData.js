import { Component } from '@mna/react'

// Depends on content-client, content-server

const log = (...args) => console.log('withRouteData', ...args)

async function ensureRouteData(props) {

  const {
    actions, state, setState,
    api, user,
    routeName,
    createKey,
    getRouteData,
    isServer
  } = props

  const key = !createKey ? routeName : createKey(props)

  let currentRouteData = state.routeData[key]
  if (currentRouteData) return currentRouteData

  if (state.fetchingRouteData && state.fetchingRouteData[key]) {
    return
  }

  if (!api) {
    log('No api')
    return
  }

  setState({ fetchingRouteData: { ...state.fetchingRouteData, [key]: true } })

  currentRouteData = await getRouteData({ key, ...props }) || {}
  const { context: siteContext = {} } = currentRouteData

  setState({
    siteContext: {
      ...state.siteContext, ...siteContext
    },
    routeData: { ...state.routeData, [key]: currentRouteData },
    fetchingRouteData: { ...state.fetchingRouteData, [key]: false }
  })

  return currentRouteData
}

const withRouteData = (ensurerProps) => C => {

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
        routeName,
        createKey,
      } = this.props
    
      const key = !createKey ? routeName : createKey(this.props)
      const routeData = state.routeData[key]
    
      return <C {...{ routeData, ...this.props }} />
    }
  }

  return RouteDataProvider
}

export default withRouteData
