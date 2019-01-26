const paths = require('../paths')

module.exports = {
  extensions: ['.js', '.mjs', '.json', '.jsx', '.css', '.scss'],
  modules: paths.resolveModules,
}
