const createDatabase = require('../index')

test('DB multi-process', it => {
  it('exists', createDatabase)
})
