const assert = require('assert').strict

const assertHelpers = {
  is(a, b) {
    try {
      assert.deepStrictEqual(a, b)
      return true
    } catch(e) {
      return e
    }
  },
  throws(fn) {
    try {
      fn()
      return false
    } catch(e) {
      return true
    }
  }
}

module.exports = assertHelpers
