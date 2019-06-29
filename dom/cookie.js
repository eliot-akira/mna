
export function getCookie(name) {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + name + '=')
  if (parts.length == 2) return parts.pop().split(';').shift()
}

const withRootDomain = domain => domain ? ` Domain=${domain};` : ''

export function setCookie(name, value, rootDomain) {
  document.cookie = `${name}=${value}; Path=/;`+withRootDomain(rootDomain)
}

export function deleteCookie(name, rootDomain) {
  const cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  document.cookie = cookie //+withRootDomain(rootDomain)
  document.cookie = `${cookie} Domain=.${window.location.hostname}` // CloudFlare
}
