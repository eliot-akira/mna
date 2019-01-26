const { spawn } = require('child_process')

// Run command - Using child_process.spawn instead of exec,
// which can fail due to output buffering
const runCommand = (command, args, stdout, stderr) => new Promise((resolve, reject) => {

  //console.log([command, ...args].join(' '))

  const p = spawn(command, args, {
    shell: true // Necessary to properly handle quotes in arguments
  })

  const plog = (logger, data) => {
    const d = `${data}`.replace(/^\s+|\s+$/g, '')
    if (!d) return
    logger(d)
  }

  p.stdout.on('data', (data) => plog(stdout || console.log, data))
  p.stderr.on('data', (data) => plog(stderr || console.error, data))

  p.on('close', (code) => resolve(code))
})

module.exports = runCommand