import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

export default () => {

  const dotenvFiles = [
    `.env.${process.env.NODE_ENV}.local`,
    `.env.${process.env.NODE_ENV}`,
    '.env'
  ].filter(Boolean)

  for (const dotenvFile of dotenvFiles) {
    if (!fs.existsSync(dotenvFile)) continue
    dotenv.config({ path: dotenvFile })
    break
  }

  const isDev = process.env.NODE_ENV!=='production'

  const cwd = process.cwd()

  // From app directory or inside /build in production
  let buildPath = path.join(cwd, 'build')
  if (!fs.existsSync(buildPath)) buildPath = cwd

  const buildClient = path.join(buildPath, 'client')
  const publicPath = buildClient //path.join(buildClient, 'static')
  const dataPath = path.join(cwd, 'data')
  const assetsManifestPath = path.join(publicPath, 'manifest.json')

  let assets

  try {
    assets = JSON.parse(fs.readFileSync(assetsManifestPath, 'utf8'))
  } catch (e) {
    console.error('Missing manifest.json\nPlease restart compile task')
    process.exit(1)
  }

  const config = {
    isDev,

    cwd,
    buildClient,
    publicPath,
    dataPath,
    assets,

    port: process.env.PORT || 3000,
  }

  return config
}
