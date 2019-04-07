import App from './App'
import { pageMap } from './bundles'
import createRouteHandler from '@mna/react/createRouteHandler'

export default createRouteHandler({
  App,
  types: [
    { name: 'page', map: pageMap },
  ],
})
