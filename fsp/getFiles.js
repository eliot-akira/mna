import path from 'path'
import fsp from './core'

const getFiles = async src => {
  const dirs = []
  for (const file of await fsp.readdir(src)) {
    if ((await fsp.stat(path.join(src, file))).isDirectory()) {
      continue
    }
    dirs.push(file)
  }
  return dirs
}

export default getFiles
