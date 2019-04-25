//import { Switch } from 'react-router'
import { Route } from 'react-router'
import Switch from './Switch'

const renderRoutes = (routes, routeProps = {}, switchProps = {}) =>{
  return routes ? (
    <Switch {...switchProps}>
      { routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props =>
            route.render
              ? route.render({ ...props, ...routeProps, route })
              : <route.component {...props} {...routeProps} route={route} />
          }
        />
      ))}
    </Switch>
  ) : null
}

export default renderRoutes
