
// Common to client and server

export { Component, createElement } from 'react'
export { render, hydrate } from 'react-dom'
export { Switch, Route, Prompt } from 'react-router'
export { Helmet } from 'react-helmet'

export matchRoutes from './matchRoutes'
export renderRoutes from './renderRoutes'
export Link from './Link'

// See https://reacttraining.com/react-router/web/guides/server-rendering
export Redirect from './Redirect'
export Status from './Status'

export withState from './withState'
export withProps from './withProps'
