import { matchRoutes } from '@mna/react'

export default async function handleServerActions({
  App, routes, location,
  serverActionProps = {}
}) {

  if (App.serverAction) {
    try {
      await App.serverAction(serverActionProps)
    } catch (e) {
      console.log(`App route server action error - route ${location}`, e)
    }
  }

  if (!routes || !routes[0] || !routes[0].routes) return

  // Find matching routes' server actions

  const childRoutes = routes[0].routes

  const matchedRoutes = matchRoutes(childRoutes, location)

  for (const matchedRoute of matchedRoutes) {

    const { route, match } = matchedRoute
    const routeKeys = Object.keys(route)
    const routeKeyLength = routeKeys.length

    for (const childRoute of childRoutes) {

      const matchKeys = routeKeys.filter(key => route[key]===childRoute[key])
      if (matchKeys.length!==routeKeyLength) continue

      let serverActionComponent, serverAction, routeName = serverActionProps.routeName

      // Check if we have route name set from findRoute
      if (childRoute.serverAction) {
        serverAction = childRoute.serverAction
        serverActionComponent = childRoute
      } else if (childRoute.component && childRoute.component.serverAction) {
        serverAction = childRoute.component.serverAction
        serverActionComponent = childRoute.component
      } else if (childRoute.findRoute) {
        serverActionComponent = childRoute.findRoute({
          ...serverActionProps,
          location: { pathname: location }
        }) || {}
        serverAction = serverActionComponent.serverAction

      }

      serverActionComponent = serverActionComponent || {}

      if (typeof serverActionComponent.routeName!=='undefined') {
        routeName = serverActionComponent.routeName
      }

      // const serverAction =
      //   // In the route config
      //   childRoute.serverAction
      //   // Static property on the component
      //   || (childRoute.component && childRoute.component.serverAction)
      //   // Static property on dynamically loaded route
      //   || (childRoute.findRoute &&
      //     (childRoute.findRoute({
      //       ...serverActionProps,
      //       location: { pathname: location }
      //     }) || {}).serverAction
      //   )

      if (!serverAction) continue

      try {
        await serverAction({
          ...serverActionProps,
          routeName: serverActionComponent.routeName
        })
      } catch (e) {
        console.log(`Child route server action error - route ${location}`, e)
      }
    }
  }
}
