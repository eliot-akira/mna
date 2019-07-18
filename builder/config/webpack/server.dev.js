const baseConfig = require('./server.base')
const webpack = require('webpack')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')

const config = {
  ...baseConfig,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //new WriteFileWebpackPlugin(),
    ...baseConfig.plugins,
  ],
  mode: 'development',
  performance: {
    hints: false,
  }
}

module.exports = config
