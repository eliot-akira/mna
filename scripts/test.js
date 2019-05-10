const path = require('path')

module.exports = () => {

  const cwd = process.cwd()
  const dest = '_publish'

  process.chdir(path.join(cwd, dest))

  /*
  require(`../builder/scripts/test`)({
    root: [
      //path.join(dest, 'node_modules')
    ],
    alias: {
      '@mna': cwd,
    }
  })
*/
  require('../tester/cli')

}
