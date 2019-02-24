const layoutMap = {
  default: [

  ]
}

export default ({ state, actions, location }) => {

  const routeBase = location.pathname.split('/')[1]

  let data = layoutMap[routeBase] ||
    [
      ...layoutMap.default,
      ...(state.user && state.user.id
        ? [
          { to: '/admin', content: 'Admin', exact: false },
          <a href="" onClick={e => {
            e.preventDefault()
            actions.logout()
          }}>Logout</a>
        ]
        : [{ to: '/login', content: 'Login' }]
      ),
    ]

  if (Array.isArray(data)) return { menuItems: data }
  if (data instanceof Function) data = data({ state, actions, location })

  const { title: menuTitle, items: menuItems, layout } = data

  return { menuTitle, menuItems }
}
