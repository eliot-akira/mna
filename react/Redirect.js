import { Redirect, withRouter } from 'react-router'
import Status from './Status'

// See https://reacttraining.com/react-router/web/guides/server-rendering

const RedirectWithStatus = ({ history, status = 302, from, to, push, exact, strict }) => {
  // Prevent redirect to current route
  if (to===history.location.pathname) return ''
  return <Status code={status}>
    <Redirect {...{ from, to, push, exact, strict }} />
  </Status>
}

export default withRouter(RedirectWithStatus)