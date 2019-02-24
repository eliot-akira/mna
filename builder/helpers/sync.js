const runCommand = require('./runCommand')

const rsyncDefaultArgs = [
  '-rLptz', '--delete',
  "--filter=':- .gitignore'",
  '--exclude=".git"',
  '--exclude="node_modules"',
  '--exclude=".hardlinks"',
  '--exclude="_*"',
  '--include="_*.scss"'
]

module.exports = function sync(source, target, ...args) {
  return runCommand('rsync', [...rsyncDefaultArgs, `${source}/`, target, ...args])
}
