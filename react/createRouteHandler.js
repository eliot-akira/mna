
const getRouteName = props => {
  const { location: { pathname } } = props
  return pathname.replace(/(^\/|\/$)/g, '')
}

export default function createRouteHandler({
  App, types = [], templateMap = {}
}) {

  const findRouteData = props => {

    const routeName = getRouteName(props)

    let Route, Item, meta

    for (const type of types) {
      if (!type.map[routeName]) continue
      Item = type.map[routeName]
      meta = type.meta && type.meta[routeName]
      Route = templateMap[type.name] || Item
      break
    }
  
    if (!Item) {
      if (types[0] && types[0].map && types[0].map['404']) {
        Item = types[0].map['404']
        Route = templateMap[types[0].name || 'page'] || Item
      }
    }

    return { routeName, Route, Item, meta }
  }

  const render = props => {
    const { routeName, Route, Item, meta } = findRouteData(props)
    if (!Route) return null
    return <Route {...{ ...props, routeName, Item, meta }} />
  }

  return [{
    component: App,
    routes: [
      { path: '/*', render,
        // Used by react-server/render/serverActions
        findRoute: props => {
          const { Item } = findRouteData(props)
          return Item
        }
      },
    ]
  }]
}
