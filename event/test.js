const createEmitter = require('./index')

const e = createEmitter()

test('Emitter instance', it => {

  it('exists', e)
  it('has method .on', e.on)
  it('has method .off', e.off)
  it('has method .emit', e.emit)
})

test('Listener', it => {

  e.on('event1', () => it('is called on event', true))
  e.emit('event1')

  let called
  const dontCall = () => called = true
  e.on('event2', dontCall)
  e.off('event2', dontCall)
  e.emit('event2')

  it('is not called after unsubscribe', !called)

  called = false
  const unsub = e.on('event3', dontCall)

  it('returns unsubscribe function from "on" method', unsub)
  unsub()

  e.emit('event3')
  it('returned unsubscribe function works', !called)

})