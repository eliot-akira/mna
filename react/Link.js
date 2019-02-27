import { NavLink } from 'react-router-dom'

const externalUrl = new RegExp(/^(http:|https:|mailto:|ftp:|tel:)/)

export default function Link({ href, to, children = [], ...props }) {

  let target = to || href

  if (typeof target!=='string') {
    target = children[0] || ''
    if (target.indexOf('.')>=0 && target.indexOf(':')<0) {
      target = `https://${target}`
    }
  }

  if (target.indexOf(':') >= 0 /*target.match(externalUrl)*/) {
    return (
      <a {...{ ...props, href: target, target: '_blank', children }} />
    )
  }

  return <NavLink {...{
    ...props, children,
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