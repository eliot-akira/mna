import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { renderRoutes, Helmet, matchRoutes, getRouteName } from '@mna/react'
import createStore from '@mna/store'
import { cleanUserData } from '@mna/content-server/user'

import handleServerActions from './serverActions'
import renderPage from './page'

export default async function render({
  App, routes, assets,
  location, siteName,
  content, status, user,
  req, res
}) {

  const store = createStore(App)
  const context = {
    store,
    splitPoints: []
  }

  if (user) store.setState({ user: cleanUserData(user) })

  const { state, actions, setState } = store

  const routeContent = !content ? null : {
    ...content,
    api: (props = {}) => content.api({
      // Provide route data when content.api is called from serverActions
      // See: content-server/api
      content: routeContent,
      user, req, res,
      ...props,
    })
  }

  await handleServerActions({
    App, routes, location,
    serverActionProps: {
      location, user, content: routeContent,

      // These should be isomorphic, to allow a single function to fetch content
      // on server-side render (serverAction) or client-side (componentDidMount)
      // See App.render
      // TODO: More robust way to ensure this
      state, actions, setState,
      api: routeContent.api,
      siteName,
      routeName: getRouteName({ location })
    }
  })

  const markup = renderToString(
    <StaticRouter
      location={location}
      context={context} // Passed to route as props.staticContext
    >
      { renderRoutes(routes, { store, siteName }) }
    </StaticRouter>
  )

  // Status code and redirect location
  const {
    status: statusCode, // From lib/react/Status
    url: redirectLocation, // From react-router
  } = context

  if (redirectLocation) return { statusCode, redirectLocation }

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
