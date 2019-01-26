
export function getCookie(name) {
  var value = '; ' + document.cookie
  var parts = value.split('; ' + name + '=')
  if (parts.length == 2) return parts.pop().split(';').shift()
}

export function setCookie(name, value) {
  document.cookie = `${name}=${value}; Path=/;`
}

export function deleteCookie(name) {
  const cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  document.cookie = cookie
  document.cookie = `${cookie} Domain=.${window.location.hostname}` // CloudFlare
}
