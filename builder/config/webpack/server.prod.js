const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const baseConfig = require('./server.base')
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

module.exports = {
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
