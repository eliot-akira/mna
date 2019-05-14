const tester = require('./index')

test('Tester', it => new Promise((resolve, reject) => {

  const t = tester(false)

  t(() => setTimeout(() => {
    it('Waits on test to finish', true)
    resolve()
  }, 100)
  )

  t(() => it('Runs callback', true))
  t(async () => it('Runs async callback', true))
  t(() => new Promise((resolve, reject) => {
    it('Runs promise', true)
    resolve()
  }))

  t.all()
}))

test('Assertion', async it => {

  const t = tester(false)

  t(i => i('', true))

  const result = await t.all()

  it('Passes on true ', !result.fails, result)
  t(i => i('', false))
  it('Fails on false', (await t.all()).fails)
  it('Results are cleared after test.all()', !(await t.all()).fails)
})

test('Assert helpers', it => {

  const methods = ['is', 'throws']

  it('are passed to test callback', methods.reduce((a, k) => !a ? false : it[k], true))

  it('.is checks equality', it.is(1, 1))
  it('.is checks deep equality of arrays', it.is(['a'], ['a']))
  it('.is checks deep equality of objects', it.is({ a: 'b' }, { a: 'b' }))
  it('.throws checks if function throws', it.throws(() => {
    throw new Error
  }))
})
