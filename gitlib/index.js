/**
 * Tool for managing projects with multiple internal Git repos
 *
 * - Use gitlib.config.js in the project to configure hubs and child repos
 * - Install/push/pull/merge changes to and from child repos to hubs
 */

const path = require('path')
const { execSync } = require('child_process')

const [command, ...args] = process.argv.slice(2)
const cwd = process.cwd()

// Config
const localConfigFileName = 'gitlib.config.local.js'
const configFileName = 'gitlib.config.js'

// TODO: Merge local and public configs

let config = {}
try {
  config = require(path.join(cwd, localConfigFileName))
} catch(e) {
  try {
    config = require(path.join(cwd, configFileName))
  } catch(e) { /**/ }
}

// TODO: Multiple hubs

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
        return name===arg || aliases.includes(arg) || name.indexOf(arg)===0

      }, false)
      return shouldKeep
    })

const logTitle = mod => console.log(`--------------------\nName: ${mod.name}\nPath: ${mod.dest}\n`)

const tmpDir = '_gitl.tmp'

switch (command) {
case 'install':

  run(`if [ -d "${tmpDir}" ]; then rm -rf ${tmpDir}; fi; mkdir -p ${tmpDir}`)

  for (const mod of mods) {

    //const cloneCommand = `git clone ${hub}/${mod.src}.git ${mod.dest} 2>&1 | grep -v "does not exist" || git clone ${hub}/${mod.src} ${mod.dest}`
    const cloneCommand = `git clone ${hub}/${mod.src}.git ${mod.dest}`

    // if (mod.dest.indexOf('vendor/')<0) {
    // For non-vendor, check if it's not already a Git repo
    run(`if [ ! -d "${mod.dest}/.git" ]; then if [ -d "${mod.dest}" ]; then mv ${mod.dest} ${tmpDir}; fi; ${cloneCommand} ; fi;`)
    // } else {
    //   run(`if [ -d "${mod.dest}" ]; then mv ${mod.dest} ${tmpDir}; fi; ${cloneCommand}`)
    // }

    // Add remote
    run(`cd ${mod.dest} && git remote add hub ${hub}/${mod.src}.git`)
  }
  run(`rm -rf ${tmpDir}`)
  console.log()
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
    run(`cd ${mod.dest} && git push hub master`)
    console.log()
  }
}
  break
case 'pull': {
  if (!args.length) args.push('all')
  for (const mod of filteredModules(args)) {
    logTitle(mod)
    try {
      run(`cd ${mod.dest} && git pull hub master --verbose`)
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
    run(`cd ${mod.dest} && git tag ${tag} && git push hub ${tag}`)
  }
}
  break
default:
  console.log('Usage: gitl [command] [module: optional]\n')
  console.log('Commands: install, status, diff, commit, push, pull, log, tag')
  break
}
