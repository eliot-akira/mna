import exportStaticSite from '@mna/react-server/export'
import { pageMap } from '../bundles'

const routes =
  Object.keys(pageMap)

export default server => exportStaticSite({ server, routes })
