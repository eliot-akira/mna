import logger from './index'

let l

const data = { key: 'value' }

test('logger', it => {

  it('exists', logger)

  l = logger('test')

  it('creates a log function with name', l)

})

test('logger.listen', it => {

  it('exists', logger.listen)

  let listenSuccess = false
  let listenResult
  let listenCalled = 0

  const unsubscribe = logger.listen((name, data) => {
    listenSuccess = true
    listenResult = { name, data }
    listenCalled++
  })

  let listenNameSuccess = false
  let listenNameResult

  logger.listen('test', (name, data) => {
    listenNameSuccess = true
    listenNameResult = { name, data }
  })

  let listenWildcardSuccess = false
  let listenWildcardResult

  logger.listen('*', (name, data) => {
    listenWildcardSuccess = true
    listenWildcardResult = { name, data }
  })

  let listenMultipleSuccess = false
  let listenMultipleResult

  logger.listen('test,test2', (name, data) => {
    listenMultipleSuccess = true
    listenMultipleResult = { name, data }
  })

  l(data)

  it('takes a listener and calls it', listenSuccess)
  it('passes name and data to listener', it.is(listenResult, { name: 'test', data }))

  it('takes a name and a listener and calls it', listenNameSuccess)
  it('passes name and data to name-specific listener', it.is(listenNameResult, { name: 'test', data }))

  it('takes a name with wildcard and a listener and calls it', listenWildcardSuccess)
  it('passes name and data to listener with wildcard in name', it.is(listenWildcardResult, { name: 'test', data }))

  it('takes multiple names and a listener and calls it', listenMultipleSuccess)
  it('passes name and data to listener with multiple name', it.is(listenMultipleResult, { name: 'test', data }))

  let l2 = logger('test2')

  l2(data)

  it('listens to multiple names', it.is(listenMultipleResult, { name: 'test2', data }))

  it('listens to multiple logs', it.is(listenCalled, 2))

  it('returns an unsubscribe function', unsubscribe)

  listenCalled = 0
  unsubscribe()
  l()
  it('unsubscribe works', listenCalled===0)
  l()
  it('unsubscribe is permanent', listenCalled===0)

})

test('logger local', it => {

  let localListenSuccess = false
  let localListenResult

  let l3 = logger('test3', (data) => {
    localListenSuccess = true
    localListenResult = data
  })

  l3(data)

  it('takes an optional local listener', localListenSuccess)
  it('passes data to listener', it.is(localListenResult, data))

})

test('logger.silence', it => {

  let silencedSuccess = true

  let l4 = logger('test4', (data) => {
    silencedSuccess = false
  })

  logger.silence('test4')

  l4(data)

  it('silences logs matching given name', silencedSuccess)

})
