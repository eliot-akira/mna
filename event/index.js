
class Emitter {

  constructor() {
    this.listeners = []
  }

  on(pattern, callback) {
    this.listeners.push({ pattern, callback })
    // Return unsubscriber
    return () => this.off(pattern, callback)
  }

  once(pattern, callback) {
    let done
    done = this.on(pattern, function(...args) {
      done()
      return callback(...args)
    })
  }

  off(pattern, callback) {
    this.listeners = this.listeners.filter(l =>
      pattern &&
      !(pattern===l.pattern && callback===l.callback)
    )
  }

  emit(event, ...args) {
    return this.listeners.map(listener => {

      const { pattern, callback } = listener

      if (!callback) return

      const matches = pattern instanceof RegExp
        ? event.match(pattern)
        : event===pattern

      if (matches && (matches===true || matches.length)) {
        return callback(...args)
      }
    })
  }
}

/**
 * Extend an object with event methods
 */
function createEmitter(obj = {}) {

  obj.emitter = new Emitter

  ;['on', 'once', 'off', 'emit'].forEach(key => {
    obj[key] = obj.emitter[key].bind(obj.emitter)
  })

  return obj
}

export default createEmitter
export { Emitter }
