const script = process.argv[2] || 'start'
const options = {}
const args = process.argv.slice(3)
  .filter(arg => {
    if (arg[0]!=='-') return true
    arg = arg.substr(1)
    if (arg[0] && arg[0]==='-') arg = arg.substr(1)
    const [key, value = true] = arg.split('=')
    options[key] = value
    return false
  })
process.argv.shift()

require(`./scripts/${script}`)({ args, options })
