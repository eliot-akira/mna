import path from 'path'
import fs from '@mna/fsp'
import { API } from '@mna/api'

async function exportStaticRoutes({ url, routes, targetFolder }) {

  const api = new API({ url })

  for (const route of routes) {

    let routeFolder = route
    let routeFile = 'index.html'

    if (route==='404') {
      routeFolder = '' // Root
      routeFile = '404.html' // Should be handled by static file server, i.e., Nginx
      // 404 will hit /404
    }

    const routeFolderFullPath = path.join(targetFolder, routeFolder)
    const routeFileFullPath = path.join(routeFolderFullPath, routeFile)

    const siteRoute = `/${route}`

    const content = await api.get(siteRoute, {}, {
      validateStatus: function (status) {
        return status < 500 // Reject only if the status code is greater than or equal to 500
      }
    })

    await fs.ensureDir(routeFolderFullPath)

    console.log(`Route ${siteRoute} -> ${routeFolder}/${routeFile}`)
    await fs.writeFile(routeFileFullPath, content, 'utf8')
  }

}

export default async function exportStaticSite({
  server, routes
}) {

  const { config: { port } } = server
  const cwd = process.cwd()

  const url = `http://localhost:${port}`
  const targetFolder = path.join(cwd, 'build', 'client')

  console.log(`Exporting routes to ${path.relative(cwd, targetFolder)}`)

  await exportStaticRoutes({ url, routes, targetFolder })

  console.log('Export done')
}
