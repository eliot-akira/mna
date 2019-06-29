import { stripEndSlash } from '@mna/utils/slash'
import getRouteName from './getRouteName'

export default function createRouteHandler({
  App,
  types = [],
  templateMap = {},
  rootSiteDomains = [],
  filterRouteName
}) {

  const cache = {
    // routeName: data
  }

  const findMappedRouteData = props => {

    const { siteName = '' } = props // From react-client, react-server/render
    const routeName = stripEndSlash(
      filterRouteName
        ? filterRouteName({
          siteName,
          routeName: getRouteName(props)
        })
        : getRouteName(props)
    )

    const filteredSiteName = rootSiteDomains.includes(siteName) ? '' : siteName
    const withSiteName = route => route
      ? (filteredSiteName ? siteName+'/'+route : route)
      : filteredSiteName

    const siteAndRouteName = withSiteName(routeName)

    if (cache[siteAndRouteName]) return cache[siteAndRouteName]

    let Route, Item, meta, notFound

    let findRouteName
    let foundRouteName

    function setFoundRoute(type, foundRouteName) {
      Item = type.map[foundRouteName]
      meta = type.meta && type.meta[foundRouteName]
      Route = templateMap[type.name] || Item
    }

    for (const type of types) {

      if (!type.map) continue

      let {
        mapSiteName = false,
        alias = {},
        catchAll = []
      } = type

      findRouteName = mapSiteName
        ? withSiteName(findRouteName)
        : routeName

      if (type.map[findRouteName]) {
        foundRouteName = findRouteName
        setFoundRoute(type, foundRouteName)
        break
      }

      for (const key in alias) {

        if (!alias.hasOwnProperty(key)) continue
        const value = alias[key]

        if (key===findRouteName && type.map[value]) {
          foundRouteName = value
          break
        }
        if (findRouteName.indexOf(`${key}/`)<0) {
          const aliasedRoute = findRouteName.replace(`${key}/`, `${value}/`)
          if (type.map[aliasedRoute]) {
            foundRouteName = aliasedRoute
            break
          }
        }
      }

      if (foundRouteName) {
        setFoundRoute(type, foundRouteName)
        break
      }

      // Check catch all routes
      if (!catchAll.length) continue

      for (const catchRoute of catchAll) {
        if (findRouteName.indexOf(`${catchRoute}/`)<0) continue
        foundRouteName = catchRoute
      }

      if (foundRouteName===findRouteName) continue

      // Fall through to not found
      setFoundRoute(type, foundRouteName)
      break
    }

    if (!Item && types[0] && types[0].map) {
      Item = types[0].map['404'] || types[0].map[''] // index
      Route = templateMap[types[0].name || 'page'] || Item
      notFound = true
    }

    cache[siteAndRouteName] = { Route, siteName, routeName, Item, meta, notFound, filterRouteName }

    return cache[siteAndRouteName]
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
