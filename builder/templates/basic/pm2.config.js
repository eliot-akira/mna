
// PM2 process file
// http://pm2.keymetrics.io/docs/usage/application-declaration/

// Make sure log directory exists
try { require('fs').mkdirSync('.log') } catch (e) { /**/ }

module.exports = {
  name: require('./package.json').name,
  script: 'build/server/server.js',
  error_file: '.log/errors.log',
  out_file: '.log/out.log'
}