import getRouteName from './getRouteName'

export default function createRouteHandler({
  App,
  types = [],
  templateMap = {}
}) {

  const cache = {
    // routeName: data
  }

  const findMappedRouteData = props => {

    const routeName = getRouteName(props)

    if (cache[routeName]) return cache[routeName]

    let Route, Item, meta, notFound
    let foundRouteName = routeName

    for (const type of types) {
      if (!type.map) continue
      if (!type.map[routeName]) {
        // Check catch all routes
        if (!type.catchAll || !type.catchAll.length) continue
        for (const catchRoute of type.catchAll) {
          if (routeName.indexOf(`${catchRoute}/`)<0) continue
          foundRouteName = catchRoute
        }
        if (foundRouteName===routeName) continue
      }
      Item = type.map[foundRouteName]
      meta = type.meta && type.meta[foundRouteName]
      Route = templateMap[type.name] || Item
      break
    }
  
    if (!Item && types[0] && types[0].map) {
      Item = types[0].map['404'] || types[0].map[''] // index
      Route = templateMap[types[0].name || 'page'] || Item
      notFound = true
    }

    cache[routeName] = { Route, routeName, Item, meta, notFound }
    return cache[routeName]
  }

  const render = props => {
    const { Route, ...routeProps } = findMappedRouteData(props)
    if (!Route) return null
    return <Route {...{ ...props, ...routeProps }} />
  }

  return [{
    component: App,
    routes: [
      { path: '/*', render,
        // Used by react-server/render/serverActions
        findRoute: props => {
          const { Item } = findMappedRouteData(props)
          return Item
        }
      },
    ]
  }]
}
