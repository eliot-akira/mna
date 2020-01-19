import { Component } from 'react'
import { withRouter } from 'react-router'

// Usage:
// import load from '@mna/react-server/load'
// export const Test = load('Test', require('./posts/test'))

export default function load(name, Loaded) {

  const C = Loaded.default || Loaded

  class SyncComponent extends Component {

    componentDidMount() {
      // Pass rendered Markdown frontmatter as meta
      const { onLoadMeta } = this.props
      if (C.meta && onLoadMeta) onLoadMeta( C.meta )
    }

    render() {
      const { staticContext } = this.props
      // Pass rendered component name to server: see ./render
      if (staticContext && staticContext.splitPoints) {
        staticContext.splitPoints.push(name)
      }
      return <C {...this.props} />
    }
  }

  const SyncComponentWithRouter = withRouter(SyncComponent)

  if (C.serverAction) {
    SyncComponentWithRouter.serverAction = C.serverAction
  }

  return SyncComponentWithRouter
}
