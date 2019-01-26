const runCommand = require('./runCommand')

const rsyncDefaultArgs = [
  '-rLptz', '--delete',
  "--filter=':- .gitignore'",
  '--exclude=".git"',
  '--exclude="node_modules"'
]

module.exports = function sync(source, target, ...args) {
  return runCommand('rsync', [...rsyncDefaultArgs, `${source}/`, target, ...args])
}
