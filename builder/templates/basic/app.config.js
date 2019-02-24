const path = require('path')

module.exports = async ({ cwd, fs, generate, createTypeBundles }) => {

  // Generate dynamic bundles for automatic route/chunk splitting
  // Can also be used to provide route map to static site export

  const targetFolder = path.join(cwd, 'src', 'dynamic')

  await fs.remove(targetFolder)

  await generate([
    // Pages
    {
      globPattern: 'src/pages/**/index.js',
      watchPattern: 'src/pages/**/index.js',
      map: f => f.replace('src/pages/', '').replace('/index.js', '').replace('.js', ''),
      generate: createTypeBundles({
        type: 'page',
        relativePath: '../pages'
      }),
      target: [
        path.join(targetFolder, 'pages.bundle.client.js'),
        path.join(targetFolder, 'pages.bundle.server.js'),
      ],
    }
  ])
}
