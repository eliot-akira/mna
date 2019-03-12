const babelConfig = require('../config/babel')

module.exports = function runScript({ script }) {

  require('@babel/register')(babelConfig.server)

  require(script)

}
