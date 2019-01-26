import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { renderRoutes, Helmet, matchRoutes } from '@mna/react'
import createStore from '@mna/store'
import { cleanUserData } from '@mna/content-server/user'

import handleServerActions from './serverActions'
import renderPage from './page'

export default async function render({
  App, routes, assets,
  content, location, user
}) {

  const store = createStore(App)
  const context = {
    store,
    splitPoints: []
  }

  if (user) store.setState({ user: cleanUserData(user) })

  const { state, actions, setState } = store

  await handleServerActions({
    App, routes, location,
    serverActionProps: {
      location, content, user,
      state, actions, setState
    }
  })

  const markup = renderToString(
    <StaticRouter
      location={location}
      context={context} // Passed to route as props.staticContext
    >
      { renderRoutes(routes, { store }) }
    </StaticRouter>
  )

  // Status code and redirect location
  const {
    status: statusCode, // From lib/react/Status
    url: redirectLocation, // From react-router
  } = context

  if (redirectLocation) return { statusCode, redirectLocation  }

  const html = await renderPage({
    markup, assets,
    initState: store.getState(),
    splitPoints: context.splitPoints
  })

  return {
    html,
    statusCode
  }
}
