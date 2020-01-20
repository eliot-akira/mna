import { Component, Helmet, Switch, renderRoutes, Link, Redirect } from '@mna/react'
import Layout from '@mna/react-ui/Layout'
import meta from './meta'
import createLayout from './layout'
import * as appState from './state'

class App extends Component {

  static serverAction = () => {
  }

  state = {
    currentRoute: ''
  }

  onRouteEnter = (newLocation) => {
    const currentRoute = newLocation.pathname
    this.setState({
      currentRoute
    })
  }

  render() {
    const { route, store, location } = this.props
    const { state, actions, setState } = store

    const routeParts = (
      this.state.currentRoute || location.pathname
    ).split('/').slice(1).filter(f => f)
    const routeName = routeParts.join('/')

    if (!routeParts.length) routeParts.push('home')

    const routeClassName = routeParts
      .map((p, index) => `route-${routeParts.slice(0, index+1).join('-')}`).join(' ')

    const isLoggedIn = state.user && state.user.id
    const isAdmin = isLoggedIn && state.user.role
      && state.user.role.indexOf('admin')>=0

    const baseRoute = routeParts[0]
    const redirectToLogin =
      (location.pathname==='/admin' && !isAdmin) ||
      (location.pathname==='/profile' && !isLoggedIn)
    const redirectToHome =
      (location.pathname==='/login' && isLoggedIn)

    return (
      <div className={routeClassName}>
        <Helmet {...meta} />
        <Layout {...{
          state, actions, location,
          menuTitle: <Link to="/">{meta.defaultTitle}</Link>,
          onRouteEnter: this.onRouteEnter,
          ...createLayout({
            state, actions, location, routeName,
            isLoggedIn, isAdmin
          })
        }}>
          { redirectToLogin
            ?
            <Redirect to={{
              pathname: "/login",
              // Redirect after login
              search: `?from=${encodeURIComponent('/'+routeParts.join('/'))}`
              // decodeURIComponent(location.search.split('?from=')[1] || '')
            }} />
            : redirectToHome
              ?
              <Redirect to="/" />
              :
              renderRoutes(route.routes, {
                state, actions, setState,
                isLoggedIn, isAdmin
              })
          }
        </Layout>
      </div>
    )
  }
}

Object.assign(App, appState)

export default App
