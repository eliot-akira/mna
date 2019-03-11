const babelConfig = require('../config/babel')

module.exports = function runTester(props = {}) {

  require('@babel/register')(babelConfig.server)

  require('@mna/tester/cli')

}
