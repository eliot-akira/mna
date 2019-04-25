import { BrowserRouter } from 'react-router-dom'
import { hydrate as render, renderRoutes } from '@mna/react'
import createStore from '@mna/store'
import connectReduxDevTools from '@mna/store/redux'

// From react-server/render
const initState = window.__INIT_STATE__
const splitPoints = window.__SPLIT_POINTS__ || []

const siteName = window.location.hostname

export default function renderClient({ App, routes, bundles }) {

  const store = createStore(App)

  if (initState) store.setState(initState, { silent: true })

  connectReduxDevTools(store)

  const el = document.getElementById('root')
  const renderApp = () => render(
    <BrowserRouter>
      { renderRoutes(routes, { store, siteName }) }
    </BrowserRouter>,
    el
  )

  store.on('setState', renderApp)

  return Promise.all(
    splitPoints.map(chunk => bundles[chunk].loadComponent())
  ).then(renderApp)
}
