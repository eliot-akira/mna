/**
 * Central hub for library of shared repos
 *
 * Projects pull sub-repos from lib
 * Command to pull/merge changes from lib to sub-repos
 * Command to push changes from sub-repo to lib
 */

const path = require('path')
const { execSync } = require('child_process')

const [command, ...args] = process.argv.slice(2)
const cwd = process.cwd()

// Config
const localConfigFileName = 'gitlib.config.local.js'
const configFileName = 'gitlib.config.js'

let config = {}
try {
  config = require(path.join(cwd, localConfigFileName))
} catch(e) {
  try {
    config = require(path.join(cwd, configFileName))
  } catch(e) { /**/ }
}

const { hub = '', modules: mods = [] } = config

const run = (cmd, options = {}) => {

  const {
    capture = false
  } = options

  if (!capture) console.log(cmd)

  try {
    const result = capture
      ? execSync(cmd, { stdio: 'pipe' }).toString()
      : execSync(cmd, { stdio: 'inherit' })

    if (capture) return result
    if (result) console.log(result)

  } catch(e) {
    if (capture) return e.message
    console.error(e.message)
  }
}

const filteredModules = (args) =>
  !args.length ? []
    : mods.filter(mod => {
      const name = mod.name = mod.name || mod.src
      const aliases = mod.alias ? (
        typeof mod.alias==='string' ? [mod.alias] : mod.alias
      ) : []
      const shouldKeep = args.reduce((result, arg) => {
        if (arg==='all') return true
        if (result) return result
        //console.log(`Check "${name}" - ${arg} ${name.indexOf(arg)===0}`)
        //return name.indexOf(arg)===0 // Match beginning of name

        // TODO: Support wildcard
        return name===arg || aliases.includes(arg)

      }, false)
      return shouldKeep
    })

const logTitle = mod => console.log(`--------------------\nName: ${mod.name}\nPath: ${mod.dest}\n`)

const tmpDir = '_gitl.tmp'

switch (command) {
case 'install':

  run(`if [ -d "${tmpDir}" ]; then rm -rf ${tmpDir}; fi; mkdir -p ${tmpDir}`)
  for (const mod of mods) {
    if (mod.dest.indexOf('/vendor/')<0) {
      // For non-vendor, check if it's not already a Git repo
      run(`if [ ! -d "${mod.dest}/.git" ]; then if [ -d "${mod.dest}" ]; then mv ${mod.dest} ${tmpDir}; fi; git clone ${hub}/${mod.src}.git ${mod.dest}; fi;`)
    } else {
      run(`if [ -d "${mod.dest}" ]; then mv ${mod.dest} ${tmpDir}; fi; git clone ${hub}/${mod.src}.git ${mod.dest}`)
    }
  }
  run(`rm -rf ${tmpDir}`)
  console.log('\n')
  break
case 'status': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    const cmd = `cd ${mod.dest} && git status`
    logTitle(mod)
    run(cmd)
  }
}
  break
case 'diff': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    run(`cd ${mod.dest} && git diff --color`)
    console.log()
  }
}
  break
case 'commit': {
  const message = args.pop()
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    run(`cd ${mod.dest} && git add . && git commit -m "${message}"`)
    console.log()
  }
}
  break
case 'push': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    run(`cd ${mod.dest} && git push`)
    console.log()
  }
}
  break
case 'pull': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    try {
      run(`cd ${mod.dest} && git pull --verbose`)
    } catch(e) {
      console.log(e)
    }
    console.log()
  }
}
  break
case 'log': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    run(`cd ${mod.dest} && git log --color --graph --oneline --decorate -n 7`)
  }
}
  break
case 'tag': {
  const tag = args.pop()
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    run(`cd ${mod.dest} && git tag ${tag} && git push origin ${tag}`)
  }
}
  break
default:
  console.log('Usage: gitl [command] [module: optional]\n')
  console.log('Commands: install, status, diff, commit, push, pull, log, tag')
  break
}
