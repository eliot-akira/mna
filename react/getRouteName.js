
const getRouteName = ({ location = '' }) => {

  const pathname = typeof location==='string'
    ? location // From server router
    : location.pathname // From client router

  return pathname.replace(/(^\/|\/$)/g, '')
}

export default getRouteName
