import { Helmet } from '@mna/react'

export default async function renderPage({ markup, assets, splitPoints, initState }) {

  // https://github.com/nfl/react-helmet#server-usage
  const helmet = Helmet.renderStatic()

  const head = ['title', 'meta', 'link'].map(type =>
    helmet[type].toString()
  ).join('')

  const foot = helmet.script.toString()

  // Assets

  const styles = [assets['vendor.css'], assets['bundle.css']]
    .filter(f => f)
    .map(href =>
      `<link rel="stylesheet" href=${href}>`
    ).join('')

  const scripts = [assets['vendor.js'], assets['bundle.js']]
    .filter(f => f)
    .map(src =>
      `<script src=${src}></script>`
    ).join('')

  // Support route/chunk splitting

  // context.splitPoints contains split chunk names after render
  // Request them already in page, faster than client async load
  const bundles = splitPoints.map((name, index) => {
    if (assets[`${name}.js`]) {
      return `<script src="${ assets[`${name}.js`] }" defer></script>`
    }
  }).filter(b => b).join('')

  return `<!doctype html>
<html ${ helmet.htmlAttributes.toString()}>
  <head>
    <meta char-set="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    ${ head }
    ${ styles }
    ${ bundles }
    <script>
      window.__INIT_STATE__ = ${ JSON.stringify(initState) }
      window.__SPLIT_POINTS__ = ${ JSON.stringify(splitPoints) }
    </script>
  </head>
  <body ${ helmet.bodyAttributes.toString() }>
    <div id="root">${ markup }</div>
    ${ scripts }
    ${ foot }
  </body>
</html>
`

}
