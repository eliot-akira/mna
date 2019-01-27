import { NavLink } from 'react-router-dom'

const externalUrl = new RegExp(/^(http:|https:|mailto:|ftp:)/)

export default function Link({ href, to, ...props }) {

  const target = to || href

  if (target.match(externalUrl)) {
    return (
      <a {...{ ...props, href: target, target: '_blank' }} />
    )
  }

  return <NavLink {...{
    ...props,
    to: target,
    isActive: (match, location) => {

      const routeName = location.pathname.replace(/\/$/, '')
        || '/'

      if (props.exact) return routeName===target

      const len = target.length

      return routeName.substring(0, len)===target
        && (!routeName[len] || routeName[len]==='/')
    }
  }} />
}