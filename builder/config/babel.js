const presets = [
  require.resolve('@babel/preset-react')
]

const plugins = [
  require.resolve('@babel/plugin-proposal-object-rest-spread'),
  require.resolve('@babel/plugin-proposal-class-properties'),
  require.resolve('@babel/plugin-proposal-export-default-from'),
  require.resolve('@babel/plugin-syntax-dynamic-import'),
  [
    require.resolve('babel-plugin-named-asset-import'),
    {
      loaderMap: {
        svg: { ReactComponent: '@svgr/webpack?-prettier,-svgo![path]' },
      },
    },
  ],
  require.resolve('./babel-plugin-react-require'),
]

const options = {
  configFile: false,
  presets,
  plugins,
}

const clientOptions = {
  ...options,
  presets: [
    [ require.resolve('@babel/preset-env'),
      { 'modules': false,
        'targets': { 'browsers': ['last 2 versions', 'ie >= 9'] }
      }
    ],
    ...presets
  ]
}

const serverOptions = {
  ...options,
  presets: [
    [ require.resolve('@babel/preset-env'),
      { 'modules': false,
        'targets': { 'node': 'current' }
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
