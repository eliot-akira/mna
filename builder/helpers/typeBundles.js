
module.exports = function createTypeBundles({ type, relativePath, routePrefix = '' }) {

  // Creates config for client and server bundles
  // Based on "type", i.e., page, post
  // Client: Async import, Server: Sync import

  const Type = kebabToPascal(type)

  relativePath = relativePath || `../${type}s`

  const cachedItemNames = {}
  const createItemName = item =>
    cachedItemNames[item]
    || (cachedItemNames[item] =
      `${Type}_${
        item.split('/').map(kebabToPascal).join('_')
      }`
    )

  const cachedItemRoutes = {}
  const createItemRoute = item =>
    cachedItemRoutes[item]
    || (cachedItemRoutes[item] =
      `${routePrefix ? `${routePrefix}/` : ''}${
        item
          .replace(/(^|\/)index$/, '')
          .replace(/(^|\/)readme$/, '')
          .replace(/^home$/, '')
      }`
    )

  const bundleItems = env => items =>
    `// Dynamically generated ${type} index for ${env}

import load from '@mna/react-${env}/load'

`+(items.map(item => {

      const Item = createItemName(item)
      const itemPath = `${relativePath}/${item}`

      return `${
        env==='client'
          ? `const ${Item} = load(() => import(/* webpackChunkName: "${Item}" */ '${itemPath}'))`
          : `const ${Item} = load('${Item}', require('${itemPath}'))`
      }
export { ${Item} }
`
    }).join('\n')
    )
+`
// Map routes to component
export const ${kebabToCamel(type)}Map = {
${items.map(item =>
    `  '${createItemRoute(item)}': ${createItemName(item)}`
  ).join(',\n')}
}
`

  return [bundleItems('client'), bundleItems('server')]
}

// hello-world -> helloWorld
function kebabToCamel(s) {
  return s.replace(/(\-\w)/g, (m) => m[1].toUpperCase())
}

// hello-world -> HelloWorld
function kebabToPascal(s) {
  if (!s || !s.length) return ''
  const rest = s.substr(1)
  return s[0].toUpperCase()+(rest ? kebabToCamel(rest) : '')
}
