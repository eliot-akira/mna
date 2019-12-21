const { server: babelConfig } = require('../config/babel')

module.exports = function runTester(props = {}) {

  const { root = [], alias = {} } = props

  babelConfig.plugins = [
    ...babelConfig.plugins,
    [require.resolve('babel-plugin-module-resolver'), { root, alias }]
  ]

  require('@babel/register')(babelConfig)

  require('@mna/tester/cli')
}
