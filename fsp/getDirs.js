import path from 'path'
import fsp from './core'

const getDirs = async src => {
  const dirs = []
  for (const file of await fsp.readdir(src)) {
    if ((await fsp.stat(path.join(src, file))).isDirectory()) {
      dirs.push(file)
    }
  }
  return dirs
}

export default getDirs