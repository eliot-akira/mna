import { Redirect } from '@mna/react'
import LoginForm from './LoginForm'

export default ({ state, actions }) =>
  state.user && state.user.id ? <Redirect to="/" /> :
    <div className="article-width">
      <h1>Login</h1>
      <LoginForm {...{ actions }}/>
    </div>
