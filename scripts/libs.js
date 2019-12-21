
const libs = {
  // For browser or universal
  client: [
    'api',
    'calendar',
    'content-client',
    'crypt',
    'dom',
    'event',
    'html',
    'htmr',
    'logger',
    'react',
    'react-client',
    'react-ui',
    'schema',
    'socket',
    'store',
    'utils'
  ],
  // Server only
  server: [
    'db',
    'content-server',
    'fsp',
    'mailer',
    'react-server',
    //'tron'
  ],
  // Libs that don't need to be compiled
  copy: [
    'auth',
    'builder',
    'fonts',
    'gitlib',
    'icons',
    'markdown',
    'server',
    //'template-basic',
    'tester',
    'ui'
  ]
}

module.exports = libs
