module.exports = () => {
  process.argv.push('publish')
  require('../tester/cli')
}
