import App from './App'
import { pageMap } from './bundles'

const getRouteName = props => {
  const { location: { pathname } } = props
  return pathname.replace(/(^\/|\/$)/g, '')
}

const findRoute = props => {
  const routeName = getRouteName(props)
  return pageMap[routeName]
}

const render = props => {

  const routeName = getRouteName(props)

  const Route = pageMap[routeName]
    || pageMap['404']

  return <Route {...{ ...props, routeName }} />
}

export default [{
  component: App,
  routes: [
    { path: '/*', render, findRoute },
  ]
}]
