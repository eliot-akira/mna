
const classToType = {}

for (const name of ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']) {
  classToType[`[object ${name}]`] = name.toLowerCase()
}

export default function typeOf(obj) {
  return classToType[Object.prototype.toString.call(obj)] || "object"
}
