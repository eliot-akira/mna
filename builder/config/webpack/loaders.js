const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.scss$/

const {
  client: babelConfigClient,
  server: babelConfigServer
} = require('../babel')

const babelLoaderRegex = /\.(js|jsx|mjs)$/

const babelLoaderClient = {
  test: babelLoaderRegex,
  exclude: /node_modules/,
  use: [
    require.resolve('cache-loader'),
    {
      loader: require.resolve('babel-loader'),
      options: babelConfigClient
    }
  ]
}

const babelLoaderServer = {
  test: babelLoaderRegex,
  exclude: /node_modules/,
  use: [
    require.resolve('cache-loader'),
    {
      loader: require.resolve('babel-loader'),
      options: babelConfigClient
    }
  ]
}

const cssModuleLoaderClient = {
  test: cssModuleRegex,
  use: [
    require.resolve('css-hot-loader'),
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: {
        camelCase: true,
        modules: true,
        importLoaders: 1,
        sourceMap: generateSourceMap,
        localIdentName: '[name]__[local]--[hash:base64:5]',
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
}

const cssLoaderClient = {
  test: cssRegex,
  exclude: cssModuleRegex,
  use: [
    require.resolve('css-hot-loader'),
    MiniCssExtractPlugin.loader,
    require.resolve('css-loader'),
    {
      loader: require.resolve('postcss-loader'),
      options: {
        plugins: [
          require('autoprefixer')({
            browsers: ['last 3 versions', 'ie >= 9', 'Edge <= 15'],
          }),
        ],
        sourceMap: generateSourceMap,
      },
    },
  ],
}

const sassLoaderClient = {
  test: sassRegex,
  use: [
    require.resolve('css-hot-loader'),
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: false,
        sourceMap: generateSourceMap,
      }
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        plugins: [
          require('autoprefixer')({
            browsers: ['last 3 versions', 'ie >= 9', 'Edge <= 15'],
          }),
        ],
        sourceMap: generateSourceMap,
      },
    },
    {
      // Needed for relative URL imports in Sass (such as local fonts)
      // See: https://github.com/bholloway/resolve-url-loader
      loader: require.resolve('resolve-url-loader')
    },
    {
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: generateSourceMap,
      }
    },
  ],
}

const sassLoaderServer = {
  test: sassRegex,
  loader: require.resolve('css-loader'),
}

const cssModuleLoaderServer = {
  test: cssModuleRegex,
  use: [
    {
      loader: require.resolve('css-loader'),
      options: {
        exportOnlyLocals: true,
        camelCase: true,
        importLoaders: 1,
        modules: true,
        localIdentName: '[name]__[local]--[hash:base64:5]',
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: generateSourceMap,
      },
    },
  ],
}

const cssLoaderServer = {
  test: cssRegex,
  exclude: cssModuleRegex,
  loader: require.resolve('css-loader'),
}

const urlLoader = require.resolve('file-loader')

const urlLoaderClient = {
  test: /\.(png|jpe?g|gif|svg)$/,
  loader: urlLoader,
  options: {
    limit: 2048,
    name: 'assets/[name].[hash:8].[ext]',
  },
}

const urlLoaderServer = {
  ...urlLoaderClient,
  options: {
    ...urlLoaderClient.options,
    emitFile: false,
  },
}

const fileLoader = require.resolve('file-loader')

const fontLoaderClient = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  use: [
    { loader: urlLoader, options: {
      limit: 2048,
      name: 'assets/[name].[ext]',
    } },
    //{ loader: fileLoader, options: { name: 'fonts/[name].[ext]' } },
  ],
}

const fontLoaderServer = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  use: [
    { loader: urlLoader, options: {
      limit: 2048,
      name: 'assets/[name].[ext]',
      emitFile: false
    } },
    //{ loader: fileLoader, options: { name: 'fonts/[name].[ext]', emitFile: false } },
  ],
}

const markdownLoaderClient = {
  test: /\.md$/,
  use: [
    //{ loader: require.resolve('file-loader') },
    //{ loader: require.resolve('raw-loader') },
    //{ loader: require.resolve('markdown-loader'), options: {} },
    { loader: require.resolve('../markdown-loader'), options: {} },
  ],
}

const markdownLoaderServer = markdownLoaderClient

const fileLoaderClient = {
  exclude: [/\.(js|css|mjs|html|json)$/],
  use: [
    {
      loader: fileLoader,
      options: {
        name: 'assets/[name].[hash:8].[ext]',
      },
    },
  ],
}

const fileLoaderServer = {
  exclude: [/\.(js|css|mjs|html|json)$/],
  use: [
    {
      loader: fileLoader,
      options: {
        name: 'assets/[name].[hash:8].[ext]',
        emitFile: false,
      },
    },
  ],
}

const client = [
  {
    oneOf: [
      babelLoaderClient,
      cssModuleLoaderClient,
      cssLoaderClient,
      sassLoaderClient,
      urlLoaderClient,
      fontLoaderClient,
      markdownLoaderClient,
      fileLoaderClient,
    ],
  },
]

const server = [
  {
    oneOf: [
      babelLoaderServer,
      cssModuleLoaderServer,
      cssLoaderServer,
      sassLoaderServer,
      urlLoaderServer,
      fontLoaderServer,
      markdownLoaderServer,
      fileLoaderServer,
    ],
  },
]

module.exports = {
  client,
  server,
}
