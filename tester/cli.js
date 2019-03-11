const path = require('path')
const glob = require('glob')
const tester = require('./index')
const reporter = require('./reporter')
const colors = require('./colors')

const cwd = process.cwd()
const options = {}
const args = process.argv.slice(2)
  .filter(arg => {
    if (arg[0]!=='-') return true
    arg = arg.substr(1)
    if (arg[0] && arg[0]==='-') arg = arg.substr(1)
    const [key, value = true] = arg.split('=')
    options[key] = value
    return false
  })

const test = tester(reporter)
const testDir = args[0] || '**'

const testFilesGlob = `{${
  [
    '**/*.test.js', 'tests/**/*.js'
  ].map(f => `${testDir}/**/${f}`).join(',')
}}`

const ignore = ['**/node_modules/**', '**/.git/**', '**/_*', '**/_*/**']
const exclude = options.x || options.exclude
if (exclude) ignore.push(...exclude.split(',').map(f => `${f}/**`))

let files

const getFiles = () => {
  files = glob.sync(testFilesGlob, { ignore })
}

const onError = e => console.error(e)

const done = () => {

  if (options['-q']) return

  console.log(`${colors.gray}Press enter to run again, "r" to reload test paths, "q" to quit${colors.reset}`)

  process.stdin.once('data', function (b) {
    const data = b.toString().trim()
    if (data==='q') {
      process.exit()
      return
    }
    if (data==='r') getFiles()
    runTests().catch(onError)
  })
}

const clearRequireCache = () => {
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key]
  })
}

let firstTime = true

async function runTests() {

  if (firstTime) firstTime = false
  else clearRequireCache()

  for (const file of files) {

    test.setCurrent({ group: file })

    const filePath = path.join(cwd, file)

    try {

      const result = require(filePath)

      // Test can export an async function
      if (result instanceof Function) await result(test)

      // Test must export a function
      //await result(test)

    } catch (e) {

      // Failed to load test file
      test('Test file', it => it('should load without error', false, e))
    }
  }
  await test.all()
  done()
}

// Shortcut for tests
global.test = test

getFiles()
runTests().catch(onError)
