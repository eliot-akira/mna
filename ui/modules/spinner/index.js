import Spin from './spin'

const defaultOptions = {
  lines: 9 // The number of lines to draw
  , length: 7 // The length of each line
  , width: 5 // The line thickness
  , radius: 12 // The radius of the inner circle
  , speed: 1 // Rounds per second
  , trail: 60 // Afterglow percentage
  , hwaccel: true // Whether to use hardware acceleration
}

let spinnerInstance

const start = (props = {}) => {

  const { el, ...options } = props

  // Already spinning
  if (spinnerInstance) return

  spinnerInstance = new Spin({
    ...defaultOptions, ...options
  })
    .spin(el || document.body)
}

const stop = () => {

  //document.body.removeClass('spinner-bg')

  if (!spinnerInstance) return

  spinnerInstance.stop()
  spinnerInstance = null
}

export { start, stop }
