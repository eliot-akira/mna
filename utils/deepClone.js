
export default function deepClone(obj) {
  // https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
  return JSON.parse(JSON.stringify(obj))
}
