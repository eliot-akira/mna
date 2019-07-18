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
      <a {...{ ...props, href: target,
        target: target.indexOf('http')===0 ? '_blank' : '_self',
        children
      }} />
    )
  }

  return <NavLink {...{
    ...props,
    children,
    to: target,
    isActive: (match, location) => {

      const routeName = location.pathname.replace(/\/$/, '')
        || '/'

      const targetRouteName = target.replace(/\/$/, '') || '/'

      if (props.exact) return routeName===targetRouteName

      const len = target.length

      return routeName.substring(0, len)===targetRouteName
        && (!routeName[len] || routeName[len]==='/')
    }
  }} />
}
