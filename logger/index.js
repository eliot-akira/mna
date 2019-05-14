// Based on: https://github.com/visionmedia/debug

const logListeners = []

function logger(name, fn) {

  const l = fn || console.log
  const log = function(...args) {

    if (!isEnabled(name) && !log.enabled) return

    for (const { regexp, fn } of logListeners) {
      if (regexp.test(name)) fn(name, ...args)
    }

    l(name, ...args)
  }

  return log
}

function isEnabled(name) {

  if (name[name.length - 1] === '*') return true

  for (let i = 0, len = logger.disabled.length; i < len; i++) {
    if (logger.disabled[i].test(name)) return false
  }
  for (let i = 0, len = logger.enabled.length; i < len; i++) {
    if (logger.enabled[i].test(name)) return true
  }
  return false
}

function regExpFromName(name) {
  const pattern = name.replace(/\*/g, '.*?')
  return new RegExp('^' + pattern + '$')
}

function enable(namespaces) {

  let name = namespaces
  const enabled = []
  const disabled = []

  var i
  var split = (typeof name === 'string' ? name : '').split(/[\s,]+/)
  var len = split.length

  for (i = 0; i < len; i++) {
    if (!split[i]) continue // ignore empty strings
    name = split[i]
    if (name[0] === '-') {
      disabled.push(regExpFromName(name.substr(1)))
    } else {
      enabled.push(regExpFromName(name))
    }
  }

  logger.enabled = enabled
  logger.disabled = disabled
}

logger.enable = enable
logger.enabled = []
logger.disabled = []
logger.isEnabled = isEnabled

logger.onLog = (name, fn) => logListeners.push(
  !fn ? { regexp: regExpFromName('*'), fn: name }
    : { regexp: regExpFromName(name), fn }
)


module.exports = logger
