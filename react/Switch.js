import React from "react"
import { __RouterContext as RouterContext, matchPath } from "react-router"

/**
 * The public API for rendering the first <Route> that matches.
 */
export default class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {

          const location = this.props.location || context.location

          let element, match

          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child

              const path = child.props.path || child.props.from

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match
            }
          })

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null
        }}
      </RouterContext.Consumer>
    )
  }
}
