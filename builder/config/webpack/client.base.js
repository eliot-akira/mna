const path = require('path')
const paths = require('../paths')
const { client: clientLoaders } = require('./loaders')
const resolvers = require('./resolvers')
const plugins = require('./plugins')

module.exports = {
  name: 'client',
  target: 'web',
  entry: {
    bundle: [
      // See ../babel - useBuiltIns
      //require.resolve('@babel/polyfill'),
      paths.srcClient
    ],
  },
  output: {
    path: path.join(paths.buildClient, paths.publicPath),
    filename: 'bundle.js',
    publicPath: paths.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  module: {
    rules: clientLoaders,
  },
  resolve: { ...resolvers },
  plugins: [...plugins.shared, ...plugins.client],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
}
