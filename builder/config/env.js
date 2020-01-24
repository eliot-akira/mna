const fs = require('fs')
const path = require('path')
const paths = require('./paths')
const dotenv = require('dotenv')

delete require.cache[require.resolve('./paths')]

if (!process.env.NODE_ENV) {
  throw new Error(
    'The process.env.NODE_ENV environment variable is required but was not specified.'
  )
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
  paths.dotenv,
].filter(Boolean)

let loadedEnv = {}

for (const dotenvFile of dotenvFiles) {
  if (!fs.existsSync(dotenvFile)) continue
  const envResult = dotenv.config({ path: dotenvFile })
  loadedEnv = envResult.parsed
  console.log('Using environment file', dotenvFile)
  break
}

const appDirectory = fs.realpathSync(process.cwd())

process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter((folder) => folder && !path.isAbsolute(folder))
  .map((folder) => path.resolve(appDirectory, folder))
  .join(path.delimiter)

module.exports = () => {

  const raw = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ...loadedEnv
  }

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {}),
  }

  return { raw, stringified }
}
