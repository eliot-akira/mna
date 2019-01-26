module.exports = {

  // Helpers passed to app.config.js in scripts/start and build

  cwd: process.cwd(),

  fs: require('fs-extra'),
  chokidar: require('chokidar'),
  glob: require('glob'),

  sync: require('./sync'),
  runCommand: require('./runCommand'),

  generate: require('./generate'),
  createTypeBundles: require('./typeBundles'),
}
