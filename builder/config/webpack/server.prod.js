const baseConfig = require('./server.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

module.exports = {
  ...baseConfig,
  mode: 'production',
  devtool: generateSourceMap ? 'source-map' : false,
}
