
const libs = {
  // For browser or universal
  client: [
    'api',
    'content-client',
    'dom',
    'event',
    'html',
    'htmr',
    'logger',
    'react',
    'react-client',
    'react-ui',
    'store',
    'utils'
  ],
  // Server only
  server: [
    'fsp',
    'react-server'
  ],
  // Libs that don't need to be compiled
  copy: [
    'auth',
    'builder',
    'content-server',
    'db',
    'server',
    'tester',
    'ui'
  ]
}

module.exports = libs