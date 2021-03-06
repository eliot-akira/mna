import schema from '../index'

test('Schema', it => {

  class TestClass {}

  const testSchema = schema(({
    // All default types
    any,
    required,
    string,
    number,
    array,
    object,
    func,
    bool,
    is,
    stringOf,
    arrayOf,
    objectOf,
    instanceOf,
    allOf,
    oneOf,
    optional,
    email,
  }) => ({
    // Test schema
    any: any,
    required: required,
    optional: optional(string),
    string: string,
    number: number,
    array: array,
    object: object,
    func: func,
    bool: bool,
    is: is('test'),
    stringOf: stringOf('test'),
    stringOfArray: stringOf(['test', 'test2']),
    arrayOf: arrayOf(number),
    objectOf: objectOf({
      key: string
    }),
    instanceOf: instanceOf(TestClass),
    //allOf: allOf(),
    oneOf: oneOf(string, number),
    email: email
  }))

  it('creates a schema', testSchema)
  it('returns a validate function', testSchema instanceof Function)

  const validData = {
    any: 'any',
    required: 'required',
    optional: '1',
    string: 'string',
    number: 1,
    array: [],
    object: {},
    func: () => {},
    bool: true,
    is: 'test',
    stringOf: 'test',
    stringOfArray: 'test2',
    arrayOf: [1, 2, 3],
    objectOf: { key: 'value' },
    instanceOf: new TestClass,
    oneOf: 1,
    email: 'test@test.com'
  }

  const invalidData = {
    optional: 0,
    string: 0,
    number: '1',
    array: {},
    object: [],
    func: 'true',
    bool: 'true',
    is: 1,
    stringOf: 'wrong',
    stringOfArray: 'wrong',
    arrayOf: ['1'],
    objectOf: {},
    instanceOf: {},
    oneOf: false,
    email: 'wrong'
  }

  let errors = testSchema(validData)
  it('returns null on valid schema', errors===null)

  errors = testSchema(invalidData)
  it('returns errors on wrong schema', errors)
  it('returns all errors on wrong schema', Object.keys(errors).length>=Object.keys(invalidData).length)

})
