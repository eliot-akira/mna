import schema from '../index'

test('Schema: Async', async it => {

  it('exists', schema.async)

  const methodsWithAsync = ['objectOf', 'arrayOf', 'allOf', 'oneOf']

  it('has all async methods',
    methodsWithAsync.map(key => schema.type[key].async).filter(f => f)
      .length === methodsWithAsync.length
  )

  const asyncSchema = schema.async(({ string, strictArrayOf }) => ({
    key: string,
    asyncStringCheck: async (value) => await new Promise((resolve, reject) => {
      setTimeout(() => resolve(string(value)), 100)
    }),
    asyncArrayCheck: strictArrayOf.async(string)
  }))

  it('creates an async validate function', asyncSchema() instanceof Promise)

  const validData = {
    key: 'value',
    asyncStringCheck: 'anything',
    asyncArrayCheck: ['1', '2', '3']
  }

  const invalidData = {
    key: 123,
    asyncStringCheck: 123,
    asyncArrayCheck: ['1', '2', 3]
  }

  let errors = await asyncSchema(validData)

  it('returns null on valid schema', !errors)

  errors = await asyncSchema(invalidData)

  it('returns errors on invalid schema', Object.keys(errors).length===Object.keys(invalidData).length)

})
