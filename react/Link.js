import { NavLink } from 'react-router-dom'

export default function Link({ href, ...props }) {

  const to = props.to || href

  return <NavLink {...{
    ...props,
    to,
    isActive: (match, location) => {

      const routeName = location.pathname.replace(/\/$/, '')
        || '/'

      if (props.exact) return routeName===to

      const len = to.length

      return routeName.substring(0, len)===to
        && (!routeName[len] || routeName[len]==='/')
    }
  }} />
}