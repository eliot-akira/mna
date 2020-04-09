
// Common to client and server
import React from'react'

import { Component, createElement } from 'react'
import { render, hydrate } from 'react-dom'
import { Switch, Route, Prompt, withRouter } from 'react-router'

// TODO: Update to [React Helmet Async](https://github.com/staylor/react-helmet-async)
import { Helmet } from 'react-helmet'

import classnames from 'classnames'

import Link from './Link'
import matchRoutes from './matchRoutes'
import renderRoutes from './renderRoutes'
import createRouteHandler from './createRouteHandler'
import getRouteName from './getRouteName'

// See https://reacttraining.com/react-router/web/guides/server-rendering
import Redirect from './Redirect'
import Status from './Status'

import withState from './withState'
import withProps from './withProps'
import withRouteData from './withRouteData'

// Sad.. Temporary workaround for Babel issue with default and named exports

export default Object.assign({}, React, {
  Component, createElement,
  render, hydrate,
  Switch, Route, Prompt, withRouter,
  Helmet,
  classnames, Link, matchRoutes, renderRoutes, createRouteHandler, getRouteName, Redirect, Status, withState, withProps, withRouteData
})

/*
// Below was working until babel@7

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
*/