import Emitter from './Emitter'

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
