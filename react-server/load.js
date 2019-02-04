import { withRouter } from 'react-router'

// Usage:
// import load from '@mna/react-server/load'
// export const Test = load('Test', require('./posts/test'))

export default function load(name, Loaded) {

  const C = Loaded.default || Loaded
  const SyncComponent = withRouter(function(props) {

    // Pass rendered component name to server: see ./render
    if (props.staticContext && props.staticContext.splitPoints) {
      props.staticContext.splitPoints.push(name)
    }

    return <C {...props} />
  })

  if (C.serverAction) {
    SyncComponent.serverAction = C.serverAction
  }

  return SyncComponent
}
