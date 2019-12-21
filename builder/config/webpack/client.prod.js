//const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const baseConfig = require('./client.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

const config = {
  ...baseConfig,
  mode: 'production',
  devtool: generateSourceMap ? 'source-map' : false,
  plugins: [
    ...baseConfig.plugins,
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true
    })
  ],
}

//config.optimization.minimizer = [new UglifyJsPlugin()]
config.output.filename = 'bundle.[hash:8].js'

module.exports = config
