const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('../friendly-errors-webpack-plugin')
//const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// https://github.com/webpack/webpack/issues/3460
const { CheckerPlugin } = require('awesome-typescript-loader')
//const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const env = require('../env')()
const isDev = process.env.NODE_ENV === 'development'

const client = [
  new CaseSensitivePathsPlugin(),
  new webpack.DefinePlugin(env.stringified),
  new webpack.DefinePlugin({
    __SERVER__: 'false',
    __BROWSER__: 'true',
  }),
  new MiniCssExtractPlugin({
    filename:
      isDev ? '[name].css' : '[name].[contenthash].css',
    chunkFilename:
      isDev ? '[id].css' : '[id].[contenthash].css',
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new ManifestPlugin({
    fileName: 'manifest.json',
    writeToFileEmit: true
  }),
  // Client-side bundle: async/dynamic imports
  // https://webpack.js.org/plugins/normal-module-replacement-plugin/
  new webpack.NormalModuleReplacementPlugin(
    /\.bundle/,
    resource => {
      resource.request = resource.request.replace(/\.bundle/, '.bundle.client')
      return resource
    }
  ),
]

const server = [
  new webpack.DefinePlugin({
    __SERVER__: 'true',
    __BROWSER__: 'false',
  }),
  // Server-side bundle: sync imports
  new webpack.NormalModuleReplacementPlugin(
    /\.bundle/,
    resource => {
      resource.request = resource.request.replace(/\.bundle/, '.bundle.server')
      return resource
    }
  ),

  // new ForkTsCheckerWebpackPlugin({
  //   //tslint: true,
  //   useTypescriptIncrementalApi: true,
  //   reportFiles: [
  //     'src/**/*.{ts,tsx}'
  //   ]
  // }),

  //new CheckerPlugin(),
]

const shared = [
  //new ForkTsCheckerWebpackPlugin()
  //..or..
  //new CheckerPlugin(),
  /*new HardSourceWebpackPlugin({
    info: { level: 'warn' }
  }),
  // https://github.com/mzgoddard/hard-source-webpack-plugin#excludemoduleplugin
  new HardSourceWebpackPlugin.ExcludeModulePlugin([
    {
      test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
    }
  ]),*/
]

if (isDev) {

  client.push(new FriendlyErrorsWebpackPlugin({
    title: 'Client',
    clearConsole: false
  }))

  server.push(new FriendlyErrorsWebpackPlugin({
    title: 'Server',
    clearConsole: false
  }))
}

module.exports = {
  shared,
  client,
  server,
}
