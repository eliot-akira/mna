import App from './App'
import { pageMap } from './bundles'

const getRouteName = props => {
  const { location: { pathname } } = props
  return pathname.replace(/(^\/|\/$)/g, '')
}

const findRoute = props => {

  const routeName = (typeof props.routeName!==undefined
    ? props.routeName
    : getRouteName(props)
  ) || ''
  const routeParts = routeName.split('/')

  let routeBase, Route

  for (let i=routeParts.length; i >= 1 && !Route; i--) {
    routeBase = routeParts.slice(0, i).join('/')
    Route = pageMap[routeBase]
  }

  return Route || pageMap['404']
}

const render = props => {

  const routeName = getRouteName(props)
  const Route = findRoute({ routeName })

  return <Route {...{ ...props, routeName }} />
}

export default [{
  component: App,
  routes: [
    { path: '/*', render, findRoute },
  ]
}]
