import fs from 'fs-extra'

export default fs

/*
import fs from 'fs'
import { promisify } from 'util'


Node.js >10 should have fs Promises API stable
Until then, use promisify

https://nodejs.org/api/fs.html#fs_fs_promises_api

export default fs.promises

const methods = [
  'exists',
  'readFile',
  'writeFile',
  'stat',
  'readdir',
  'mkdir'
]

const fsp = methods.reduce((fsp, method) => {
  fsp[method] = promisify(fs[method])
  return fsp
}, {})

export default fsp
*/
