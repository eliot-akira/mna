const presets = [
  [require.resolve('@babel/preset-react'), {
    // React JSX doesn't support SVG with namespace; allow them anyway
    // https://babeljs.io/docs/en/babel-preset-react/#throwifnamespace

    // NOTE: @svgr/webpack still throws: https://github.com/smooth-code/svgr/issues/271
    throwIfNamespace: false
  }],
  require.resolve('@babel/preset-typescript'),
]

const plugins = [

  // @see https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md

  // Stage 1

  // * https://babeljs.io/docs/en/next/babel-plugin-proposal-export-default-from
  require.resolve('@babel/plugin-proposal-export-default-from'),

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-logical-assignment-operators
  //require.resolve('@babel/plugin-proposal-logical-assignment-operators'),

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-pipeline-operator
  [require.resolve('@babel/plugin-proposal-pipeline-operator'), { 'proposal': 'minimal' }],

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-do-expressions
  require.resolve('@babel/plugin-proposal-do-expressions'),

  // Stage 2

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from
  require.resolve('@babel/plugin-proposal-export-namespace-from'),

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-throw-expressions
  require.resolve('@babel/plugin-proposal-throw-expressions'),

  // Stage 3

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-optional-chaining
  [require.resolve('@babel/plugin-proposal-optional-chaining'), { 'loose': false }],

  // https://babeljs.io/docs/en/next/babel-plugin-proposal-nullish-coalescing-operator
  [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { 'loose': false }],

  // * Used for route/chunk-splitting
  require.resolve('@babel/plugin-syntax-dynamic-import'),

  // * https://babeljs.io/docs/en/next/babel-plugin-proposal-class-properties
  [require.resolve('@babel/plugin-proposal-class-properties'), { 'loose': false }],

  // ES2018
  // * https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread
  require.resolve('@babel/plugin-proposal-object-rest-spread'),

  [require.resolve('@babel/plugin-transform-runtime'), {
    corejs: 3, // Match useBuiltIns option below
  }],
  /*[
    require.resolve('babel-plugin-named-asset-import'),
    {
      loaderMap: {
        svg: { ReactComponent: '@svgr/webpack?-prettier,-svgo![path]' },
      },
    },
  ],*/
  require.resolve('./babel-plugin-react-require'),
]

const options = {
  configFile: false,
  presets,
  plugins,
}

const presetEnvOptions = {
  modules: 'commonjs',
  useBuiltIns: 'usage',
  corejs: 3,
}

const clientOptions = {
  ...options,
  presets: [
    [ require.resolve('@babel/preset-env'),
      { ...presetEnvOptions,
        targets: {
          browsers: ["> 0.25%, not dead", "not ie 11", "not op_mini all"] // Was: ['last 2 versions', 'ie >= 9']
        }
      }
    ],
    ...presets
  ]
}

const serverOptions = {
  ...options,
  presets: [
    [ require.resolve('@babel/preset-env'),
      { ...presetEnvOptions,
        targets: {
          node: 'current'
        }
      }
    ],
    ...presets
  ],
  plugins: [
    ...plugins,
    require.resolve('@babel/plugin-transform-modules-commonjs'),
  ]
}

module.exports = {
  client: clientOptions,
  server: serverOptions
}
