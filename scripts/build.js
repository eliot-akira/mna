const path = require('path')
const cwd = process.cwd()
const { execSync } = require('child_process')
const compileBabel = require('../builder/scripts/babel')
const ts = require('../builder/scripts/typescript')
const { fs, glob, chokidar } = require('../builder/helpers')
const libs = require('./libs')

const allLibs = [...libs.client, ...libs.server, ...libs.copy]

const ignorePaths = ['_*/**', '**/_*', '**/_*/**', 'node_modules/**', '**/node_modules/**', '**/.git/**', '**/*.d.ts']
const babelOptions = {
  compact: true,
  comments: false,
  ignore: ignorePaths,
}

function updateVersion({
  src,
  selectedLibs,
  version
}) {

  // Update version in package.json

  const includeRoot = selectedLibs.length===allLibs.length

  const pkgPaths = glob.sync(`{${
    includeRoot ? './package.json,' : ''
  }${
    selectedLibs.map(lib => `${src}/${lib}/package.json`).join(',')
  }}`)

  for (const pkgPath of pkgPaths) {
    const pkg = fs.readJsonSync(pkgPath)
    pkg.version = version
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 })
  }

}

module.exports = function build({ args, options }) {

  const src = '.'
  const dest = '_publish'

  options.watch = options.w
  options.version = options.v

  const selectedLibs =
    args[0]
      ? (args[0]==='all' ? allLibs : args[0].split(','))
      : allLibs

  if (options.version) updateVersion({
    src,
    selectedLibs,
    version: options.version
  })

  // Empty publish folder
  //fs.emptyDirSync(dest)

  const commonFilesPattern = `{${[
    'package.json',
    '**/*.scss'
  ].join(',')}}`

  const ignoreCommonFiles = ['.git', 'node_modules', '**/_*/**', '**/*.js', '**/.hardlinks', '**/*.lock', '**/*.log']

  const getLibSrc = lib => path.join(src, lib)
  const getLibDest = lib => path.join(dest, lib)

  const buildLibType = (target, lib) => {

    const libSrc = getLibSrc(lib)
    const libDest = getLibDest(lib)

    // Ensure empty published module folder
    execSync(`rm -r ${libDest} 2>/dev/null; mkdir -p ${libDest}`)

    const copyFiles = glob.sync(
      commonFilesPattern,
      {
        cwd: libSrc,
        ignore: ignoreCommonFiles
      }
    )

    if (copyFiles) {
      copyFiles.forEach(file => {

        const srcFile = path.join(src, lib, file)
        const destFile = path.join(dest, lib, file)

        fs.ensureDirSync(path.dirname(destFile))
        execSync(`cp ${srcFile} ${destFile}`)
      })
    }

    compileBabel({
      target,
      args: [lib],
      cliOptions: {
        outDir: libDest,
        watch: options.watch,
        verbose: true
      },
      babelOptions,
      root: [`${dest}/${lib}`],
      rename: {}
    }).then(() => console.log())
  }

  const onlySelectedLib = lib => selectedLibs.includes(lib)

  libs.client.filter(onlySelectedLib).forEach(lib => buildLibType('client', lib))
  libs.server.filter(onlySelectedLib).forEach(lib => buildLibType('server', lib))

  libs.copy.filter(onlySelectedLib).forEach(lib => {

    const libSrc = getLibSrc(lib)
    const libDest = getLibDest(lib)
    const copyLibSync = () => {

      execSync(`rsync -vrLptz --delete --exclude=".git" --exclude="node_modules" --exclude="_*" --include="_*.scss" --exclude=".hardlinks" --exclude="*.lock" --exclude="*.log" --exclude="build" --exclude="data" --exclude="src/dynamic" ${libSrc}/ ${libDest}`)

      console.log(`Copied ${libSrc} to ${libDest}`)
    }

    copyLibSync()

    if (!options.watch) return

    const watcher = chokidar.watch(`${libSrc}/**`, {
      ignored: ignorePaths
    })

    // Wait until ready, to ignore initial "add" events
    watcher.on('ready', () => watcher.on('all', (event, item) => {
      console.log(`${event} ${item}`)
      copyLibSync()
    }))
  })

  // Default .npmignore

  selectedLibs.forEach(lib => {
    const npmIgnorePath = `${dest}/${lib}/.npmignore`
    execSync(`if [ ! -f ${npmIgnorePath} ]; then echo "*.test.*\\n" >> ${npmIgnorePath}; fi`)
  })

  // Symlink compiled folders to node_modules, so tests can require them
  const symlinkSrc = path.resolve(dest)
  const symlinkDest = `${dest}/node_modules/@mna`
  execSync(`rm ${symlinkDest} 2>/dev/null ; ln -s ${symlinkSrc} ${symlinkDest}`)

  // Emit TypeScript declaration files

  const tsFiles = glob.sync(`{${
    selectedLibs.map(lib => `${lib}/**/*.ts,${lib}/**/*.tsx`).join(',')
  }}`, { ignore: ignorePaths.concat(['**/*.test.*']) })

  const origSrc = path.resolve(src)

  if (tsFiles.length) {

    execSync(`cp ${src}/global.d.ts ${dest}`)

    // Use dest as current working directory
    process.chdir(dest)

    // Temporary symlink to containing folder
    // Used as root for TypeScript, which emits files to current publish folder
    const tmpSrc = '_src'
    execSync(`rm ${tmpSrc} 2>/dev/null ; ln -s .. ${tmpSrc}`)

    console.log(`
Generate TypeScript declaration files from:

${tsFiles.join('\n')}
`)

    const options = {
      rootDir: tmpSrc,
      lib: 'es6',
      jsx: 'react',
      allowSyntheticDefaultImports: true,
      declaration: true,
      declarationDir: '.',
      emitDeclarationOnly: true,
    }

    const compilerHost = ts.createCompilerHost(options)
    const program = ts.createProgram(tsFiles.map(f => path.join(tmpSrc, f)), options, compilerHost)
    const emitResult = program.emit()

    execSync(`rm ${tmpSrc} 2>/dev/null`)

    process.chdir(origSrc)
  }

}
