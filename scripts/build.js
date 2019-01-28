const path = require('path')
const cwd = process.cwd()
const { execSync } = require('child_process')
const compileBabel = require('../builder/scripts/babel')
const { fs, glob } = require('../builder/helpers')
const libs = require('./libs')

module.exports = function build({ args, options }) {

  const src = '.'
  const dest = 'publish'

  options.version = options.v
  if (options.version) {

    // For all libs and self, update version in package.json
    const allLibs = [...libs.client, ...libs.server, ...libs.copy]
    const pkgPaths = glob.sync(`{./package.json,${
      allLibs.map(lib => `${src}/${lib}/package.json`).join(',')
    }}`)

    for (const pkgPath of pkgPaths) {
      const pkg = fs.readJsonSync(pkgPath)
      pkg.version = options.version
      fs.writeJsonSync(pkgPath, pkg, { spaces: 2 })
    }
  }

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
      babelOptions: {
        compact: true,
        comments: false,
        ignore: ['_/**', '**/_/**']
      },
      root: [`publish/${lib}`],
      rename: {}
    })
  }

  libs.client.forEach(lib => buildLibType('client', lib))
  libs.server.forEach(lib => buildLibType('server', lib))

  libs.copy.forEach(lib => {

    const libSrc = getLibSrc(lib)
    const libDest = getLibDest(lib)

    execSync(`rsync -vrLptz --delete --exclude=".git" --exclude="node_modules" --exclude="_*" --include="_*.scss" --exclude=".hardlinks" --exclude="*.lock" --exclude="*.log" ${libSrc}/ ${libDest}`)
  })

}
