const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const glob = require('glob')

const cwd = process.cwd()

module.exports = async function generate(configs) {

  const isDev = process.env.NODE_ENV==='development'

  for (const config of configs) {
    await generateAll(config)
    if (!isDev) continue
    await watchAndRegenerate(config)
  }
}

async function watchAndRegenerate(config) {

  const regenEvents = [
    'add',
    //'change',
    'unlink',
    //'addDir',
    //'unlinkDir'
  ]

  const watchPattern = config.watchPattern || config.globPattern
  const onWatch = config.onWatch || ((event, item) => {

    if (regenEvents.indexOf(event) < 0) {
      //console.log(`Dynamic: Ignore "${event}" for ${item}`)
      return
    }

    console.log(`Dynamic: ${event} ${item}`)

    generateAll(config, item, event).catch(console.error)
  })

  console.log('Watching for dynamic code generation:', watchPattern, '\n')

  const watcher = chokidar.watch(watchPattern, {
    ignored: ['**/_*', '**/_*/**']
  })

  // Wait until ready, to ignore initial "add" events
  watcher.on('ready', () => watcher.on('all', onWatch))

}

async function generateAll(config, item, event) {

  const {
    globPattern,
    map: mapItem,
  } = config

  let {
    generate: generateFn,
    target: targetFn
  } = config

  if (!globPattern) throw new Error('Must provide "globPattern"')

  let items

  // Get all files when:
  // - Config has all/index generate fn: on init and every file change
  // - For generate each fn: on init only, just needs current item on file change
  if (generateFn || !item) {

    // TODO: Cache for watch task, and add/remove changed file(s)

    items = glob.sync(globPattern, {
      ignore: ['**/_*', '**/_*/**']
    })

    if (mapItem) {
      for (let i = 0, len = items.length; i < len; i++) {
        items[i] = await mapItem(items[i])
      }
    }
  }

  // Generate each first, to prepare data for index

  if (config.generateEach) {
    if (item) {
      item = mapItem ? (await mapItem(item)) : item
      await generateEach(config, item, event)
    } else {
      for (const item of items) {
        await generateEach(config, item, 'add')
      }
    }
  }

  if (!generateFn) return

  return run({ generateFn, targetFn, items, item, event })
}

async function generateEach(config, item, event) {

  const {
    generateEach: generateFn,
    targetEach: targetFn
  } = config

  return await run({ generateFn, targetFn, item, event })
}

async function run({
  generateFn, targetFn,
  items, item, event
}) {

  const fns = Array.isArray(generateFn) ? generateFn : [generateFn]
  const targetFns = Array.isArray(targetFn) ? targetFn : [targetFn]

  for (let i = 0, len = fns.length; i < len; i++) {

    const fn = fns[i]

    const content = await (items
      ? fn(items, item, event) // Generate all/index
      : fn(item, event) // Generate each
    )
    const target = targetFns[i]
    if (!target) throw new Error(`No target for generate function ${i}`)

    const targetPath = target instanceof Function
      ? await (items
        ? target(items, item, event)
        : target(item, event)
      )
      : target

    console.log('Generated', path.relative(cwd, targetPath))
    //console.log(content)

    await fs.ensureDir(path.dirname(targetPath))
    await fs.writeFile(targetPath, content)
  }
}
