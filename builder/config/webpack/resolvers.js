const paths = require('../paths')
//const { TsConfigPathsPlugin } = require('awesome-typescript-loader')

module.exports = {
  extensions: [
    '.js', '.jsx', '.json',
    '.ts', '.tsx',
    '.mjs',
    '.css', '.scss'
  ],
  modules: paths.resolveModules,
  //plugins: [new TsConfigPathsPlugin()]
}
