export default function pick(obj, keys) {
  var res = {}
  if (typeof keys === 'string') {
    if (keys in obj) {
      res[keys] = obj[keys]
    }
    return res
  }

  var len = keys.length
  var idx = -1

  while (++idx < len) {
    var key = keys[idx]
    if (key in obj) {
      res[key] = obj[key]
    }
  }
  return res
}
