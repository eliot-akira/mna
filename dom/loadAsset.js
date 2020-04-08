
const onLoadCallbacks = {
  // fileName: { resolve, reject }
}

const loaded = {}

const loadAsset = src => Array.isArray(src)
  ? Promise.all(src.map(loadAsset))
  : new Promise((resolve, reject) => {

    const doc = window.document
    const file = src || ''
    const check = file.split('?')[0]
    const extension = check.split('.').slice(-1)[0]
    const isCss = extension==='css'

    // Already loaded
    if (!check || loaded[check]) return resolve()

    // Resolve when load complete
    if (onLoadCallbacks[check]) {
      onLoadCallbacks[check].push({ resolve, reject })
      return
    }

    onLoadCallbacks[check] = []

    const resolveOnLoad = () => {
      onLoadCallbacks[check].forEach(({ resolve }) => resolve())
      delete onLoadCallbacks[check]
    }
    const rejectOnLoad = () => {
      onLoadCallbacks[check].forEach(({ reject }) => reject())
      delete onLoadCallbacks[check]
    }

    const el = doc.createElement(
      isCss ? 'link' : 'script'
    )

    el.onload = el.onerror = el.onbeforeload = function(e) {

      if (loaded[check]) return

      // e.type = 'load' or 'error'
      if (e.type[0]==='e') {
        console.log('Error loading asset', file)
        rejectOnLoad()
        reject()
        return
      }

      console.log(`Asset loaded: ${file}`)

      loaded[check] = true

      resolveOnLoad()
      resolve()
    }

    if (isCss) {
      el.rel = 'stylesheet'
      el.href = src
    } else {
      el.src = src
    }

    doc.head.appendChild(el)
  })

export default loadAsset
