const createEmitter = require('./index')

const e = createEmitter()

test('Emitter instance', it => {

  it('exists', e)
  it('has method .on', e.on)
  it('has method .off', e.off)
  it('has method .emit', e.emit)
})

test('Listener', async it => {

  e.on('event1', () => it('is called on event', true))
  e.emit('event1')

  let called
  const registerCall = () => called = true

  e.on('event2', registerCall)
  e.off('event2', registerCall)
  e.emit('event2')

  it('is not called after unsubscribe', !called)

  called = false
  const unsub = e.on('event3', registerCall)

  it('returns unsubscribe function from "on" method', unsub)
  unsub()

  e.emit('event3')
  it('returned unsubscribe function works', !called)

  called = false
  e.on('event4', registerCall)
  e.emit('event4')
  it('subscribe after unsubscribe works', called)

})
