
// Common to client and server
import React from'react'

export default React
export { Component, createElement } from 'react'
export { render, hydrate } from 'react-dom'
export { Switch, Route, Prompt, withRouter } from 'react-router'

// TODO: Update to [React Helmet Async](https://github.com/staylor/react-helmet-async)
export { Helmet } from 'react-helmet'

export classnames from 'classnames'

export Link from './Link'
export matchRoutes from './matchRoutes'
export renderRoutes from './renderRoutes'
export createRouteHandler from './createRouteHandler'
export getRouteName from './getRouteName'

// See https://reacttraining.com/react-router/web/guides/server-rendering
export Redirect from './Redirect'
export Status from './Status'

export withState from './withState'
export withProps from './withProps'
export withRouteData from './withRouteData'
