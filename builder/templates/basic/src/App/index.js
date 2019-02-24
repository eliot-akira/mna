import { Component, Helmet, Switch, renderRoutes, Link } from '@mna/react'
import Layout from '@mna/react-ui/Layout'
import meta from './meta'
import createLayout from './layout'

class App extends Component {

  static serverAction = () => {
  }

  render() {
    const { route, store, location } = this.props
    const { state, actions, setState } = store

    const routeClassName = `route-${
      location.pathname.split('/').slice(1).join('-')
      || 'home'
    }`

    return (
      <div className={routeClassName}>
        <Helmet {...meta} />
        <Layout {...{
          state, actions, location,
          menuTitle: <Link to="/">{meta.defaultTitle}</Link>,
          ...createLayout({ state, actions, location })
        }}>
          { renderRoutes(route.routes, { state, actions, setState }) }
        </Layout>
      </div>
    )
  }
}

Object.assign(App, require('./state'))

export default App