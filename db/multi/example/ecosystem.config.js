module.exports = {
  apps: [
    {
      name: 'process1',
      script: 'index.js',
      autorestart: false,
    },
    {
      name: 'process2',
      script: 'index.js',
      autorestart: false,
    },
    {
      name: '@mna/db/multi/server',
      script: '../server.js',
      args: process.env.NEDB_MULTI_PORT,
    },
  ],
};
