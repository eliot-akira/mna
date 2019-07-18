const createBabelOptions = require('@babel/cli/lib/babel/options').default
const babelConfig = require('../config/babel')

module.exports = function babel(props = {}) {

  const {
    target = 'server', // or client
    cliOptions = {},
    babelOptions = {},
    args = [],
    root = [],
    alias = {},
    rename = {}
  } = props

  const opts = createBabelOptions([null, 'babel', ...args])

  const additionalPlugins = []

  if (target==='client') {
    additionalPlugins.push(
      require.resolve('@babel/plugin-transform-modules-commonjs')
    )
  }

  if (root.length || Object.keys(alias).length) {
    additionalPlugins.push(
      [require.resolve('babel-plugin-module-resolver'), { root, alias }]
    )
  }

  const replacements = Object.keys(rename).map(original => {
    const replacement = rename[original]
    return { original, replacement }
  })

  if (replacements.length) additionalPlugins.push(
    [require.resolve('babel-plugin-transform-rename-import'), { replacements }]
  )

  // additionalPlugins.push(
  //   require.resolve('../config/babel-plugin-add-module-exports')
  // )

  Object.assign(opts.cliOptions, {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ...cliOptions
  })

  Object.assign(opts.babelOptions, {
    ...babelConfig[target],
    ...babelOptions,
    plugins: [
      ...babelConfig[target].plugins,
      ...(babelOptions.plugins || []),
      ...additionalPlugins
    ]
  })

  const command = opts.cliOptions.outDir
    ? require('@babel/cli/lib/babel/dir').default
    : require('@babel/cli/lib/babel/file').default

  return command(opts).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
