const loaded = {}

const loadAsset = src => new Promise((resolve, reject) => {

  const file = src || ''
  const check = file.split('?')[0]
  const extension = check.split('.').slice(-1)
  const isCss = extension==='css'

  // Already loaded?
  if (!check || loaded[check]) return resolve()

  const el = window.document.createElement(
    isCss ? 'link' : 'script'
  )

  el.onload = el.onerror = el.onbeforeload = function(e) {
    // e.type = 'load' or 'error'
    if (e.type[0]==='e') {
      console.log('Error loading asset', file)
    } else {
      console.log(`Asset loaded: ${file}`)
    }
    resolve()
  }

  if (isCss) {
    el.rel = 'stylesheet'
    el.href = href
  } else {
    el.src = src
  }
  window.document.head.appendChild(el)

  loaded[check] = true
})

export default loadAsset
