import createClient from '@mna/react-client'
import App from './App'
import routes from './routes'
import * as bundles from './bundles'
import './App/index.scss'

createClient({ App, routes, bundles })

if (module.hot) module.hot.accept()